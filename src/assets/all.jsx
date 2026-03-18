import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, Heart, Plus, Star } from "lucide-react";
import Footer from "./Footer.jsx";
import { useCart } from "../pages/CartContext.jsx";

function StarRating({ rating }) {
  return (
    <div style={{ display:"flex", gap:2 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={12} fill={i<=Math.floor(rating)?"#FF6B00":"none"} color={i<=rating?"#FF6B00":"#ddd"} />
      ))}
    </div>
  );
}

function ProductCard({ product: p, onAdd, onWish, wished }) {
  return (
    <div style={{ background:"#fff", borderRadius:16, padding:14, boxShadow:"0 4px 24px rgba(0,0,0,0.04)", transition:"all 0.2s", display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 12px 30px rgba(0,0,0,0.08)";}}
      onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 4px 24px rgba(0,0,0,0.04)";}}>
      <div>
        <div style={{ position: 'relative', marginBottom:12, borderRadius:12, overflow:"hidden", aspectRatio: "1/1", background: "#F4F6FA" }}>
          {p.imgs && p.imgs.length > 0 ? (
            <img src={p.imgs[0]} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>{p.emoji}</div>
          )}
          <span style={{ position: 'absolute', top: 8, left: 8, background: p.color || '#1a1a1a', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{p.badge || 'New'}</span>
        </div>
        <div style={{ fontSize:13, fontWeight:700, color:"#1a1a1a", marginBottom:4, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }} title={p.name}>{p.name}</div>
        <div style={{ fontSize:11, color:"#666", marginBottom:8, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", height: 32, lineHeight: 1.4 }}>
          {p.specs ? p.specs.join(" · ") : "High quality product"}
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
          <StarRating rating={p.rating} />
          <span style={{ fontSize:10, color:"#888" }}>({p.reviews} reviews)</span>
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop: 8 }}>
        <div style={{ fontSize:16, fontWeight:800, color:"#FF6B00" }}>LKR {p.price.toLocaleString()}</div>
        <div style={{ display:"flex", gap:6 }}>
          <button onClick={(e)=>{e.stopPropagation(); onWish(p.id)}} style={{ width:28, height:28, borderRadius:"50%", border:"1px solid #eee", background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Heart size={14} color={wished?"#ef4444":"#888"} fill={wished?"#ef4444":"none"}/>
          </button>
          <button onClick={(e)=>{e.stopPropagation(); onAdd(p)}} style={{ width:28, height:28, borderRadius:"50%", border:"none", background:"#1a1a1a", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Plus size={14}/>
          </button>
        </div>
      </div>
    </div>
  );
}

const categoriesData = [
  {
    id: "fashion",
    name: "Fashion",
    icon: "👕",
    subCategories: [
      { name: "Men's Casual Shirts", image: "" },
      { name: "Men's Formal Shirts", image: "" },
      { name: "Men's T-Shirts", image: "" },
      { name: "Men's Jeans", image: "" },
      { name: "Men's Chinos", image: "" },
      { name: "Men's Shorts", image: "" },
      { name: "Jackets & Coats", image: "" },
      { name: "Men's Innerwear", image: "" },
      { name: "Men's Ethnic Wear", image: "" },
      { name: "Men's Shoes", image: "" },
      { name: "Women's Dresses", image: "" },
      { name: "Tops & Blouses", image: "" },
      { name: "Skirts", image: "" },
      { name: "Women's Jeans & Pants", image: "" },
      { name: "Sarees & Ethnic Wear", image: "" },
      { name: "Handbags", image: "" },
      { name: "Women's Footwear", image: "" },
      { name: "Jewelry", image: "" },
      { name: "Boys Clothing", image: "" },
      { name: "Girls Clothing", image: "" },
      { name: "Baby Wear", image: "" },
      { name: "School Wear", image: "" },
      { name: "Toys", image: "" },
      { name: "Men's Casual Shirts", image: "/images/fashion/men-casual-shirt.jpg" },
      { name: "Men's Formal Shirts", image: "/images/fashion/men-formal-shirt.jpg" },
      { name: "Men's T-Shirts", image: "/images/fashion/men-t-shirt.jpg" },
      { name: "Men's Jeans", image: "/images/fashion/men-jeans.jpg" },
      { name: "Men's Chinos", image: "/images/fashion/men-chinos.jpg" },
      { name: "Men's Shorts", image: "/images/fashion/men-shorts.jpg" },
      { name: "Jackets & Coats", image: "/images/fashion/jackets.jpg" },
      { name: "Men's Innerwear", image: "/images/fashion/men-innerwear.jpg" },
      { name: "Men's Ethnic Wear", image: "/images/fashion/men-ethnic.jpg" },
      { name: "Men's Shoes", image: "/images/fashion/men-shoes.jpg" },
      { name: "Women's Dresses", image: "/images/fashion/women-dresses.jpg" },
      { name: "Tops & Blouses", image: "/images/fashion/women-tops.jpg" },
      { name: "Skirts", image: "/images/fashion/women-skirts.jpg" },
      { name: "Women's Jeans & Pants", image: "/images/fashion/women-jeans.jpg" },
      { name: "Sarees & Ethnic Wear", image: "/images/fashion/women-saree.jpg" },
      { name: "Handbags", image: "/images/fashion/handbags.jpg" },
      { name: "Women's Footwear", image: "/images/fashion/women-footwear.jpg" },
      { name: "Jewelry", image: "/images/fashion/jewelry.jpg" },
      { name: "Boys Clothing", image: "/images/fashion/kids-boys.jpg" },
      { name: "Girls Clothing", image: "/images/fashion/kids-girls.jpg" },
      { name: "Baby Wear", image: "/images/fashion/kids-baby.jpg" },
      { name: "School Wear", image: "/images/fashion/kids-school.jpg" },
      { name: "Toys", image: "/images/fashion/toys.jpg" },
    ]
  },
  {
    id: "electronics",
    name: "Electronics",
    icon: "📱",
    subCategories: [
      { name: "Mobile Phones", image: "" },
      { name: "Laptops", image: "" },
      { name: "Tablets", image: "" },
      { name: "Smart Watches", image: "" },
      { name: "Headphones & Earbuds", image: "" },
      { name: "Cameras", image: "" },
      { name: "Gaming Consoles", image: "" },
      { name: "Chargers & Cables", image: "" },
      { name: "Power Banks", image: "" },
      { name: "Mobile Phones", image: "/images/electronics/phones.jpg" },
      { name: "Laptops", image: "/images/electronics/laptops.jpg" },
      { name: "Tablets", image: "/images/electronics/tablets.jpg" },
      { name: "Smart Watches", image: "/images/electronics/watches.jpg" },
      { name: "Headphones & Earbuds", image: "/images/electronics/headphones.jpg" },
      { name: "Cameras", image: "/images/electronics/cameras.jpg" },
      { name: "Gaming Consoles", image: "/images/electronics/consoles.jpg" },
      { name: "Chargers & Cables", image: "/images/electronics/chargers.jpg" },
      { name: "Power Banks", image: "/images/electronics/powerbanks.jpg" },
    ]
  },
  {
    id: "home-living",
    name: "Home & Living",
    icon: "🏠",
    subCategories: [
      { name: "Sofas", image: "" },
      { name: "Beds", image: "" },
      { name: "Tables", image: "" },
      { name: "Microwaves", image: "" },
      { name: "Blenders", image: "" },
      { name: "Wall Art", image: "" },
      { name: "Lighting", image: "" },
      { name: "Bedsheets", image: "" },
      { name: "Pillows", image: "" },
      { name: "Storage & Organization", image: "" },
      { name: "Sofas", image: "/images/home/sofas.jpg" },
      { name: "Beds", image: "/images/home/beds.jpg" },
      { name: "Tables", image: "/images/home/tables.jpg" },
      { name: "Microwaves", image: "/images/home/microwaves.jpg" },
      { name: "Blenders", image: "/images/home/blenders.jpg" },
      { name: "Wall Art", image: "/images/home/wall-art.jpg" },
      { name: "Lighting", image: "/images/home/lighting.jpg" },
      { name: "Bedsheets", image: "/images/home/bedsheets.jpg" },
      { name: "Pillows", image: "/images/home/pillows.jpg" },
      { name: "Storage & Organization", image: "/images/home/storage.jpg" },
    ]
  },
  {
    id: "beauty-personal",
    name: "Beauty & Personal Care",
    icon: "🧴",
    subCategories: [
      { name: "Face Wash & Creams", image: "" },
      { name: "Shampoo & Hair Oil", image: "" },
      { name: "Lipstick & Foundation", image: "" },
      { name: "Perfume & Deodorant", image: "" },
      { name: "Trimmers & Razors", image: "" },
      { name: "Face Wash & Creams", image: "/images/beauty/skincare.jpg" },
      { name: "Shampoo & Hair Oil", image: "/images/beauty/haircare.jpg" },
      { name: "Lipstick & Foundation", image: "/images/beauty/makeup.jpg" },
      { name: "Perfume & Deodorant", image: "/images/beauty/fragrances.jpg" },
      { name: "Trimmers & Razors", image: "/images/beauty/grooming.jpg" },
    ]
  },
  {
    id: "groceries",
    name: "Groceries",
    icon: "🥗",
    subCategories: [
      { name: "Fruits & Vegetables", image: "" },
      { name: "Dairy Products", image: "" },
      { name: "Snacks & Beverages", image: "" },
      { name: "Rice & Grains", image: "" },
      { name: "Spices", image: "" },
      { name: "Frozen Foods", image: "" },
      { name: "Fruits & Vegetables", image: "/images/groceries/fresh.jpg" },
      { name: "Dairy Products", image: "/images/groceries/dairy.jpg" },
      { name: "Snacks & Beverages", image: "/images/groceries/snacks.jpg" },
      { name: "Rice & Grains", image: "/images/groceries/grains.jpg" },
      { name: "Spices", image: "/images/groceries/spices.jpg" },
      { name: "Frozen Foods", image: "/images/groceries/frozen.jpg" },
    ]
  },
  {
    id: "sports-fitness",
    name: "Sports & Fitness",
    icon: "⚽",
    subCategories: [
      { name: "Gym Equipment", image: "" },
      { name: "Sports Wear", image: "" },
      { name: "Outdoor Games", image: "" },
      { name: "Indoor Games", image: "" },
      { name: "Yoga Mats & Dumbbells", image: "" },
      { name: "Gym Equipment", image: "/images/sports/gym.jpg" },
      { name: "Sports Wear", image: "/images/sports/wear.jpg" },
      { name: "Outdoor Games", image: "/images/sports/outdoor.jpg" },
      { name: "Indoor Games", image: "/images/sports/indoor.jpg" },
      { name: "Yoga Mats & Dumbbells", image: "/images/sports/accessories.jpg" },
    ]
  },
  {
    id: "automotive",
    name: "Automotive",
    icon: "🚗",
    subCategories: [
      { name: "Car Accessories", image: "" },
      { name: "Bike Accessories", image: "" },
      { name: "Spare Parts", image: "" },
      { name: "Engine Oil", image: "" },
      { name: "Car Electronics", image: "" },
      { name: "Car Accessories", image: "/images/auto/car-accessories.jpg" },
      { name: "Bike Accessories", image: "/images/auto/bike-accessories.jpg" },
      { name: "Spare Parts", image: "/images/auto/spare-parts.jpg" },
      { name: "Engine Oil", image: "/images/auto/oil.jpg" },
      { name: "Car Electronics", image: "/images/auto/car-electronics.jpg" },
    ]
  },
  {
    id: "books-education",
    name: "Books & Education",
    icon: "📚",
    subCategories: [
      { name: "School Books", image: "" },
      { name: "Novels", image: "" },
      { name: "Educational Books", image: "" },
      { name: "Stationery", image: "" },
      { name: "E-learning Materials", image: "" },
      { name: "School Books", image: "/images/books/school.jpg" },
      { name: "Novels", image: "/images/books/novels.jpg" },
      { name: "Educational Books", image: "/images/books/educational.jpg" },
      { name: "Stationery", image: "/images/books/stationery.jpg" },
      { name: "E-learning Materials", image: "/images/books/elearning.jpg" },
    ]
  },
  {
    id: "pets",
    name: "Pets",
    icon: "🐶",
    subCategories: [
      { name: "Pet Food", image: "" },
      { name: "Pet Toys", image: "" },
      { name: "Pet Accessories", image: "" },
      { name: "Grooming Products", image: "" },
      { name: "Pet Food", image: "/images/pets/food.jpg" },
      { name: "Pet Toys", image: "/images/pets/toys.jpg" },
      { name: "Pet Accessories", image: "/images/pets/accessories.jpg" },
      { name: "Grooming Products", image: "/images/pets/grooming.jpg" },
    ]
  },
  {
    id: "gaming",
    name: "Gaming",
    icon: "🎮",
    subCategories: [
      { name: "Video Games", image: "" },
      { name: "Consoles", image: "" },
      { name: "Gaming Accessories", image: "" },
      { name: "PC Gaming Parts", image: "" },
      { name: "Video Games", image: "/images/gaming/games.jpg" },
      { name: "Consoles", image: "/images/gaming/consoles.jpg" },
      { name: "Gaming Accessories", image: "/images/gaming/accessories.jpg" },
      { name: "PC Gaming Parts", image: "/images/gaming/pc-parts.jpg" },
    ]
  },
  {
    id: "travel-lifestyle",
    name: "Travel & Lifestyle",
    icon: "🧳",
    subCategories: [
      { name: "Bags & Luggage", image: "" },
      { name: "Travel Accessories", image: "" },
      { name: "Sunglasses", image: "" },
      { name: "Watches", image: "" },
      { name: "Bags & Luggage", image: "/images/travel/luggage.jpg" },
      { name: "Travel Accessories", image: "/images/travel/accessories.jpg" },
      { name: "Sunglasses", image: "/images/travel/sunglasses.jpg" },
      { name: "Watches", image: "/images/travel/watches.jpg" },
    ]
  },
  {
    id: "health-medical",
    name: "Health & Medical",
    icon: "🏥",
    subCategories: [
      { name: "Medicines (OTC)", image: "" },
      { name: "Supplements", image: "" },
      { name: "Medical Devices (BP Monitor)", image: "" },
      { name: "First Aid", image: "" },
      { name: "Medicines (OTC)", image: "/images/health/medicines.jpg" },
      { name: "Supplements", image: "/images/health/supplements.jpg" },
      { name: "Medical Devices (BP Monitor)", image: "/images/health/devices.jpg" },
      { name: "First Aid", image: "/images/health/first-aid.jpg" },
    ]
  },
  {
    id: "gifts",
    name: "Gifts & Special Items",
    icon: "🎁",
    subCategories: [
      { name: "Birthday Gifts", image: "" },
      { name: "Anniversary Gifts", image: "" },
      { name: "Customized Gifts", image: "" },
      { name: "Flowers", image: "" },
      { name: "Birthday Gifts", image: "/images/gifts/birthday.jpg" },
      { name: "Anniversary Gifts", image: "/images/gifts/anniversary.jpg" },
      { name: "Customized Gifts", image: "/images/gifts/custom.jpg" },
      { name: "Flowers", image: "/images/gifts/flowers.jpg" },
    ]
  },
];

const AllCategory = ({ products = [] }) => {
  const [activeCategory, setActiveCategory] = useState(categoriesData[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [wish, setWish] = useState([]);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [notif, setNotif] = useState(null);

  const notify = (msg) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 2800);
  };
  
  const addCart = p => {
    addToCart(p);
    notify(`✅ ${p.name} added to cart!`);
  };

  const toggleWish = id => setWish(prev => prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);

  const handleCategoryChange = (cat) => {
    if (cat.id === activeCategory.id) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActiveCategory(cat);
      setIsAnimating(false);
    }, 150);
  };

  const filteredSubs = activeCategory
    ? activeCategory.subCategories.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const totalSubCount = activeCategory ? activeCategory.subCategories.length : 0;

  if (!activeCategory) return null;

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#f8f9fa", minHeight: "100vh", display: "flex", flexDirection: "column", width: "100%" }}>
      {notif && (
        <div style={{
          position: "fixed", top: 80, right: 20, background: "#1a1a1a", color: "#fff",
          padding: "12px 20px", borderRadius: 12, zIndex: 9999, fontSize: 13,
          fontWeight: 600, boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
          animation: "fadeIn 0.3s ease"
        }}>
          {notif}
        </div>
      )}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Syne:wght@600;700;800&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }

        /* Sidebar Styling */
        .sidebar-container {
          width: 260px;
          flex-shrink: 0;
          background: #ffffff;
          border-right: 1px solid #f0f0f0;
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: sticky;
          top: 0;
        }

        .sidebar-header {
          padding: 24px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 20px;
          color: #1a1a1a;
          border-bottom: 1px solid #f5f5f5;
        }

        .sidebar-item {
          display: flex;
          align-items: center;
          padding: 14px 24px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #666;
          font-weight: 500;
          font-size: 14px;
          border-left: 3px solid transparent;
        }
        .sidebar-item:hover {
          background: #fafafa;
          color: #1a1a1a;
        }
        .sidebar-item.active {
          background: #fff5f0;
          color: #ff6b00;
          border-left-color: #ff6b00;
        }
        .sidebar-item .item-icon {
          margin-right: 12px;
          font-size: 18px;
        }

        /* Main Content */
        .main-content {
          flex: 1;
          background: #f8f9fa;
          overflow-y: auto;
          height: 100vh;
        }

        .content-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px;
          transition: opacity 0.2s ease;
        }
        .content-container.animating {
          opacity: 0.5;
        }

        /* Hero Section */
        .category-hero {
          background: white;
          border-radius: 24px;
          padding: 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.04);
          position: relative;
          overflow: hidden;
        }
        .category-hero::before {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 300px; height: 100%;
          background: linear-gradient(90deg, transparent, #fff5f0);
          pointer-events: none;
        }

        .hero-text h1 {
          font-family: 'Syne', sans-serif;
          font-size: 32px;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .hero-text p {
          color: #666;
          font-size: 15px;
        }

        .search-wrapper {
          background: #f5f5f5;
          border-radius: 12px;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          width: 300px;
          transition: all 0.2s;
          border: 1px solid transparent;
        }
        .search-wrapper:focus-within {
          background: #fff;
          border-color: #ff6b00;
          box-shadow: 0 4px 12px rgba(255, 107, 0, 0.1);
        }
        .search-input {
          border: none;
          background: transparent;
          outline: none;
          font-size: 14px;
          width: 100%;
          color: #1a1a1a;
        }
        .sub-card-link-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          color: inherit;
          width: 100%;
        }

        /* Grid System */
        .sub-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 20px;
        }

        .sub-card {
          background: white;
          border-radius: 16px;
          padding: 16px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid #f0f0f0;
          display: flex;
          justify-content: space-between;
          flex-direction: column;
          align-items: center;
        }
        .sub-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.08);
          border-color: transparent;
        }
        .sub-card img {
          width: 140px;
          height: 140px;
          border-radius: 12px;
          object-fit: cover;
          margin-bottom: 16px;
          background: #f8f8f8;
        }
        .sub-card .sub-name {
          font-weight: 600;
          color: #1a1a1a;
          font-size: 14px;
        }
        .sub-card:hover .sub-name {
          color: #ff6b00;
        }
        .add-to-cart-btn {
          margin-top: 12px;
          padding: 8px 16px;
          font-size: 12px;
          font-weight: 700;
          background: #fff5f0;
          color: #ff6b00;
          border: 1px solid #ffddc2;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .add-to-cart-btn:hover {
          background: #ff6b00;
          color: white;
          border-color: #ff6b00;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 60px;
          color: #999;
        }
      `}</style>

      <div style={{ display: "flex", flex: 1 }}>
        
        {/* Sidebar */}
        <div className="sidebar-container">
          <div className="sidebar-header">
            Categories
          </div>
          <div style={{ overflowY: "auto", flex: 1, padding: "10px 0" }}>
            {categoriesData.map((cat) => (
              <div 
                key={cat.id}
                className={`sidebar-item ${activeCategory.name === cat.name ? "active" : ""}`}
                onClick={() => handleCategoryChange(cat)}
              >
                <span className="item-icon">{cat.icon}</span>
                <span className="item-name">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className={`content-container ${isAnimating ? "animating" : ""}`}>
            
            {/* Hero Banner */}
            <div className="category-hero">
              <div className="hero-text">
                <h1>{activeCategory.icon} {activeCategory.name}</h1>
                <p>Browse {totalSubCount} sub-categories in this collection</p>
              </div>
              <div className="search-wrapper">
                <span>🔍</span>
                <input 
                  className="search-input"
                  placeholder="Search sub-categories..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Grid */}
            {filteredSubs.length > 0 ? (
              <div className="sub-grid">
                {filteredSubs.map((sub, index) => (
                  <div key={sub.name} className="sub-card" style={{ animationDelay: `${index * 20}ms` }}>
                    <div className="sub-card-link-wrapper">
                      <img
                        src={sub.image || `https://via.placeholder.com/200x200.png/f8f9fa/666?text=${sub.name.charAt(0)}`}
                        alt={sub.name}
                      />
                      <span className="sub-name">{sub.name}</span>
                    </div>
                    <button
                      className="add-to-cart-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        const product = { id: sub.name, name: sub.name, price: 1000, emoji: '🛍️' };
                        addToCart(product);
                        notify(`✅ ${sub.name} added to cart!`);
                      }}
                    >+ Add to Cart</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div style={{fontSize:48, marginBottom:16}}>😕</div>
                <p>No matches found for "{searchQuery}"</p>
              </div>
            )}
            
            <div style={{ marginTop: 60 }}>
              <div style={{ marginBottom:34 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:22 }}>📈</span>
                    <h2 style={{ fontSize:21, fontWeight:800, color:"#1a1a1a", margin:0 }}>All Products</h2>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button style={{ background:"#fff", border:"1px solid #eee", borderRadius:10, padding:"7px 14px", cursor:"pointer", fontSize:12, fontWeight:600, display:"flex", alignItems:"center", gap:5 }}><Filter size={12}/> Filter</button>
                    <button onClick={() => navigate('/all-categories')} style={{ background:"none", border:"1px solid #FF6B00", color:"#FF6B00", borderRadius:20, padding:"6px 16px", cursor:"pointer", fontSize:12, fontWeight:600 }}>View All →</button>
                  </div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
                  {products.map(p=><ProductCard key={p.id} product={p} onAdd={addCart} onWish={toggleWish} wished={wish.includes(p.id)}/>)}
                </div>
              </div>
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllCategory;
