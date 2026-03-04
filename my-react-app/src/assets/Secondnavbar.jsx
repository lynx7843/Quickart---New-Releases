import "./Secondnavbar.css";
import { useNavigate } from "react-router-dom";

function SecondNavbar({ onToggleCategories }) {
  const navigate = useNavigate();

  return (
    <nav className="second-navbar">
      <div className="navbar-container">
        <div className="navbar-item" onClick={onToggleCategories || (() => {})}>
          <span className="item-icon">≡</span>
          <span className="item-text">All Category</span>
        </div>

        <div className="navbar-item">
          <span className="item-icon">🏷️</span>
          <span className="item-text">Offers</span>
        </div>

        <div className="navbar-item">
          <span className="item-icon">🔍</span>
          <span className="item-text">Frequently Search</span>
        </div>

        <div className="navbar-item">
          <span className="item-icon">⭐</span>
          <span className="item-text">Top Selling</span>
        </div>

        <div className="navbar-item">
          <span className="item-icon">📞</span>
          <span className="item-text">Contact Us</span>
        </div>

        <div className="navbar-item">
          <span className="item-icon">❓</span>
          <span className="item-text">Help Center</span>
        </div>

        <div className="navbar-item">
          <span className="item-icon">ℹ️</span>
          <span className="item-text">About Us</span>
        </div>

        <div className="navbar-item" onClick={() => navigate('/auth-builder-ui')} style={{ marginLeft: "auto" }}>
          <span className="item-icon">🛠️</span>
          <span className="item-text">Create your own website</span>
        </div>
      </div>
    </nav>
  );
}

export default SecondNavbar;