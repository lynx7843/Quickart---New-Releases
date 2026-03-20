import React from 'react';
import { TrendingUp, Search } from 'lucide-react';

const FreqSearchPage = () => {
  const trends = [
    { term: "Wireless Earbuds", volume: 98, change: "+12%" },
    { term: "Gaming Laptop", volume: 85, change: "+5%" },
    { term: "Smart Watch", volume: 76, change: "+22%" },
    { term: "Running Shoes", volume: 64, change: "+8%" },
    { term: "4K Monitor", volume: 55, change: "-2%" },
  ];

  return (
    <div style={{ padding: "40px 20px", background: "#fff", minHeight: "100vh", fontFamily: "'Sora', sans-serif" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 800, marginBottom: "30px", display: "flex", alignItems: "center", gap: "12px" }}>
          <TrendingUp color="#557a8c" /> Trending Searches
        </h1>
        
        <div style={{ background: "#f8f9fa", borderRadius: "16px", padding: "24px" }}>
          {trends.map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", borderBottom: i !== trends.length - 1 ? "1px solid #eee" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ fontSize: "18px", fontWeight: 900, color: "#ddd" }}>#{i + 1}</span>
                <span style={{ fontSize: "16px", fontWeight: 600 }}>{t.term}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <div style={{ height: "6px", width: "100px", background: "#eee", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${t.volume}%`, background: "#557a8c" }}></div>
                </div>
                <span style={{ fontSize: "14px", fontWeight: 700, color: t.change.startsWith("+") ? "#10b981" : "#ef4444" }}>{t.change}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FreqSearchPage;