import React from 'react';
import { Trophy, Star } from 'lucide-react';

const TopSellingPage = () => {
  const products = [
    { id: 1, name: "Pro Noise Cancelling Headphones", sales: "15k+", rating: 4.9, price: "LKR 28,000", image: "🎧" },
    { id: 2, name: "Ultra HD Action Camera", sales: "12k+", rating: 4.8, price: "LKR 45,000", image: "📷" },
    { id: 3, name: "Ergonomic Office Chair", sales: "10k+", rating: 4.7, price: "LKR 32,500", image: "🪑" },
  ];

  return (
    <div style={{ padding: "40px 20px", background: "#1a1a1a", minHeight: "100vh", fontFamily: "'Sora', sans-serif", color: "white" }}>
      <h1 style={{ fontSize: "36px", fontWeight: 800, textAlign: "center", marginBottom: "50px", textTransform: "uppercase", letterSpacing: "2px" }}>
        <Trophy color="#FFD700" size={40} style={{ display: "inline", marginBottom: "-5px", marginRight: "10px" }} />
        Hall of Fame
      </h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "30px", maxWidth: "1100px", margin: "0 auto" }}>
        {products.map((p, i) => (
          <div key={p.id} style={{ background: "#2a2a2a", borderRadius: "20px", padding: "30px", position: "relative", border: "1px solid #333" }}>
            <div style={{ position: "absolute", top: "-20px", left: "20px", background: "#FFD700", color: "black", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "20px", boxShadow: "0 10px 20px rgba(255, 215, 0, 0.3)" }}>{i + 1}</div>
            <div style={{ fontSize: "60px", textAlign: "center", marginBottom: "20px" }}>{p.image}</div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "10px" }}>{p.name}</h3>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#888", fontSize: "14px" }}>
              <span>{p.sales} sold</span>
              <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#FFD700" }}><Star size={14} fill="#FFD700" /> {p.rating}</span>
            </div>
            <div style={{ marginTop: "20px", fontSize: "24px", fontWeight: 800, color: "#FF6B00" }}>{p.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopSellingPage;