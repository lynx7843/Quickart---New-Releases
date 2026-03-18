import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactUsPage = () => {
  return (
    <div style={{ padding: "60px 20px", background: "#f0f2f5", minHeight: "100vh", fontFamily: "'Sora', sans-serif" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", background: "white", borderRadius: "24px", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.08)", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <div style={{ padding: "60px", background: "#1a1a1a", color: "white" }}>
          <h2 style={{ fontSize: "32px", fontWeight: 800, marginBottom: "20px" }}>Let's Chat</h2>
          <p style={{ color: "#aaa", marginBottom: "40px", lineHeight: "1.6" }}>Have a question about our products or services? We're here to help you 24/7.</p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ background: "#333", padding: "12px", borderRadius: "12px" }}><Mail color="#FF6B00" /></div>
              <div>
                <div style={{ fontSize: "12px", color: "#888" }}>Email us at</div>
                <div style={{ fontWeight: 600 }}>support@quickart.com</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ background: "#333", padding: "12px", borderRadius: "12px" }}><Phone color="#FF6B00" /></div>
              <div>
                <div style={{ fontSize: "12px", color: "#888" }}>Call us at</div>
                <div style={{ fontWeight: 600 }}>+94 11 234 5678</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ background: "#333", padding: "12px", borderRadius: "12px" }}><MapPin color="#FF6B00" /></div>
              <div>
                <div style={{ fontSize: "12px", color: "#888" }}>Visit us</div>
                <div style={{ fontWeight: 600 }}>Colombo 07, Sri Lanka</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: "60px" }}>
          <h3 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "30px", color: "#333" }}>Send a Message</h3>
          <form style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <input type="text" placeholder="Your Name" style={{ padding: "16px", borderRadius: "12px", border: "1px solid #eee", background: "#f9f9f9", outline: "none", fontSize: "14px" }} />
            <input type="email" placeholder="Your Email" style={{ padding: "16px", borderRadius: "12px", border: "1px solid #eee", background: "#f9f9f9", outline: "none", fontSize: "14px" }} />
            <textarea rows="4" placeholder="How can we help?" style={{ padding: "16px", borderRadius: "12px", border: "1px solid #eee", background: "#f9f9f9", outline: "none", fontSize: "14px", resize: "none" }}></textarea>
            <button type="button" style={{ background: "#FF6B00", color: "white", padding: "16px", borderRadius: "12px", border: "none", fontWeight: 700, fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginTop: "10px" }}>
              Send Message <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;