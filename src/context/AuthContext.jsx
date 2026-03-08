import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axios";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const accessToken = localStorage.getItem("accessToken");
  const isAuthenticated = !!accessToken;

  // ✅ Fetch Logged-in User
  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get("api/auth/me/");
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user");
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Auto fetch on app load
  useEffect(() => {
    if (isAuthenticated) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = (access, refresh) => {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    fetchUser(); // immediately fetch user
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
  
      if (refreshToken) {
        await axiosInstance.post("api/auth/logout/", {
          refresh: refreshToken,
        });
      }
    } catch (error) {
      console.error("Logout API failed");
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        fetchUser,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);