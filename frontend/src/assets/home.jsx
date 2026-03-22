import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import FeaturedProducts from "./FeaturedProducts";
import Footer from "./Footer.jsx";
import ProductRecommendations from "../ProductRecommendations";
import { useCart } from "../pages/CartContext";

const PRODUCTS = [
  { id: 1,  name: "Men's Casual Shirt",        category: "fashion",         price: 4500,   orig: 5500,   rating: 4.6, reviews: 150,  badge: "New",         emoji: "👕", imgs: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=300&q=80"], specs: ["Cotton","Slim Fit"],          sub: "Men's Casual Shirts" },
  { id: 2,  name: "Latest Smartphone Pro",     category: "electronics",     price: 215000, orig: 240000, rating: 4.9, reviews: 540,  badge: "Hot",         emoji: "📱", imgs: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80"], specs: ["256GB","OLED Display"],      sub: "Mobile Phones" },
  { id: 3,  name: "Modern Velvet Sofa",        category: "home-living",     price: 125000, orig: 150000, rating: 4.7, reviews: 95,   badge: "Top Rated",   emoji: "🛋️", imgs: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80"], specs: ["3-Seater","Green Velvet"],   sub: "Sofas" },
  { id: 4,  name: "Organic Face Cream",        category: "beauty-personal", price: 3500,   orig: 4000,   rating: 4.9, reviews: 320,  badge: "Organic",     emoji: "🧴", imgs: ["https://images.unsplash.com/photo-1556228552-6c3638d6e388?auto=format&fit=crop&w=300&q=80"], specs: ["50ml","Anti-aging"],         sub: "Face Wash & Creams" },
  { id: 5,  name: "Professional Dumbbell Set", category: "sports-fitness",  price: 25000,  orig: 30000,  rating: 4.7, reviews: 112,  badge: "Pro Choice",  emoji: "🏋️", imgs: ["https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=300&q=80"], specs: ["20kg Set","Adjustable"],     sub: "Gym Equipment" },
  { id: 6,  name: "Next-Gen Gaming Console",   category: "gaming",          price: 150000, orig: 165000, rating: 4.9, reviews: 850,  badge: "Best Seller", emoji: "🎮", imgs: ["https://images.unsplash.com/photo-1486401899868-0e435ed85128?auto=format&fit=crop&w=300&q=80"], specs: ["8K Output","1TB SSD"],       sub: "Consoles" },
  { id: 7,  name: "The Great Gatsby Novel",    category: "books-education", price: 1200,   orig: 1500,   rating: 4.8, reviews: 1205, badge: "Classic",     emoji: "📚", imgs: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=300&q=80"], specs: ["Hardcover","F. Scott F."],   sub: "Novels" },
  { id: 8,  name: "Leather Car Seat Covers",   category: "automotive",      price: 18000,  orig: 22000,  rating: 4.5, reviews: 88,   badge: "Premium",     emoji: "🚗", imgs: ["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=300&q=80"], specs: ["Universal Fit","PU Leather"],sub: "Car Accessories" },
  { id: 9,  name: "Fresh Organic Vegetables",  category: "groceries",       price: 1500,   orig: 1800,   rating: 4.9, reviews: 450,  badge: "Fresh",       emoji: "🥗", imgs: ["https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=300&q=80"], specs: ["1kg Box","Farm Fresh"],      sub: "Fruits & Vegetables" },
  { id: 10, name: "Premium Dog Food",          category: "pets",            price: 8500,   orig: 9000,   rating: 4.8, reviews: 215,  badge: "Vet Approved",emoji: "🐶", imgs: ["https://images.unsplash.com/photo-1589924691195-41432c84c161?auto=format&fit=crop&w=300&q=80"], specs: ["10kg Bag","For Adult Dogs"], sub: "Pet Food" },
  { id: 11, name: "Leather Travel Duffle Bag", category: "travel-lifestyle",price: 22000,  orig: 25000,  rating: 4.7, reviews: 130,  badge: "Handmade",    emoji: "🧳", imgs: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=300&q=80"], specs: ["Genuine Leather","Cabin Size"],sub: "Bags & Luggage" },
  { id: 12, name: "Vitamin C Supplements",     category: "health-medical",  price: 2500,   orig: 3000,   rating: 4.9, reviews: 650,  badge: "Essential",   emoji: "💊", imgs: ["https://images.unsplash.com/photo-1511688878353-3a2f5be94c54?auto=format&fit=crop&w=300&q=80"], specs: ["1000mg","90 Tablets"],       sub: "Supplements" },
];

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab]                   = useState("ai-mode");
  const [viewHistory, setViewHistory] = useState([]);

  const navigate            = useNavigate();
  const { cart, addToCart } = useCart();

  const handleSearch = () => {
    console.log("Search for:", searchQuery);
  };

  const handleProductClick = (product) => {
    setViewHistory(prev => [...new Set([...prev, product.id])]);
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

      {/* SEARCH BOX */}
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

      <FeaturedProducts onProductClick={handleProductClick} />

      {/* AI Recommendations */}
      <div style={{ padding: '0 2rem' }}>
        <ProductRecommendations
          products={PRODUCTS}
          viewHistory={viewHistory}
          cartItems={cart}
          onAddToCart={addToCart}
        />
      </div>

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
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Home;