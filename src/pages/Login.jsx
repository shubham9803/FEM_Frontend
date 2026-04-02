import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("🚀 Login Attempt Started");
    console.log("📱 Mobile:", mobile);

    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post("api/auth/login/", {
        mobile,
        password,
      });

      console.log("✅ Login API Success");
      console.log("🔐 Full Response:", response.data);

      const { access, refresh } = response.data;

      console.log("🔑 Access Token:", access);
      console.log("🔄 Refresh Token:", refresh);

      login(access, refresh);

      console.log("➡️ Redirecting to Dashboard");

      navigate("/dashboard");

    } catch (err) {
      console.error("❌ Login Failed");
      console.error("Error Object:", err);

      setError(
        err.response?.data?.message ||
        "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
      console.log("🏁 Login Attempt Finished");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">FEM Login</h2>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="text"
              required
              placeholder=" "
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
            <label>Mobile Number</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              required
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Password</label>
          </div>

          {error && (
            <p style={{ color: "#FF6584", fontSize: "12px", marginBottom: "15px" }}>
              {error}
            </p>
          )}

          <button className="auth-btn" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/register")}>
            Register
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;