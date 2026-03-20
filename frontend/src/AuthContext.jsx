import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const API_BASE_URL = "http://localhost:8080/api/v1/auth";

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        return { success: true, user: data };
      }

      return {
        success: false,
        message: data?.detail || data?.message || "Login failed",
      };
    } catch (error) {
      console.error("Login failed:", error);
      return {
        success: false,
        message: error.message || "Network error",
      };
    }
  };

  const register = async (name, email, phone, password, confirmPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok) {
        return { success: true, data };
      }

      return {
        success: false,
        message: data?.detail || data?.message || "Registration failed",
      };
    } catch (error) {
      console.error("Registration failed:", error);
      return {
        success: false,
        message: error.message || "Network error",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};