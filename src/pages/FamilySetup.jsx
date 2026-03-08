import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

const FamilySetup = () => {
  const { user, fetchUser } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState("create"); // create | join
  const [familyName, setFamilyName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateFamily = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axiosInstance.post("api/family/create/", {
        name: familyName,
      });

      await fetchUser();
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create family"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleJoinFamily = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axiosInstance.post("api/family/join/", {
        code: inviteCode,
      });

      await fetchUser();
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid invite code"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">
          Welcome {user?.fname} 👋
        </h2>

        {/* Toggle Buttons */}
        <div style={{ display: "flex", marginBottom: "20px" }}>
          <button
            className="auth-btn"
            style={{
              flex: 1,
              marginRight: "10px",
              opacity: mode === "create" ? 1 : 0.6,
            }}
            onClick={() => {
              setMode("create");
              setError("");
            }}
          >
            Create
          </button>

          <button
            className="auth-btn"
            style={{
              flex: 1,
              opacity: mode === "join" ? 1 : 0.6,
            }}
            onClick={() => {
              setMode("join");
              setError("");
            }}
          >
            Join
          </button>
        </div>

        {/* Create Family Form */}
        {mode === "create" && (
          <form onSubmit={handleCreateFamily}>
            <div className="input-group">
              <input
                type="text"
                required
                placeholder=" "
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
              />
              <label>Family Name</label>
            </div>

            {error && (
              <p style={{ color: "#FF6584", fontSize: "12px", marginBottom: "15px" }}>
                {error}
              </p>
            )}

            <button className="auth-btn" disabled={loading}>
              {loading ? "Creating..." : "Create Family"}
            </button>
          </form>
        )}

        {/* Join Family Form */}
        {mode === "join" && (
          <form onSubmit={handleJoinFamily}>
            <div className="input-group">
              <input
                type="text"
                required
                placeholder=" "
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
              />
              <label>Invite Code</label>
            </div>

            {error && (
              <p style={{ color: "#FF6584", fontSize: "12px", marginBottom: "15px" }}>
                {error}
              </p>
            )}

            <button className="auth-btn" disabled={loading}>
              {loading ? "Joining..." : "Join Family"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default FamilySetup;