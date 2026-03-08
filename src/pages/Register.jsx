import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import "../styles/auth.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    mobile: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    console.log("🚀 Register Attempt Started");
    console.log("📦 Payload:", formData);

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axiosInstance.post(
        "api/auth/register/",
        formData
      );

      console.log("✅ Register Success:", response.data);

      setSuccess("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      console.error("❌ Register Failed:", err);

      setError(
        err.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
      console.log("🏁 Register Attempt Finished");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>

        <form onSubmit={handleRegister}>
          <div className="form-row">
            <div className="input-group">
              <input
                type="text"
                name="fname"
                required
                placeholder=" "
                value={formData.fname}
                onChange={handleChange}
              />
              <label>First Name</label>
            </div>

            <div className="input-group">
              <input
                type="text"
                name="lname"
                required
                placeholder=" "
                value={formData.lname}
                onChange={handleChange}
              />
              <label>Last Name</label>
            </div>
          </div>

          <div className="input-group">
            <input
              type="text"
              name="mobile"
              required
              placeholder=" "
              value={formData.mobile}
              onChange={handleChange}
            />
            <label>Mobile Number</label>
          </div>

          <div className="input-group">
            <input
              type="email"
              name="email"
              required
              placeholder=" "
              value={formData.email}
              onChange={handleChange}
            />
            <label>Email Address</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              required
              placeholder=" "
              value={formData.password}
              onChange={handleChange}
            />
            <label>Password</label>
          </div>

          {error && (
            <p style={{ color: "#FF6584", fontSize: "12px", marginBottom: "15px" }}>
              {error}
            </p>
          )}

          {success && (
            <p style={{ color: "#6C63FF", fontSize: "12px", marginBottom: "15px" }}>
              {success}
            </p>
          )}

          <button className="auth-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>
            Sign In
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;