import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/layout.css";

const Sidebar = ({ isOpen, closeSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation(); // To track which page is active
  const { logout } = useAuth();

 const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: "📊" },
  { name: "History", path: "/history", icon: "📅" }, // Add this
  { name: "Family Info", path: "/family-info", icon: "👨‍👩-👧" },
];

  const handleNavigation = (path) => {
    navigate(path);
    closeSidebar();
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-top">
        <h3 className="sidebar-logo">💰 FEM</h3>
        <nav className="menu-list">
          {menuItems.map((item) => (
            <div
              key={item.path}
              className={`sidebar-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => handleNavigation(item.path)}
            >
              <span className="icon">{item.icon}</span>
              {item.name}
            </div>
          ))}
        </nav>
      </div>

      <button className="logout-btn sidebar-logout" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default Sidebar;