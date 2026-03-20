import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutGrid, Tag, TrendingUp, Trophy, Phone, HelpCircle, Info } from "lucide-react";

export default function SecondNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "All Categories", icon: <LayoutGrid size={16} />, path: "/all-categories" },
    { label: "Offers", icon: <Tag size={16} />, path: "/offers" },
    { label: "Trending", icon: <TrendingUp size={16} />, path: "/frequent-search" },
    { label: "Top Selling", icon: <Trophy size={16} />, path: "/top-selling" },
    { label: "Contact Us", icon: <Phone size={16} />, path: "/contact-us" },
    { label: "Help Center", icon: <HelpCircle size={16} />, path: "/help-center" },
    { label: "About Us", icon: <Info size={16} />, path: "/about-us" },
  ];

  return (
    <div className="sec-nav-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;700&display=swap');

        .sec-nav-wrapper {
          background: #ffffff;
          border-bottom: 1px solid #eef1f6;
          padding: 0 20px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          z-index: 90;
        }

        .sec-nav-container {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
          width: 100%;
          max-width: 1200px;
          height: 100%;
        }
        .sec-nav-container::-webkit-scrollbar { display: none; }

        .sec-nav-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 12px;
          border: 1px solid transparent;
          background: transparent;
          color: #64748b;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .sec-nav-btn:hover {
          color: #1a1a1a;
          background: #f8fafc;
          border-color: #e2e8f0;
          transform: translateY(-1px);
        }

        .sec-nav-btn.active {
          color: #557a8c;
          background: rgba(85, 122, 140, 0.08);
          border-color: rgba(85, 122, 140, 0.2);
          font-weight: 700;
        }

        .sec-nav-btn svg {
          stroke-width: 2;
        }
      `}</style>
      
      <div className="sec-nav-container">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button 
              key={item.label} 
              className={`sec-nav-btn ${isActive ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}