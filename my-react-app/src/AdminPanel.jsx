import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

export default function AdminPanel({ products, setProducts, categories, setCategories }) {
  const [user, setUser] = useState(null);
  
  // Auth State
  const [authMode, setAuthMode] = useState("login"); // login or register
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [admins, setAdmins] = useState([{ username: "admin", password: "password" }]); // Mock DB

  const handleAuth = () => {
    if (authMode === "login") {
      const admin = admins.find(a => a.username === username && a.password === password);
      if (admin) {
        setUser(admin);
      } else {
        alert("Invalid credentials");
      }
    } else {
      if (username && password) {
        setAdmins([...admins, { username, password }]);
        alert("Account created! Please login.");
        setAuthMode("login");
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    setUsername("");
    setPassword("");
  };

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ background: "white", padding: 40, borderRadius: 12, boxShadow: "0 4px 6px rgba(0,0,0,0.1)", width: "100%", maxWidth: 400 }}>
          <h2 style={{ marginBottom: 20, textAlign: "center", fontSize: 24, fontWeight: "bold" }}>
            Admin {authMode === "login" ? "Login" : "Register"}
          </h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ width: "100%", padding: 12, marginBottom: 10, border: "1px solid #ddd", borderRadius: 6 }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: "100%", padding: 12, marginBottom: 20, border: "1px solid #ddd", borderRadius: 6 }}
          />
          <button onClick={handleAuth} style={{ width: "100%", padding: 12, background: "#2563eb", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: "bold" }}>
            {authMode === "login" ? "Sign In" : "Create Account"}
          </button>
          <div style={{ marginTop: 16, textAlign: "center", fontSize: 14 }}>
            <span style={{ color: "#666" }}>{authMode === "login" ? "No account?" : "Have an account?"} </span>
            <button 
                onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
                style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", textDecoration: "underline" }}
            >
                {authMode === "login" ? "Create one" : "Login"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ display: "flex" }}>
        <AdminSidebar onLogout={handleLogout} username={user.username} />
        <main style={{ flex: 1, padding: 24, overflowY: 'auto', height: 'calc(100vh - 128px)' }}>
          <Outlet context={{ products, setProducts, categories, setCategories }} />
        </main>
      </div>
    </div>
  );
}

function AdminSidebar({ onLogout, username }) {
  const location = useLocation();
  const navItems = [
    { path: "/admin", label: "Dashboard", icon: "📊" },
    { path: "/admin/products", label: "Products", icon: "📦" },
    { path: "/admin/categories", label: "Categories", icon: "🏷️" },
  ];

  return (
    <aside style={{ width: 250, background: "white", borderRight: "1px solid #e5e7eb", padding: "24px 16px", display: "flex", flexDirection: "column", height: 'calc(100vh - 128px)' }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: "bold", color: "#111827", marginBottom: 4 }}>Admin Panel</h2>
        <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 24 }}>Welcome, {username}</p>
      </div>
      <nav style={{ flex: 1 }}>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {navItems.map(item => (
            <li key={item.path}>
              <Link to={item.path} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderRadius: 8, textDecoration: "none",
                color: location.pathname === item.path ? "#2563eb" : "#374151",
                background: location.pathname === item.path ? "#eff6ff" : "transparent",
                fontWeight: location.pathname === item.path ? 600 : 400,
                marginBottom: 4, transition: "background 0.2s",
              }}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <button onClick={onLogout} style={{ padding: "10px 16px", background: "#fee2e2", color: "#ef4444", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
        <span style={{ fontSize: 18 }}>🚪</span>
        <span>Logout</span>
      </button>
    </aside>
  );
}