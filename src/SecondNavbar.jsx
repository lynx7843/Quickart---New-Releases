import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Modern styling matching QuickArtAI theme
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,400&display=swap');

  .sn-wrapper {
    width: 100%;
    background: #ffffff;
    border-bottom: 1px solid #f0f0f0;
    padding: 12px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  }

  .sn-brand {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 18px;
    color: #1a1a1a;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .sn-brand-icon {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, #FF5C1A, #FF8A4C);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    color: white;
    font-size: 14px;
  }

  .sn-links {
    display: flex;
    gap: 8px;
    background: #F4F6FA;
    padding: 4px;
    border-radius: 12px;
  }

  .sn-link {
    padding: 8px 16px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    background: transparent;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .sn-link:hover {
    color: #1a1a1a;
    background: rgba(255,255,255,0.5);
  }

  .sn-link.active {
    background: #ffffff;
    color: #FF5C1A;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }

  .sn-user {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .sn-btn-icon {
    width: 36px; height: 36px;
    border-radius: 10px;
    border: 1px solid #f0f0f0;
    background: white;
    color: #64748b;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
  }
  .sn-btn-icon:hover {
    border-color: #FF5C1A;
    color: #FF5C1A;
    background: #fff5f0;
  }
`;

export default function SecondNavbar({ data = [] }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(data.length > 0 ? data[0].label : "Offers");

  const linksToRender = data.length > 0 ? data : [
    { label: "Offers", icon: "🏷️", href: "/offers", description: "Exclusive deals and discounts" },
    { label: "Frequently Search", icon: "🔍", href: "/frequent-search", description: "See what's trending" },
    { label: "Top Selling", icon: "⭐", href: "/top-selling", description: "Customer favorites" },
    { label: "Contact Us", icon: "📞", href: "/contact-us", description: "Get in touch" },
    { label: "Help Center", icon: "❓", href: "/help-center", description: "Support & FAQs" }
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="sn-wrapper">
        <div className="sn-brand">
           <div className="sn-brand-icon">QA</div>
           <span>QuickArt</span>
        </div>
        <div className="sn-links">
          {linksToRender.map((link) => (
            <button
              key={link.label}
              className={`sn-link ${activeLink === link.label || location.pathname === link.href ? "active" : ""}`}
              onClick={() => {
                setActiveLink(link.label);
                if (link.href && link.href.startsWith("/")) navigate(link.href);
              }}
              title={link.description}
            >
              {link.icon && <span>{link.icon}</span>}
              <span>{link.label}</span>
            </button>
          ))}
        </div>
        <div className="sn-user">
           <button className="sn-btn-icon" title="Notifications">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
           </button>
           <button className="sn-btn-icon" title="Settings">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
           </button>
        </div>
      </div>
    </>
  );
}