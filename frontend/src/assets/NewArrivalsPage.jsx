import React from 'react';
import { Sparkles } from 'lucide-react';

const NewArrivalsPage = () => {
  return (
    <div style={{ padding: "60px 20px", background: "#fff", minHeight: "100vh", fontFamily: "'Sora', sans-serif" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "36px", fontWeight: 800, marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
          <Sparkles color="#557a8c" /> New Arrivals
        </h1>
        <p style={{ color: "#666", maxWidth: "600px", margin: "0 auto" }}>Check out the latest additions to our collection.</p>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} style={{ border: "1px solid #eee", borderRadius: "16px", padding: "20px", textAlign: "center" }}>
            <div style={{ background: "#f8f9fa", height: "200px", borderRadius: "12px", marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" }}>📦</div>
            <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>New Product {i}</h3>
            <p style={{ color: "#557a8c", fontWeight: 700 }}>LKR {15000 + i * 1000}</p>
            <div style={{ fontSize: "12px", color: "#10b981", marginTop: "8px", fontWeight: 600 }}>Just Landed</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewArrivalsPage;