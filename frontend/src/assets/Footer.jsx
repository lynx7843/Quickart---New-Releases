import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from "lucide-react";

export const PAYMENT_METHODS = [
  "Credit Card",
  "Debit Card",
  "PayPal",
  "Apple Pay",
  "Google Pay",
  "Bank Transfer",
  "Cash on Delivery",
  "Crypto",
];

const Footer = () => {
  const navigate = useNavigate();
  
  const handleLinkClick = (link) => {
    const pathMap = {
      "All Products": "/all-categories",
      "New Arrivals": "/new-arrivals",
      "Top Selling": "/top-selling",
      "Flash Deals": "/flash-deals",
      "Brand Store": "/brand-store",
      "Help Center": "/help-center",
      "Contact Us": "/contact-us",
      "Returns": "/page/returns",
      "Shipping": "/page/shipping",
      "Payment": "/page/payment",
      "About Us": "/about-us",
      "Careers": "/page/careers",
      "AI Assistant": "/quick-art-ai",
      "AR Try-On": "/virtual-fitting-room",
      "Virtual Fitone": "/virtual-fitting-room",
      "Image Search": "/page/image-search",
      "3D Viewer": "/quickart3d",
      "Privacy": "/page/privacy",
      "Terms": "/page/terms",
      "Cookies": "/page/cookies",
      "Press": "/page/press",
      "Blog": "/page/blog",
      "Affiliates": "/page/affiliates"
    };
    if (pathMap[link]) navigate(pathMap[link]);
  };

  return (
    <footer style={{ background:"#111", color:"rgba(255,255,255,0.6)", padding:"50px 40px 24px" }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr", gap:36, marginBottom:44, flexWrap:"wrap" }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
              <div style={{ background:"linear-gradient(135deg,#1a1a1a 60%,#2d1a00)", borderRadius:10, padding:"6px 12px", display:"flex", alignItems:"center", gap:4 }}>
                <span style={{ fontSize:14 }}>⚡</span>
                <span style={{ color:"#fff", fontWeight:900, fontSize:14, letterSpacing:1 }}>QUICK</span>
                <span style={{ fontSize:14 }}>🛒</span>
                <span style={{ color:"#FF8C42", fontWeight:900, fontSize:14, letterSpacing:1 }}>ART</span>
              </div>
            </div>
            <p style={{ fontSize:12, lineHeight:1.9, color:"rgba(255,255,255,0.4)", marginBottom:18 }}>Your one-stop e-commerce platform with AR try-on, 3D viewer, and AI-powered shopping. Smart. Fast. Reliable.</p>
            <div style={{ display:"flex", gap:8 }}>
              {[<Facebook size={15}/>,<Twitter size={15}/>,<Instagram size={15}/>,<Youtube size={15}/>,<Linkedin size={15}/>].map((icon,i)=>(
                <button key={i} style={{ background:"rgba(255,255,255,0.06)", border:"none", borderRadius:10, width:34, height:34, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"rgba(255,255,255,0.5)", transition:"all 0.2s" }}
                  onMouseEnter={e=>{e.currentTarget.style.background="#FF6B00";e.currentTarget.style.color="#fff";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.06)";e.currentTarget.style.color="rgba(255,255,255,0.5)";}}>
                  {icon}
                </button>
              ))}
            </div>
          </div>
          {[
            { h:"Shop", l:["All Products","New Arrivals","Top Selling","Flash Deals","Brand Store"] },
            { h:"Services", l:["AR Try-On","3D Viewer","Virtual Fitone","AI Assistant","Image Search"] },
            { h:"Support", l:["Help Center","Contact Us","Returns","Shipping","Payment"] },
            { h:"Company", l:["About Us","Careers","Press","Blog","Affiliates"] },
          ].map(({h,l})=>(
            <div key={h}>
              <div style={{ color:"#fff", fontWeight:700, fontSize:13, marginBottom:14 }}>{h}</div>
              {l.map(link=>(
                <div key={link} onClick={() => handleLinkClick(link)} style={{ fontSize:12, color:"rgba(255,255,255,0.38)", marginBottom:9, cursor:"pointer", transition:"color 0.2s" }}
                  onMouseEnter={e=>e.currentTarget.style.color="#FF6B00"}
                  onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.38)"}>
                  {link}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", paddingTop:22, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.28)" }}>© 2026 QuickArt. All rights reserved. Smart · Fast · Reliable</div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {PAYMENT_METHODS.slice(0,5).map(m=>(
              <span key={m} style={{ background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.4)", padding:"3px 9px", borderRadius:6, fontSize:10, fontWeight:700 }}>{m}</span>
            ))}
          </div>
          <div style={{ display:"flex", gap:14 }}>
            {["Privacy","Terms","Cookies"].map(l=>(
              <span key={l} onClick={() => handleLinkClick(l)} style={{ fontSize:11, color:"rgba(255,255,255,0.28)", cursor:"pointer" }}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;