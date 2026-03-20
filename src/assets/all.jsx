import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, Heart, Plus, Star } from "lucide-react";
import Footer from "./Footer.jsx";
import { useCart } from "../pages/CartContext.jsx";

function StarRating({ rating }) {
  return (
    <div style={{ display:"flex", gap:2 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={12} fill={i<=Math.floor(rating)?"#557a8c":"none"} color={i<=rating?"#557a8c":"#ddd"} />
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
        <div style={{ fontSize:16, fontWeight:800, color:"#111111" }}>LKR {p.price.toLocaleString()}</div>
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

export const categoriesData = [
  {
    id: "fashion",
    name: "Fashion",
    icon: "👕",
    subCategories: [
      { name: "Men's Casual Shirts", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=300&q=80" },
      { name: "Men's Formal Shirts", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=300&q=80" },
      { name: "Men's T-Shirts", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=300&q=80" },
      { name: "Men's Jeans", image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=300&q=80" },
      { name: "Men's Chinos", image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=300&q=80" },
      { name: "Men's Shorts", image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=300&q=80" },
      { name: "Jackets & Coats", image: "https://images.unsplash.com/photo-1551028919-30164bd466c4?auto=format&fit=crop&w=300&q=80" },
      { name: "Men's Innerwear", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=300&q=80" },
      { name: "Men's Ethnic Wear", image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=300&q=80" },
      { name: "Men's Shoes", image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=300&q=80" },
      { name: "Women's Dresses", image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=300&q=80" },
      { name: "Tops & Blouses", image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=300&q=80" },
      { name: "Skirts", image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=300&q=80" },
      { name: "Women's Jeans & Pants", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=300&q=80" },
      { name: "Sarees & Ethnic Wear", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80" },
      { name: "Handbags", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80" },
      { name: "Women's Footwear", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=300&q=80" },
      { name: "Jewelry", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=300&q=80" },
      { name: "Boys Clothing", image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=300&q=80" },
      { name: "Girls Clothing", image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=300&q=80" },
      { name: "Baby Wear", image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=300&q=80" },
      { name: "School Wear", image: "https://images.unsplash.com/photo-1627555170471-1523c7433dc8?auto=format&fit=crop&w=300&q=80" },
      { name: "Toys", image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=300&q=80" },
    ]
  },
  {
    id: "electronics",
    name: "Electronics",
    icon: "📱",
    subCategories: [
      { name: "Mobile Phones", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80" },
      { name: "Laptops", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=300&q=80" },
      { name: "Tablets", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=300&q=80" },
      { name: "Smart Watches", image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=300&q=80" },
      { name: "Headphones & Earbuds", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80" },
      { name: "Cameras", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=300&q=80" },
      { name: "Gaming Consoles", image: "https://images.unsplash.com/photo-1486401899868-0e435ed85128?auto=format&fit=crop&w=300&q=80" },
      { name: "Chargers & Cables", image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=300&q=80" },
      { name: "Power Banks", image: "https://images.unsplash.com/photo-1609592424248-97c7f26f28b7?auto=format&fit=crop&w=300&q=80" },
    ]
  },
  {
    id: "home-living",
    name: "Home & Living",
    icon: "🏠",
    subCategories: [
      { name: "Sofas", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80" },
      { name: "Beds", image: "https://images.unsplash.com/photo-1505693416388-b0346ef41495?auto=format&fit=crop&w=300&q=80" },
      { name: "Tables", image: "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=300&q=80" },
      { name: "Microwaves", image: "https://images.unsplash.com/photo-1585659722983-3a6752029399?auto=format&fit=crop&w=300&q=80" },
      { name: "Blenders", image: "https://images.unsplash.com/photo-1570222094114-28a9d8894b74?auto=format&fit=crop&w=300&q=80" },
      { name: "Wall Art", image: "https://images.unsplash.com/photo-1582658114383-a918a945b439?auto=format&fit=crop&w=300&q=80" },
      { name: "Lighting", image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=300&q=80" },
      { name: "Bedsheets", image: "https://images.unsplash.com/photo-1522771753035-4a5035252f35?auto=format&fit=crop&w=300&q=80" },
      { name: "Pillows", image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?auto=format&fit=crop&w=300&q=80" },
      { name: "Storage & Organization", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=300&q=80" },
    ]
  },
  {
    id: "beauty-personal",
    name: "Beauty & Personal Care",
    icon: "🧴",
    subCategories: [
      { name: "Face Wash & Creams", image: "https://images.unsplash.com/photo-1556228552-6c3638d6e388?auto=format&fit=crop&w=300&q=80" },
      { name: "Shampoo & Hair Oil", image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=300&q=80" },
      { name: "Lipstick & Foundation", image: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&w=300&q=80" },
      { name: "Perfume & Deodorant", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=300&q=80" },
      { name: "Trimmers & Razors", image: "https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=300&q=80" },
    ]
  },
  {
    id: "groceries",
    name: "Groceries",
    icon: "🥗",
    subCategories: [
      { name: "Fruits & Vegetables", image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=300&q=80" },
      { name: "Dairy Products", image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=300&q=80" },
      { name: "Snacks & Beverages", image: "https://images.unsplash.com/photo-1621939514649-28b12e81658b?auto=format&fit=crop&w=300&q=80" },
      { name: "Rice & Grains", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80" },
      { name: "Spices", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=300&q=80" },
      { name: "Frozen Foods", image: "https://images.unsplash.com/photo-1627483262268-9c96d8a36740?auto=format&fit=crop&w=300&q=80" },
    ]
  },
  {
    id: "sports-fitness",
    name: "Sports & Fitness",
    icon: "⚽",
    subCategories: [
      { name: "Gym Equipment", image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=300&q=80" },
      { name: "Sports Wear", image: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=300&q=80" },
      { name: "Outdoor Games", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=300&q=80" },
      { name: "Indoor Games", image: "https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?auto=format&fit=crop&w=300&q=80" },
      { name: "Yoga Mats & Dumbbells", image: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?auto=format&fit=crop&w=300&q=80" },
    ]
  },
  {
    id: "automotive",
    name: "Automotive",
    icon: "🚗",
    subCategories: [
      { name: "Car Accessories", image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=300&q=80" },
      { name: "Bike Accessories", image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=300&q=80" },
      { name: "Spare Parts", image: "https://images.unsplash.com/photo-1486262715619-01b80250e0dc?auto=format&fit=crop&w=300&q=80" },
      { name: "Engine Oil", image: "https://images.unsplash.com/photo-1508974239320-0a08f37e3c9f?auto=format&fit=crop&w=300&q=80" },
      { name: "Car Electronics", image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=300&q=80" },
    ]
  },
  {
    id: "books-education",
    name: "Books & Education",
    icon: "📚",
    subCategories: [
      { name: "School Books", image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=300&q=80" },
      { name: "Novels", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=300&q=80" },
      { name: "Educational Books", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=300&q=80" },
      { name: "Stationery", image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=300&q=80" },
      { name: "E-learning Materials", image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=300&q=80" },
    ]
  },
  {
    id: "pets",
    name: "Pets",
    icon: "🐶",
    subCategories: [
      { name: "Pet Food", image: "https://images.unsplash.com/photo-1589924691195-41432c84c161?auto=format&fit=crop&w=300&q=80" },
      { name: "Pet Toys", image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=300&q=80" },
      { name: "Pet Accessories", image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=300&q=80" },
      { name: "Grooming Products", image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=300&q=80" },
    ]
  },
  {
    id: "gaming",
    name: "Gaming",
    icon: "🎮",
    subCategories: [
      { name: "Video Games", image: "https://images.unsplash.com/photo-1592840496011-8b5209bdb0c5?auto=format&fit=crop&w=300&q=80" },
      { name: "Consoles", image: "https://images.unsplash.com/photo-1593118247619-e2d6f056869e?auto=format&fit=crop&w=300&q=80" },
      { name: "Gaming Accessories", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=300&q=80" },
      { name: "PC Gaming Parts", image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=300&q=80" },
    ]
  },
  {
    id: "travel-lifestyle",
    name: "Travel & Lifestyle",
    icon: "🧳",
    subCategories: [
      { name: "Bags & Luggage", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=300&q=80" },
      { name: "Travel Accessories", image: "https://images.unsplash.com/photo-1565514020176-892eb1036e62?auto=format&fit=crop&w=300&q=80" },
      { name: "Sunglasses", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=300&q=80" },
      { name: "Watches", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=300&q=80" },
    ]
  },
  {
    id: "health-medical",
    name: "Health & Medical",
    icon: "🏥",
    subCategories: [
      { name: "Medicines (OTC)", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80" },
      { name: "Supplements", image: "https://images.unsplash.com/photo-1511688878353-3a2f5be94c54?auto=format&fit=crop&w=300&q=80" },
      { name: "Medical Devices (BP Monitor)", image: "https://images.unsplash.com/photo-1576091160550-2187d80aeff2?auto=format&fit=crop&w=300&q=80" },
      { name: "First Aid", image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=300&q=80" },
    ]
  },
  {
    id: "gifts",
    name: "Gifts & Special Items",
    icon: "🎁",
    subCategories: [
      { name: "Birthday Gifts", image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=300&q=80" },
      { name: "Anniversary Gifts", image: "https://images.unsplash.com/photo-1512909481869-0eaa1e981756?auto=format&fit=crop&w=300&q=80" },
      { name: "Customized Gifts", image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=300&q=80" },
      { name: "Flowers", image: "https://images.unsplash.com/photo-1490750967868-58cb75069ed6?auto=format&fit=crop&w=300&q=80" },
    ]
  },
  {
    id: "brands",
    name: "Top Brands",
    icon: "🏆",
    subCategories: [
      { name: "NEXUS AI", image: "https://ui-avatars.com/api/?name=Nexus+AI&background=0D8ABC&color=fff&size=200" },
      { name: "AURA", image: "https://ui-avatars.com/api/?name=AURA&background=FF6B00&color=fff&size=200" },
      { name: "QuantumLeap", image: "https://ui-avatars.com/api/?name=Quantum&background=6366F1&color=fff&size=200" },
      { name: "Stellar", image: "https://ui-avatars.com/api/?name=Stellar&background=EC4899&color=fff&size=200" },
      { name: "Nova", image: "https://ui-avatars.com/api/?name=Nova&background=8B5CF6&color=fff&size=200" },
      { name: "Orion", image: "https://ui-avatars.com/api/?name=Orion&background=10B981&color=fff&size=200" },
      { name: "CyberCore", image: "https://ui-avatars.com/api/?name=Cyber&background=F59E0B&color=fff&size=200" },
      { name: "Zenith", image: "https://ui-avatars.com/api/?name=Zenith&background=14B8A6&color=fff&size=200" },
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
          background: rgba(85, 122, 140, 0.1);
          color: #557a8c;
          border-left-color: #557a8c;
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
          background: linear-gradient(90deg, transparent, rgba(85, 122, 140, 0.05));
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
          border-color: #557a8c;
          box-shadow: 0 4px 12px rgba(85, 122, 140, 0.15);
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
          color: #557a8c;
        }
        .add-to-cart-btn {
          margin-top: 12px;
          padding: 8px 16px;
          font-size: 12px;
          font-weight: 700;
          background: rgba(85, 122, 140, 0.1);
          color: #557a8c;
          border: 1px solid rgba(85, 122, 140, 0.3);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .add-to-cart-btn:hover {
          background: #557a8c;
          color: white;
          border-color: #557a8c;
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
                    <button onClick={() => navigate('/all-categories')} style={{ background:"none", border:"1px solid #557a8c", color:"#557a8c", borderRadius:20, padding:"6px 16px", cursor:"pointer", fontSize:12, fontWeight:600 }}>View All →</button>
                  </div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
                  {products.map(p=><ProductCard key={p.id} product={p} onAdd={addCart} onWish={toggleWish} wished={wish.includes(p.id)}/>)}
                </div>
              </div>
            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllCategory;
