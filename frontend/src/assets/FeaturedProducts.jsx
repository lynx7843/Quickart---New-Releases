import { useState } from "react";
import "./FeaturedProducts.css";

function FeaturedProducts() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sample products data
  const products = [
    {
      id: 1,
      name: "Wireless Earbuds",
      price: "LKR 24,500",
      rating: "⭐⭐⭐⭐⭐",
      image: "🎧",
      category: "Electronics"
    },
    {
      id: 2,
      name: "Smart Watch",
      price: "LKR 61,000",
      rating: "⭐⭐⭐⭐",
      image: "⌚",
      category: "Wearables"
    },
    {
      id: 3,
      name: "Camera Lens",
      price: "LKR 137,500",
      rating: "⭐⭐⭐⭐⭐",
      image: "📷",
      category: "Photography"
    },
    {
      id: 4,
      name: "Portable Speaker",
      price: "LKR 39,500",
      rating: "⭐⭐⭐⭐",
      image: "🔊",
      category: "Audio"
    },
    {
      id: 5,
      name: "Gaming Mouse",
      price: "LKR 18,500",
      rating: "⭐⭐⭐⭐",
      image: "🖱️",
      category: "Gaming"
    }
  ];

  const itemsPerView = 3;

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? products.length - itemsPerView : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === products.length - itemsPerView ? 0 : prev + 1
    );
  };

  const visibleProducts = products.slice(
    currentIndex,
    currentIndex + itemsPerView
  );

  return (
    <div className="featured-products-section">
      <div className="section-header">
        <h2 className="section-title">⭐ Featured Products</h2>
        <a href="#" className="view-all-link">
          View All →
        </a>
      </div>

      <div className="carousel-container">
        <button className="carousel-btn prev-btn" onClick={handlePrev}>
          ❮
        </button>

        <div className="carousel-wrapper">
          <div className="products-carousel">
            {visibleProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">{product.image}</div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-category">{product.category}</p>
                  <div className="product-rating">{product.rating}</div>
                  <div className="product-footer">
                    <span className="product-price">{product.price}</span>
                    <button className="add-to-cart-btn">🛒 Add</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="carousel-btn next-btn" onClick={handleNext}>
          ❯
        </button>
      </div>
    </div>
  );
}

export default FeaturedProducts;
