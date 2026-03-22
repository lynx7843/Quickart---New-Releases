import { useState } from "react";
import "./FeaturedProducts.css";
import { Volume2 } from "lucide-react";
import { readAloud } from "../VoiceAssistant";
import { useCart } from "../pages/CartContext";

const products = [
  { id: 1, name: "Wireless Earbuds",   price: "LKR 24,500",  numericPrice: 24500,  rating: "⭐⭐⭐⭐⭐", image: "🎧", category: "Electronics",  description: "Premium wireless earbuds with noise cancellation, 30 hour battery life and crystal clear sound." },
  { id: 2, name: "Smart Watch",        price: "LKR 61,000",  numericPrice: 61000,  rating: "⭐⭐⭐⭐",   image: "⌚", category: "Wearables",    description: "Feature packed smart watch with health tracking, GPS and a stunning AMOLED display." },
  { id: 3, name: "Camera Lens",        price: "LKR 137,500", numericPrice: 137500, rating: "⭐⭐⭐⭐⭐", image: "📷", category: "Photography",  description: "Professional grade camera lens with 85mm focal length, ideal for portrait photography." },
  { id: 4, name: "Portable Speaker",   price: "LKR 39,500",  numericPrice: 39500,  rating: "⭐⭐⭐⭐",   image: "🔊", category: "Audio",        description: "Waterproof portable speaker with 360 degree sound and 20 hour playtime." },
  { id: 5, name: "Gaming Mouse",       price: "LKR 18,500",  numericPrice: 18500,  rating: "⭐⭐⭐⭐",   image: "🖱️", category: "Gaming",       description: "High precision gaming mouse with 16000 DPI sensor, RGB lighting and 7 programmable buttons." },
];

function FeaturedProducts({ onProductClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addedId, setAddedId]           = useState(null);
  const { addToCart }                   = useCart();

  const itemsPerView = 3;

  const handlePrev = () =>
    setCurrentIndex(prev => prev === 0 ? products.length - itemsPerView : prev - 1);

  const handleNext = () =>
    setCurrentIndex(prev => prev === products.length - itemsPerView ? 0 : prev + 1);

  const visibleProducts = products.slice(currentIndex, currentIndex + itemsPerView);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart({ ...product, price: product.numericPrice });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  const handleReadAloud = (e, product) => {
    e.stopPropagation();
    readAloud(
      `${product.name}. ${product.category}. ${product.price}. ${product.description}`
    );
  };

  return (
    <div className="featured-products-section">
      <div className="section-header">
        <h2 className="section-title">⭐ Featured Products</h2>
        <a href="#" className="view-all-link">View All →</a>
      </div>

      <div className="carousel-container">
        <button className="carousel-btn prev-btn" onClick={handlePrev}>❮</button>

        <div className="carousel-wrapper">
          <div className="products-carousel">
            {visibleProducts.map((product) => (
              <div
                key={product.id}
                className="product-card"
                onClick={() => onProductClick && onProductClick(product)}
                style={{ cursor: "pointer" }}
              >
                <div className="product-image">{product.image}</div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-category">{product.category}</p>
                  <div className="product-rating">{product.rating}</div>

                  {/* Read Aloud button */}
                  <button
                    onClick={(e) => handleReadAloud(e, product)}
                    style={{
                      display: "flex", alignItems: "center", gap: 5,
                      background: "none", border: "1px solid #e2e8f0",
                      borderRadius: 8, padding: "4px 10px",
                      fontSize: 12, color: "#64748b",
                      cursor: "pointer", marginBottom: 8,
                      fontFamily: "inherit",
                    }}
                  >
                    <Volume2 size={13} /> Read aloud
                  </button>

                  <div className="product-footer">
                    <span className="product-price">{product.price}</span>
                    <button
                      className="add-to-cart-btn"
                      onClick={(e) => handleAddToCart(e, product)}
                      style={{
                        background: addedId === product.id ? "#22c55e" : undefined,
                        transition: "background 0.2s",
                      }}
                    >
                      {addedId === product.id ? "✓ Added" : "🛒 Add"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="carousel-btn next-btn" onClick={handleNext}>❯</button>
      </div>
    </div>
  );
}

export default FeaturedProducts;