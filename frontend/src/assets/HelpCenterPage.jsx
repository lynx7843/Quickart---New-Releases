import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

const HelpCenterPage = () => {
  const [openIndex, setOpenIndex] = useState(0);
  
  const faqs = [
    { q: "How do I track my order?", a: "You can track your order in the 'Orders' section of your account or by using the tracking link sent to your email." },
    { q: "What is your return policy?", a: "We offer a 30-day return policy for all unused items in their original packaging. Please visit our Returns page to start a return." },
    { q: "Do you ship internationally?", a: "Yes, we ship to over 50 countries worldwide. Shipping costs and times vary by location." },
    { q: "Can I change my shipping address?", a: "You can change your address within 1 hour of placing the order by contacting support. After that, we cannot guarantee changes." },
  ];

  return (
    <div style={{ padding: "60px 20px", background: "#fff", minHeight: "100vh", fontFamily: "'Sora', sans-serif" }}>
      <div style={{ textAlign: "center", marginBottom: "60px" }}>
        <h1 style={{ fontSize: "40px", fontWeight: 800, marginBottom: "16px" }}>How can we help?</h1>
        <div style={{ position: "relative", maxWidth: "500px", margin: "0 auto" }}>
          <Search style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", color: "#aaa" }} />
          <input type="text" placeholder="Search for answers..." style={{ width: "100%", padding: "18px 20px 18px 50px", borderRadius: "30px", border: "1px solid #ddd", fontSize: "16px", outline: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }} />
        </div>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {faqs.map((faq, i) => (
          <div key={i} style={{ marginBottom: "16px", border: "1px solid #eee", borderRadius: "12px", overflow: "hidden" }}>
            <button 
              onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
              style={{ width: "100%", textAlign: "left", padding: "20px 24px", background: "white", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "16px", fontWeight: 600, color: "#333" }}
            >
              {faq.q}
              {openIndex === i ? <ChevronUp size={20} color="#FF6B00" /> : <ChevronDown size={20} color="#aaa" />}
            </button>
            {openIndex === i && (
              <div style={{ padding: "0 24px 24px 24px", color: "#666", lineHeight: "1.6", background: "white" }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpCenterPage;