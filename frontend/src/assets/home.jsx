import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import FeaturedProducts from "./FeaturedProducts";
import Footer from "./Footer.jsx";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("ai-mode");
  const [imageSearchActive, setImageSearchActive] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    console.log("Search for:", searchQuery);
  };

  const handleImageSearch = () => {
    setImageSearchActive(!imageSearchActive);
  };

  return (
    <div className="home-container">
      {/* TOP TABS */}
      <div className="top-tabs">
        <div
          className={`tab ${activeTab === "ai-mode" ? "active" : ""}`}
          onClick={() => navigate('/quick-art-ai')}
        >
          🤖 AI Assistant
        </div>
        <div className="tab-divider">|</div>
        <div
          className={`tab ${activeTab === "products" ? "active" : ""}`}
          onClick={() => navigate('/quickart3d')}
        >
          3D Viewer
        </div>
        <div
          className={`tab ${activeTab === "manufacturers" ? "active" : ""}`}
          onClick={() => navigate('/virtual-fitting-room')}
        >
          Virtual Fitone Room
        </div>
        
      </div>

      {/* SEARCH BOX SECTION */}
      <div className="search-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search products, categories, or brands..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="image-search-btn">
            📷 Image Search
          </button>
          <button className="search-btn" onClick={handleSearch}>
            🔍 Search
          </button>
        </div>
      </div>

      <FeaturedProducts />

      {/* IMAGE TYPE SECTION */}
      <div className="image-type-section">
        <div className="section-title">📸 Browse by Image Type</div>
        <div className="image-types">
          <div className="image-type-card">
            <div className="image-type-icon">📷</div>
            <p>Product Photos</p>
          </div>
          <div className="image-type-card">
            <div className="image-type-icon">👥</div>
            <p>Model Shots</p>
          </div>
          <div className="image-type-card">
            <div className="image-type-icon">🎥</div>
            <p>Videos</p>
          </div>
          <div className="image-type-card">
            <div className="image-type-icon">📐</div>
            <p>Size Charts</p>
          </div>
          <div className="image-type-card">
            <div className="image-type-icon">✨</div>
            <p>Lifestyle</p>
          </div>
          <div 
            className="image-type-card" 
            onClick={() => navigate('/admin')}
            style={{
              background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)",
              boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)",
              border: "1px solid rgba(255,255,255,0.2)"
            }}
          >
            <div className="image-type-icon" style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}>⚙️</div>
            <p style={{ color: "#fff", fontWeight: "bold" }}>Admin Panel</p>
            <div style={{ marginTop: "8px", fontSize: "11px", color: "rgba(255,255,255,0.9)", background: "rgba(0,0,0,0.2)", padding: "4px 8px", borderRadius: "6px", textAlign: "left" }}>
              <div>User: admin</div>
              <div>Pass: password</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
