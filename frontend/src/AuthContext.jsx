import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const API_BASE = "http://localhost:8080/api/v1";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("quickart_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });


  const authHeaders = () => ({
    "Content-Type": "application/json",
    ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
  });

  const login = async (email, password) => {
    try {
      const res  = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
  
        localStorage.setItem("quickart_user", JSON.stringify(data));
        setUser(data);
        return { success: true, user: data };
      }
      return { success: false, message: data?.message || "Login failed" };
    } catch (err) {
      return { success: false, message: err.message || "Network error" };
    }
  };

  const register = async (name, email, phone, password, confirmPassword, role = "CUSTOMER") => {
    try {
      const res  = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password, confirmPassword, role }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) return { success: true, data };
      return { success: false, message: data?.message || "Registration failed" };
    } catch (err) {
      return { success: false, message: err.message || "Network error" };
    }
  };

  const logout = () => {
    localStorage.removeItem("quickart_user");
    setUser(null);
  };

  const isSeller = user?.role === "SELLER" || user?.role === "ADMIN";
  const isAdmin  = user?.role === "ADMIN";

  return (
    <AuthContext.Provider value={{ user, login, logout, register, authHeaders, isSeller, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


export const useApiFetch = () => {
  const { authHeaders } = useAuth();
  return (url, options = {}) =>
    fetch(`${API_BASE}${url}`, {
      ...options,
      headers: { ...authHeaders(), ...(options.headers || {}) },
    });
};
