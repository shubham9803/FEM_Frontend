import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import FamilySetup from "../pages/FamilySetup";
import MainLayout from "../components/layout/MainLayout";
import FamilyInfo from "../pages/FamilyInfo";
import ExpenseHistory from "../pages/ExpenseHistory";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public Routes (only when NOT logged in) */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected Route (only when logged in) */}
     <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <MainLayout>
        <Dashboard />
      </MainLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/family-info"
  element={
    <ProtectedRoute>
      <MainLayout>
        <FamilyInfo />
      </MainLayout>
    </ProtectedRoute>
  }
/>
<Route
  path="/history"
  element={
    <ProtectedRoute>
      <MainLayout>
        <ExpenseHistory />
      </MainLayout>
    </ProtectedRoute>
  }
/>
      <Route
  path="/family-setup"
  element={
    <ProtectedRoute>
      <FamilySetup />
    </ProtectedRoute>
  }
/>

      {/* 404 */}
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
};

export default AppRoutes;