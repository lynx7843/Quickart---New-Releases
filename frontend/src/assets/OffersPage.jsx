import React from 'react';
import { Tag, Clock, Copy, Check } from 'lucide-react';

const OffersPage = () => {
  const offers = [
    { id: 1, title: "Summer Sale", discount: "50% OFF", code: "SUMMER50", exp: "2 days", bg: "linear-gradient(135deg, #FF6B6B, #FF8E53)" },
    { id: 2, title: "Tech Bonanza", discount: "Flat $100 OFF", code: "TECH100", exp: "5 hours", bg: "linear-gradient(135deg, #4facfe, #00f2fe)" },
    { id: 3, title: "New User", discount: "20% OFF", code: "WELCOME20", exp: "Never", bg: "linear-gradient(135deg, #43e97b, #38f9d7)" },
  ];

  return (
    <div style={{ padding: "40px 20px", background: "#f8f9fa", minHeight: "100vh", fontFamily: "'Sora', sans-serif" }}>
      <h1 style={{ fontSize: "32px", fontWeight: 800, textAlign: "center", marginBottom: "40px", color: "#1a1a1a" }}>Exclusive <span style={{ color: "#FF6B00" }}>Offers</span></h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", maxWidth: "1000px", margin: "0 auto" }}>
        {offers.map(offer => (
          <div key={offer.id} style={{ background: "white", borderRadius: "20px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", position: "relative" }}>
            <div style={{ height: "120px", background: offer.bg, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "36px", fontWeight: 900 }}>
              {offer.discount}
            </div>
            <div style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>{offer.title}</h3>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#666", marginBottom: "20px", fontSize: "14px" }}>
                <Clock size={16} /> Expires in: {offer.exp}
              </div>
              <div style={{ background: "#f0f0f0", padding: "12px", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px dashed #ccc" }}>
                <span style={{ fontFamily: "monospace", fontSize: "16px", fontWeight: 700, color: "#333" }}>{offer.code}</span>
                <button style={{ background: "none", border: "none", cursor: "pointer", color: "#FF6B00", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                  <Copy size={14} /> Copy
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OffersPage;