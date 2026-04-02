import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../../styles/layout.css";

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />

      {/* Overlay (mobile only) */}
      {isSidebarOpen && (
        <div className="overlay" onClick={closeSidebar}></div>
      )}

      {/* Topbar */}
      <Topbar toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="main-content">
        {children}
      </div>
    </>
  );
};

export default MainLayout;