import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import "../../styles/layout.css";

const Topbar = ({ toggleSidebar }) => {
  const [family, setFamily] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchFamily = async () => {
      try {
        const res = await axiosInstance.get("api/family/me/");
        setFamily(res.data);
      } catch (err) {
        console.error("Error fetching family info:", err);
      }
    };
    fetchFamily();
  }, []);

  const handleCopy = () => {
    if (family?.code) {
      navigator.clipboard.writeText(family.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset toast after 2s
    }
  };

  return (
    <header className="topbar glass-card">
      <div className="topbar-left">
        <button className="hamburger-btn" onClick={toggleSidebar} aria-label="Toggle Sidebar">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        <h2 className="app-logo">
          <span className="emoji">💰</span> 
          <span className="logo-text">FEM</span>
        </h2>
      </div>

      {family?.code && (
        <div className="family-badge" onClick={handleCopy} title="Click to copy code">
          <small className="badge-label">Family Code</small>
          <div className="code-container">
            <strong>{family.code}</strong>
            <span className={`copy-icon ${copied ? "copied" : ""}`}>
              {copied ? "✓" : "📋"}
            </span>
          </div>
          {copied && <span className="copy-toast">Copied!</span>}
        </div>
      )}
    </header>
  );
};

export default Topbar;