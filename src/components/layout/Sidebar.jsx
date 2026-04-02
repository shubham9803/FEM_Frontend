import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/layout.css";

const Sidebar = ({ isOpen, closeSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { logout } = useAuth();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "History", path: "/history", icon: "📅" },
    { name: "Family Info", path: "/family-info", icon: "👨‍👩-👧" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    // On mobile, this will close the drawer after a click
    closeSidebar();
  };

  return (
    /* Updated Class Logic: 
       We removed "closed". On desktop, 'sidebar' has no extra class and stays visible.
       On mobile, 'open' is added only when the hamburger is clicked.
    */
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-top">
        <h3 className="sidebar-logo">💰 FEM</h3>
        <nav className="menu-list">
          {menuItems.map((item) => (
            <div
              key={item.path}
              className={`sidebar-item ${
                location.pathname === item.path ? "active" : ""
              }`}
              onClick={() => handleNavigation(item.path)}
            >
              <span className="icon">{item.icon}</span>
              <span className="menu-text">{item.name}</span>
            </div>
          ))}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <button className="logout-btn sidebar-logout" onClick={logout}>
          <span>🚪</span> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;