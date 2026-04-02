import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import "../styles/FamilyInfo.css";

const FamilyInfo = () => {
  const [family, setFamily] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [familyRes, membersRes] = await Promise.all([
          axiosInstance.get("api/family/me/"),
          axiosInstance.get("api/family/members/")
        ]);
        setFamily(familyRes.data);
        setMembers(membersRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const copyCode = () => {
    navigator.clipboard.writeText(family?.code);
    alert("Family Code copied!");
  };

  if (loading) return <div className="loader">Loading Family...</div>;

  return (
    <div className="family-container">
      {/* Family Identity Section */}
      <div className="glass-card family-header-card">
        <div className="family-info-text">
          <small>Family Name</small>
          <h2>{family?.name}</h2>
        </div>
        <div className="family-code-box" onClick={copyCode} title="Click to copy">
          <small>Invite Code (Click to Copy)</small>
          <div className="code-display">{family?.code}</div>
        </div>
      </div>

      {/* Members Grid */}
      <h3 className="section-title">Family Members ({members.length})</h3>
      <div className="members-grid">
        {members.map((m) => (
          <div key={m.id} className="glass-card member-card">
            <div className="member-avatar">
              {m.fname[0]}{m.lname[0]}
            </div>
            <div className="member-details">
              <h4>{m.fname} {m.lname}</h4>
              <p>{m.email || "Family Member"}</p>
            </div>
            <span className="role-badge">Member</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FamilyInfo;