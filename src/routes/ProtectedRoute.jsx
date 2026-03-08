import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  // 🚀 Prevent infinite redirect loop
  if (
    user.family === null &&
    location.pathname !== "/family-setup"
  ) {
    return <Navigate to="/family-setup" replace />;
  }

  return children;
};

export default ProtectedRoute;