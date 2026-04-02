import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import "../../styles/layout.css";

const Topbar = ({ toggleSidebar }) => {
  const [family, setFamily] = useState(null);

  useEffect(() => {
    const fetchFamily = async () => {
      try {
        const res = await axiosInstance.get("api/family/me/");
        setFamily(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFamily();
  }, []);

  return (
    <div className="topbar">

      {/* ☰ Hamburger (mobile) */}
      <div className="hamburger" onClick={toggleSidebar}>
        ☰
      </div>

      {/* App Name */}
      <h2>💰 FEM</h2>

      {/* Family Code */}
      <div>
        Family Code: <strong>{family?.code}</strong>
      </div>

    </div>
  );
};

export default Topbar;