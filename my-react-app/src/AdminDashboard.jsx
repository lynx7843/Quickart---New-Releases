import { useOutletContext } from "react-router-dom";

export default function AdminDashboard() {
  const { products, categories } = useOutletContext();

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: "bold", color: "#111827", marginBottom: 24 }}>Dashboard</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 24 }}>
        <div style={{ background: "white", padding: 24, borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h3 style={{ fontSize: 16, color: "#6b7280", marginBottom: 8 }}>Total Products</h3>
          <p style={{ fontSize: 36, fontWeight: "bold", color: "#2563eb" }}>{products.length}</p>
        </div>
        <div style={{ background: "white", padding: 24, borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h3 style={{ fontSize: 16, color: "#6b7280", marginBottom: 8 }}>Total Categories</h3>
          <p style={{ fontSize: 36, fontWeight: "bold", color: "#10b981" }}>{categories.length}</p>
        </div>
        <div style={{ background: "white", padding: 24, borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h3 style={{ fontSize: 16, color: "#6b7280", marginBottom: 8 }}>Admin Users</h3>
          <p style={{ fontSize: 36, fontWeight: "bold", color: "#ef4444" }}>1</p>
        </div>
      </div>
    </div>
  );
}