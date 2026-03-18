import React from 'react';

const BrandStorePage = () => {
  const brands = ["Nike", "Samsung", "Apple", "Sony", "Adidas", "Puma", "Dell", "HP"];

  return (
    <div style={{ padding: "60px 20px", background: "#f8f9fa", minHeight: "100vh", fontFamily: "'Sora', sans-serif" }}>
      <h1 style={{ fontSize: "36px", fontWeight: 800, textAlign: "center", marginBottom: "40px" }}>Official Brand Stores</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "24px", maxWidth: "1000px", margin: "0 auto" }}>
        {brands.map((brand, i) => (
          <div key={i} style={{ background: "white", padding: "40px", borderRadius: "16px", textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", cursor: "pointer", transition: "transform 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            <div style={{ fontSize: "24px", fontWeight: 800, color: "#333" }}>{brand}</div>
            <p style={{ fontSize: "12px", color: "#888", marginTop: "8px" }}>Official Store</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandStorePage;