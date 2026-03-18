import "./Secondnavbar.css";
import { useNavigate } from "react-router-dom";

function SecondNavbar({ onToggleCategories }) {
  const navigate = useNavigate();

  return (
    <nav className="second-navbar">
      <div className="navbar-container">
        <div className="navbar-item" onClick={() => navigate('/all-categories')}>
          <span className="item-icon">≡</span>
          <span className="item-text">All Category</span>
        </div>

        <div className="navbar-item" onClick={() => navigate('/offers')}>
          <span className="item-icon">🏷️</span>
          <span className="item-text">Offers</span>
        </div>

        <div className="navbar-item" onClick={() => navigate('/frequent-search')}>
          <span className="item-icon">🔍</span>
          <span className="item-text">Frequently Search</span>
        </div>

        <div className="navbar-item" onClick={() => navigate('/top-selling')}>
          <span className="item-icon">⭐</span>
          <span className="item-text">Top Selling</span>
        </div>

        <div className="navbar-item" onClick={() => navigate('/contact-us')}>
          <span className="item-icon">📞</span>
          <span className="item-text">Contact Us</span>
        </div>

        <div className="navbar-item" onClick={() => navigate('/help-center')}>
          <span className="item-icon">❓</span>
          <span className="item-text">Help Center</span>
        </div>

        <div className="navbar-item" onClick={() => navigate('/about-us')}>
          <span className="item-icon">ℹ️</span>
          <span className="item-text">About Us</span>
        </div>

        
      </div>
    </nav>
  );
}

export default SecondNavbar;