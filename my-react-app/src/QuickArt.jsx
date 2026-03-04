import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, Search, Globe, ChevronDown, Star, Heart, Zap, Shield, Truck, RefreshCw, ChevronLeft, ChevronRight, Plus, Trash2, Edit, BarChart2, Package, Users, CreditCard, Settings, LogOut, Bell, Tag, Home, Grid, Camera, Watch, Headphones, Shirt, Dumbbell, BookOpen, Gem, Car, Monitor, Cpu, Tv, Download, ArrowRight, TrendingUp, Award, Filter, MoreVertical, Facebook, Twitter, Instagram, Youtube, Linkedin, X } from "lucide-react";

const CATEGORIES = [
  { name: "Electronics", icon: "💻", color: "#4F8EF7" },
  { name: "Fashion", icon: "👗", color: "#E879A0" },
  { name: "Wearables", icon: "⌚", color: "#A855F7" },
  { name: "Photography", icon: "📷", color: "#F59E0B" },
  { name: "Audio", icon: "🎧", color: "#10B981" },
  { name: "Sports", icon: "🏋️", color: "#EF4444" },
  { name: "Home & Living", icon: "🏠", color: "#6366F1" },
  { name: "Books", icon: "📚", color: "#8B5CF6" },
  { name: "Beauty", icon: "💎", color: "#EC4899" },
  { name: "Automotive", icon: "🚗", color: "#F97316" },
  { name: "Gaming", icon: "🎮", color: "#06B6D4" },
  { name: "Smart Home", icon: "📺", color: "#84CC16" },
];

const PRODUCTS = [
  { id: 1, name: "Wireless Earbuds Pro", cat: "Audio", price: 24500, rating: 4.5, reviews: 128, badge: "Best Seller", color: "#4F8EF7", emoji: "🎧" },
  { id: 2, name: "Smart Watch Elite", cat: "Wearables", price: 61000, rating: 4.3, reviews: 87, badge: "New", color: "#A855F7", emoji: "⌚" },
  { id: 3, name: "Camera Lens 85mm", cat: "Photography", price: 137500, rating: 4.7, reviews: 45, badge: "Premium", color: "#F59E0B", emoji: "📷" },
  { id: 4, name: "Gaming Laptop X15", cat: "Electronics", price: 289000, rating: 4.8, reviews: 213, badge: "Hot", color: "#EF4444", emoji: "💻" },
  { id: 5, name: "Air Purifier Pro", cat: "Home & Living", price: 45000, rating: 4.4, reviews: 67, badge: "Eco", color: "#10B981", emoji: "🌬️" },
  { id: 6, name: "Running Shoes Max", cat: "Sports", price: 18500, rating: 4.6, reviews: 302, badge: "Trending", color: "#F97316", emoji: "👟" },
  { id: 7, name: "4K OLED Smart TV", cat: "Smart Home", price: 185000, rating: 4.9, reviews: 156, badge: "Editor's Pick", color: "#06B6D4", emoji: "📺" },
  { id: 8, name: "Mechanical Keyboard", cat: "Electronics", price: 22000, rating: 4.5, reviews: 89, badge: "Popular", color: "#6366F1", emoji: "⌨️" },
];

const BRANDS = ["Samsung", "Apple", "Sony", "LG", "Nike", "Adidas", "Canon", "Bose", "Dell", "HP", "Asus", "Xiaomi"];
const PAYMENT_METHODS = ["Visa", "Mastercard", "PayPal", "Apple Pay", "Google Pay", "Bank Transfer", "Cash on Delivery", "Crypto"];

const HERO_SLIDES = [
  { title: "Next-Gen", highlight: "AR Shopping", sub: "Try before you buy with Virtual Try-On", bg: "linear-gradient(135deg,#0f0c29,#302b63,#24243e)", accent: "#FF6B00", emoji: "🥽" },
  { title: "Exclusive", highlight: "Flash Deals", sub: "Up to 70% off on premium electronics & fashion", bg: "linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)", accent: "#FFD700", emoji: "⚡" },
  { title: "Virtual", highlight: "Fitone Room", sub: "AI-powered virtual fitting room experience", bg: "linear-gradient(135deg,#200122,#6f0000,#200122)", accent: "#FF69B4", emoji: "👗" },
  { title: "3D Product", highlight: "Viewer", sub: "Explore every angle with immersive 3D technology", bg: "linear-gradient(135deg,#0d2137,#1a4a6e,#0d2137)", accent: "#00D4FF", emoji: "🔮" },
  { title: "Smart", highlight: "AI Assistant", sub: "Personalized shopping powered by AI", bg: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)", accent: "#7CFC00", emoji: "🤖" },
];

function StarRating({ rating }) {
  return (
    <div style={{ display:"flex", gap:2 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={12} fill={i<=Math.floor(rating)?"#FF6B00":"none"} color={i<=rating?"#FF6B00":"#ddd"} />
      ))}
    </div>
  );
}

function ProductCard({ product, onAdd, onWish, wished }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ background:"#fff", borderRadius:18, padding:"20px 16px 16px", boxShadow: hov?"0 16px 48px rgba(0,0,0,0.14)":"0 2px 12px rgba(0,0,0,0.06)", transition:"all 0.3s", transform: hov?"translateY(-6px)":"none", cursor:"pointer", position:"relative", overflow:"hidden" }}
    >
      <div style={{ position:"absolute", top:10, left:10, background:product.color, color:"#fff", fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:20, letterSpacing:0.8 }}>{product.badge}</div>
      <button onClick={e=>{e.stopPropagation();onWish(product.id);}} style={{ position:"absolute", top:10, right:10, background: wished?"#FFE8E8":"#f5f5f5", border:"none", borderRadius:"50%", width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
        <Heart size={14} fill={wished?"#EF4444":"none"} color={wished?"#EF4444":"#aaa"} />
      </button>
      <div style={{ textAlign:"center", margin:"10px 0 14px", background:`${product.color}12`, borderRadius:14, padding: product.img ? "0" : "12px 0", height: 140, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {product.img ? (
          <img src={product.img} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ fontSize:52 }}>{product.emoji}</div>
        )}
      </div>
      <div style={{ fontSize:14, fontWeight:700, color:"#1a1a1a", marginBottom:3 }}>{product.name}</div>
      <div style={{ fontSize:11, color:"#999", textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>{product.cat}</div>
      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:12 }}>
        <StarRating rating={product.rating} />
        <span style={{ fontSize:11, color:"#999" }}>({product.reviews})</span>
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ fontSize:16, fontWeight:800, color:"#1a1a1a" }}>LKR {product.price.toLocaleString()}</div>
        <button onClick={e=>{e.stopPropagation();onAdd(product);}} style={{ background:"linear-gradient(135deg,#FF6B00,#FF8C42)", color:"#fff", border:"none", borderRadius:20, padding:"7px 14px", fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
          <Plus size={12}/> Add
        </button>
      </div>
    </div>
  );
}

function AdminPanel({ onClose, products, setProducts, cats, setCats }) {
  const [tab, setTab] = useState("dashboard");
  const [showAddProd, setShowAddProd] = useState(false);
  const [showAddCat, setShowAddCat] = useState(false);
  const [np, setNp] = useState({ name:"", cat:"", price:"", badge:"New", emoji:"📦", desc: "", img: "" });
  const [nc, setNc] = useState({ name:"", color:"#FF6B00", icon:"📦" });
  const orders = [
    { id:"#QA-0012", customer:"Dilshan P.", product:"Smart Watch Elite", amount:61000, status:"Delivered", date:"2026-03-01" },
    { id:"#QA-0011", customer:"Nimasha R.", product:"Gaming Laptop X15", amount:289000, status:"Processing", date:"2026-03-02" },
    { id:"#QA-0010", customer:"Kasun S.", product:"Wireless Earbuds", amount:24500, status:"Shipped", date:"2026-03-02" },
    { id:"#QA-0009", customer:"Amali W.", product:"4K OLED Smart TV", amount:185000, status:"Pending", date:"2026-03-03" },
  ];
  const stats = [
    { label:"Total Revenue", value:"LKR 4.2M", color:"#10B981", change:"+18%", icon:"📈" },
    { label:"Total Orders", value:"1,284", color:"#4F8EF7", change:"+12%", icon:"📦" },
    { label:"Total Users", value:"8,942", color:"#A855F7", change:"+24%", icon:"👥" },
    { label:"Products", value:String(products.length), color:"#F97316", change:"Live", icon:"🛍️" },
  ];
  const tabs = [
    {id:"dashboard",l:"Dashboard"},{id:"products",l:"Products"},{id:"categories",l:"Categories"},
    {id:"orders",l:"Orders"},{id:"payments",l:"Payments"},{id:"users",l:"Users"},{id:"settings",l:"Settings"},
  ];
  const statusColor = { Delivered:"#10B981", Processing:"#F59E0B", Shipped:"#4F8EF7", Pending:"#EF4444" };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(6px)" }}>
      <div style={{ background:"#F4F6FA", borderRadius:24, width:"96vw", maxWidth:1120, height:"90vh", display:"flex", overflow:"hidden", boxShadow:"0 40px 120px rgba(0,0,0,0.45)" }}>

        {/* Sidebar */}
        <div style={{ width:220, background:"linear-gradient(180deg,#1a1a2e,#16213e)", display:"flex", flexDirection:"column", padding:"22px 14px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:28, paddingBottom:18, borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ background:"linear-gradient(135deg,#FF6B00,#FF8C42)", borderRadius:10, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>⚡</div>
            <div>
              <div style={{ color:"#fff", fontWeight:800, fontSize:14 }}>QuickArt</div>
              <div style={{ color:"#FF6B00", fontSize:10, fontWeight:700, letterSpacing:1 }}>ADMIN PANEL</div>
            </div>
          </div>
          <div style={{ flex:1 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={()=>setTab(t.id)} style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"11px 14px", borderRadius:10, border:"none", cursor:"pointer", marginBottom:4, background: tab===t.id?"rgba(255,107,0,0.18)":"transparent", color: tab===t.id?"#FF6B00":"rgba(255,255,255,0.55)", fontSize:13, fontWeight:600, textAlign:"left", borderLeft: tab===t.id?"3px solid #FF6B00":"3px solid transparent" }}>
                {t.l}
              </button>
            ))}
          </div>
          <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:10, padding:"10px 14px", marginBottom:8, display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:32, height:32, background:"linear-gradient(135deg,#4F8EF7,#A855F7)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700 }}>A</div>
            <div><div style={{ color:"#fff", fontSize:12, fontWeight:600 }}>admin</div><div style={{ color:"rgba(255,255,255,0.35)", fontSize:10 }}>Super Admin</div></div>
          </div>
          <button onClick={onClose} style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", background:"rgba(239,68,68,0.12)", color:"#EF4444", border:"none", borderRadius:10, cursor:"pointer", fontWeight:600, fontSize:13 }}>
            <LogOut size={14}/> Exit Panel
          </button>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:"auto", padding:26 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
            <div>
              <h2 style={{ margin:0, fontSize:21, fontWeight:800, color:"#1a1a1a" }}>{tabs.find(t=>t.id===tab)?.l}</h2>
              <p style={{ margin:"2px 0 0", color:"#888", fontSize:12 }}>QuickArt E-Commerce Management System</p>
            </div>
            <button style={{ background:"#fff", border:"1px solid #eee", borderRadius:10, padding:"8px 14px", cursor:"pointer", fontSize:13, display:"flex", alignItems:"center", gap:6 }}>
              <Bell size={14} color="#666"/> <span style={{ background:"#FF6B00", color:"#fff", borderRadius:"50%", width:16, height:16, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10 }}>3</span>
            </button>
          </div>

          {tab==="dashboard" && (
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:22 }}>
                {stats.map((s,i)=>(
                  <div key={i} style={{ background:"#fff", borderRadius:16, padding:18, boxShadow:"0 2px 10px rgba(0,0,0,0.05)" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                      <div style={{ background:`${s.color}14`, borderRadius:10, width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{s.icon}</div>
                      <span style={{ background:"#E8F5E9", color:"#10B981", fontSize:11, fontWeight:700, padding:"3px 8px", borderRadius:20, height:"fit-content" }}>{s.change}</span>
                    </div>
                    <div style={{ fontSize:21, fontWeight:800, color:"#1a1a1a" }}>{s.value}</div>
                    <div style={{ fontSize:12, color:"#888", marginTop:2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ background:"#fff", borderRadius:16, padding:18, boxShadow:"0 2px 10px rgba(0,0,0,0.05)" }}>
                <h3 style={{ margin:"0 0 14px", fontSize:15, fontWeight:700 }}>Recent Orders</h3>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead><tr>{["Order","Customer","Product","Amount","Status","Date"].map(h=><th key={h} style={{ textAlign:"left", fontSize:10, color:"#999", fontWeight:700, padding:"8px 12px", background:"#F8F9FC", textTransform:"uppercase", letterSpacing:0.8 }}>{h}</th>)}</tr></thead>
                  <tbody>{orders.map((o,i)=>(
                    <tr key={i} style={{ borderBottom:"1px solid #F0F0F0" }}>
                      <td style={{ padding:"12px", fontSize:13, fontWeight:600, color:"#4F8EF7" }}>{o.id}</td>
                      <td style={{ padding:"12px", fontSize:13 }}>{o.customer}</td>
                      <td style={{ padding:"12px", fontSize:13 }}>{o.product}</td>
                      <td style={{ padding:"12px", fontSize:13, fontWeight:600 }}>LKR {o.amount.toLocaleString()}</td>
                      <td style={{ padding:"12px" }}><span style={{ background:`${statusColor[o.status]}18`, color:statusColor[o.status], fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>{o.status}</span></td>
                      <td style={{ padding:"12px", fontSize:12, color:"#888" }}>{o.date}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}

          {tab==="products" && (
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
                <div style={{ background:"#fff", border:"1px solid #eee", borderRadius:10, padding:"8px 14px", display:"flex", alignItems:"center", gap:8 }}>
                  <Search size={14} color="#aaa"/>
                  <input placeholder="Search products..." style={{ border:"none", outline:"none", fontSize:13, width:180 }}/>
                </div>
                <button onClick={()=>setShowAddProd(true)} style={{ background:"linear-gradient(135deg,#FF6B00,#FF8C42)", color:"#fff", border:"none", borderRadius:10, padding:"10px 18px", cursor:"pointer", fontWeight:700, fontSize:13, display:"flex", alignItems:"center", gap:6 }}>
                  <Plus size={14}/> Add Product
                </button>
              </div>
              {showAddProd && (
                <div style={{ background:"#fff", borderRadius:16, padding:18, marginBottom:14, border:"2px solid #FF6B00" }}>
                  <h4 style={{ margin:"0 0 14px", fontWeight:700 }}>Add New Product</h4>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
                    {[["Name","name"],["Category","cat"],["Price","price"],["Badge","badge"],["Emoji","emoji"],["Description","desc"]].map(([lbl,key])=>(
                      <div key={key}>
                        <div style={{ fontSize:11, fontWeight:600, color:"#666", marginBottom:4 }}>{lbl}</div>
                        {key === "cat" ? (
                          <select value={np[key]} onChange={e=>setNp(p=>({...p,[key]:e.target.value}))} style={{ width:"100%", padding:"8px 12px", border:"1px solid #eee", borderRadius:8, fontSize:13, outline:"none", boxSizing:"border-box" }}>
                            <option value="">Select Category</option>
                            {cats.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                          </select>
                        ) : (
                          <input value={np[key]} onChange={e=>setNp(p=>({...p,[key]:e.target.value}))} style={{ width:"100%", padding:"8px 12px", border:"1px solid #eee", borderRadius:8, fontSize:13, outline:"none", boxSizing:"border-box" }}/>
                        )}
                      </div>
                    ))}
                    <div style={{ gridColumn: "1 / -1" }}>
                      <div style={{ fontSize:11, fontWeight:600, color:"#666", marginBottom:4 }}>Product Image</div>
                      <input type="file" accept="image/*" onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setNp(p => ({ ...p, img: reader.result }));
                          reader.readAsDataURL(file);
                        }
                      }} style={{ fontSize: 13 }} />
                      {np.img && <img src={np.img} alt="Preview" style={{ height: 40, marginLeft: 10, borderRadius: 4, verticalAlign: "middle" }} />}
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={()=>{if(!np.name||!np.price)return;setProducts(prev=>[...prev,{...np,id:Date.now(),rating:4.0,reviews:0,color:"#4F8EF7",price:Number(np.price)}]);setNp({name:"",cat:"",price:"",badge:"New",emoji:"📦",desc:"",img:""});setShowAddProd(false);}} style={{ background:"#FF6B00", color:"#fff", border:"none", borderRadius:8, padding:"9px 18px", cursor:"pointer", fontWeight:700, fontSize:13 }}>Save</button>
                    <button onClick={()=>setShowAddProd(false)} style={{ background:"#f5f5f5", color:"#666", border:"none", borderRadius:8, padding:"9px 16px", cursor:"pointer", fontSize:13 }}>Cancel</button>
                  </div>
                </div>
              )}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
                {products.map(p=>(
                  <div key={p.id} style={{ background:"#fff", borderRadius:14, padding:14, display:"flex", gap:12, alignItems:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
                    <div style={{ fontSize:28, background:"#F8F9FC", borderRadius:10, width:48, height:48, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, overflow: "hidden" }}>
                      {p.img ? <img src={p.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : p.emoji}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:700, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{p.name}</div>
                      <div style={{ fontSize:11, color:"#888" }}>{p.cat}</div>
                      <div style={{ fontSize:13, fontWeight:700, color:"#FF6B00" }}>LKR {Number(p.price).toLocaleString()}</div>
                    </div>
                    <div style={{ display:"flex", gap:4 }}>
                      <button style={{ background:"#EEF2FF", border:"none", borderRadius:8, width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}><Edit size={12} color="#6366F1"/></button>
                      <button onClick={()=>setProducts(prev=>prev.filter(x=>x.id!==p.id))} style={{ background:"#FEE2E2", border:"none", borderRadius:8, width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}><Trash2 size={12} color="#EF4444"/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab==="categories" && (
            <div>
              <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:14 }}>
                <button onClick={()=>setShowAddCat(true)} style={{ background:"linear-gradient(135deg,#FF6B00,#FF8C42)", color:"#fff", border:"none", borderRadius:10, padding:"10px 18px", cursor:"pointer", fontWeight:700, fontSize:13, display:"flex", alignItems:"center", gap:6 }}>
                  <Plus size={14}/> Add Category
                </button>
              </div>
              {showAddCat && (
                <div style={{ background:"#fff", borderRadius:16, padding:18, marginBottom:14, border:"2px solid #FF6B00" }}>
                  <h4 style={{ margin:"0 0 12px", fontWeight:700 }}>New Category</h4>
                  <div style={{ display:"flex", gap:10, alignItems:"flex-end" }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:11, fontWeight:600, color:"#666", marginBottom:4 }}>Name</div>
                      <input value={nc.name} onChange={e=>setNc(p=>({...p,name:e.target.value}))} style={{ width:"100%", padding:"8px 12px", border:"1px solid #eee", borderRadius:8, fontSize:13, outline:"none", boxSizing:"border-box" }}/>
                    </div>
                    <div>
                      <div style={{ fontSize:11, fontWeight:600, color:"#666", marginBottom:4 }}>Icon</div>
                      <input value={nc.icon} onChange={e=>setNc(p=>({...p,icon:e.target.value}))} style={{ width:60, padding:"8px 12px", border:"1px solid #eee", borderRadius:8, fontSize:20, outline:"none", textAlign:"center" }}/>
                    </div>
                    <div>
                      <div style={{ fontSize:11, fontWeight:600, color:"#666", marginBottom:4 }}>Color</div>
                      <input type="color" value={nc.color} onChange={e=>setNc(p=>({...p,color:e.target.value}))} style={{ width:44, height:36, border:"1px solid #eee", borderRadius:8, cursor:"pointer" }}/>
                    </div>
                    <button onClick={()=>{if(!nc.name)return;setCats(prev=>[...prev,nc]);setNc({name:"",color:"#FF6B00",icon:"📦"});setShowAddCat(false);}} style={{ background:"#FF6B00", color:"#fff", border:"none", borderRadius:8, padding:"9px 18px", cursor:"pointer", fontWeight:700, fontSize:13 }}>Add</button>
                    <button onClick={()=>setShowAddCat(false)} style={{ background:"#f5f5f5", color:"#666", border:"none", borderRadius:8, padding:"9px 14px", cursor:"pointer" }}>Cancel</button>
                  </div>
                </div>
              )}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
                {cats.map((c,i)=>(
                  <div key={i} style={{ background:"#fff", borderRadius:14, padding:"14px 16px", display:"flex", alignItems:"center", gap:12, boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
                    <div style={{ width:44, height:44, background:`${c.color}14`, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{c.icon}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:14 }}>{c.name}</div>
                      <div style={{ fontSize:11, color:"#888" }}>Active Category</div>
                    </div>
                    <button onClick={()=>setCats(prev=>prev.filter((_,j)=>j!==i))} style={{ background:"#FEE2E2", border:"none", borderRadius:8, width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}><Trash2 size={12} color="#EF4444"/></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab==="orders" && (
            <div style={{ background:"#fff", borderRadius:16, padding:18, boxShadow:"0 2px 10px rgba(0,0,0,0.05)" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead><tr>{["Order","Customer","Product","Amount","Status","Date","Action"].map(h=><th key={h} style={{ textAlign:"left", fontSize:10, color:"#999", fontWeight:700, padding:"10px 12px", background:"#F8F9FC", textTransform:"uppercase" }}>{h}</th>)}</tr></thead>
                <tbody>{orders.map((o,i)=>(
                  <tr key={i} style={{ borderBottom:"1px solid #F5F5F5" }}>
                    <td style={{ padding:"14px 12px", fontSize:13, fontWeight:600, color:"#4F8EF7" }}>{o.id}</td>
                    <td style={{ padding:"14px 12px", fontSize:13 }}>{o.customer}</td>
                    <td style={{ padding:"14px 12px", fontSize:13 }}>{o.product}</td>
                    <td style={{ padding:"14px 12px", fontSize:13, fontWeight:700 }}>LKR {o.amount.toLocaleString()}</td>
                    <td style={{ padding:"14px 12px" }}><span style={{ background:`${statusColor[o.status]}18`, color:statusColor[o.status], fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>{o.status}</span></td>
                    <td style={{ padding:"14px 12px", fontSize:12, color:"#888" }}>{o.date}</td>
                    <td style={{ padding:"14px 12px" }}><button style={{ background:"#F8F9FC", border:"none", borderRadius:8, padding:"6px 10px", cursor:"pointer" }}><MoreVertical size={13} color="#666"/></button></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}

          {tab==="payments" && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
              {PAYMENT_METHODS.map((m,i)=>(
                <div key={i} style={{ background:"#fff", borderRadius:14, padding:"20px 14px", textAlign:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
                  <div style={{ fontSize:36, marginBottom:10 }}>{["💳","💳","🅿️","🍎","🔵","🏦","💵","₿"][i]}</div>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:8 }}>{m}</div>
                  <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:"#E8F5E9", color:"#10B981", fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>
                    <div style={{ width:6, height:6, borderRadius:"50%", background:"#10B981" }}/> Active
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab==="users" && (
            <div style={{ background:"#fff", borderRadius:16, padding:18, boxShadow:"0 2px 10px rgba(0,0,0,0.05)" }}>
              {["Dilshan P.","Nimasha R.","Kasun S.","Amali W.","Thilina M.","Sachini B."].map((u,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 0", borderBottom:"1px solid #F5F5F5" }}>
                  <div style={{ width:40, height:40, background:`hsl(${i*60},70%,60%)`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700 }}>{u[0]}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600, fontSize:14 }}>{u}</div>
                    <div style={{ fontSize:12, color:"#888" }}>user{i+1}@example.com · Joined Mar 2026</div>
                  </div>
                  <span style={{ fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:20, background: i===0?"#FFF3E0":"#E8F5E9", color: i===0?"#F97316":"#10B981" }}>{i===0?"VIP":"Regular"}</span>
                </div>
              ))}
            </div>
          )}

          {tab==="settings" && (
            <div style={{ background:"#fff", borderRadius:16, padding:22, boxShadow:"0 2px 10px rgba(0,0,0,0.05)" }}>
              {[["Store Name","QuickArt"],["Store Email","admin@quickart.lk"],["Currency","LKR - Sri Lankan Rupee"],["Default Language","English"],["Time Zone","Asia/Colombo"],["AR Feature","Enabled"],["3D Viewer","Enabled"],["Virtual Fitone","Enabled"]].map(([label,val],i)=>(
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:"1px solid #F5F5F5" }}>
                  <div style={{ fontWeight:600, fontSize:14 }}>{label}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ color:"#666", fontSize:13 }}>{val}</span>
                    <button style={{ background:"#F8F9FC", border:"none", borderRadius:8, padding:"5px 12px", cursor:"pointer", fontSize:12, color:"#4F8EF7", fontWeight:600 }}>Edit</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function QuickArt() {
  const location = useLocation();
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);
  const [tab, setTab] = useState("ai");
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState(PRODUCTS);
  const [cats, setCats] = useState(CATEGORIES);
  const [wish, setWish] = useState([]);
  const [admin, setAdmin] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [pSlide, setPSlide] = useState(0);
  const [cd, setCd] = useState({ h:5, m:32, s:17 });
  const [notif, setNotif] = useState(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (location.pathname === '/admin') {
      setAdmin(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    const t = setInterval(()=>setSlide(s=>(s+1)%HERO_SLIDES.length), 5000);
    return ()=>clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(()=>setCd(c=>{
      if(c.s>0) return {...c,s:c.s-1};
      if(c.m>0) return {...c,m:c.m-1,s:59};
      if(c.h>0) return {h:c.h-1,m:59,s:59};
      return c;
    }), 1000);
    return ()=>clearInterval(t);
  }, []);

  const notify = msg => { setNotif(msg); setTimeout(()=>setNotif(null), 2800); };

  const addCart = p => {
    setCart(prev => { const ex=prev.find(x=>x.id===p.id); return ex?prev.map(x=>x.id===p.id?{...x,qty:x.qty+1}:x):[...prev,{...p,qty:1}]; });
    notify(`✅ ${p.name} added to cart!`);
  };

  const toggleWish = id => setWish(prev => prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);

  const closeAdminPanel = () => {
    setAdmin(false);
    if (location.pathname === '/admin') {
      navigate('/');
    }
  };

  const hs = HERO_SLIDES[slide];
  const cartTotal = cart.reduce((a,x)=>a+x.price*x.qty,0);
  const cartCount = cart.reduce((a,x)=>a+x.qty,0);
  const pad = n => String(n).padStart(2,"0");
  const visProds = products.slice(pSlide, pSlide+3);

  return (
    <div style={{ fontFamily:"'Sora','Segoe UI',sans-serif", minHeight:"100vh", background:"#F4F6FA", overflowX:"hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800;900&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:#f1f1f1; }
        ::-webkit-scrollbar-thumb { background:#FF6B00; border-radius:3px; }
      `}</style>

      {/* Notification */}
      {notif && (
        <div style={{ position:"fixed", top:80, right:20, background:"#1a1a1a", color:"#fff", padding:"12px 20px", borderRadius:12, zIndex:9999, fontSize:13, fontWeight:600, boxShadow:"0 8px 30px rgba(0,0,0,0.25)", animation:"fadeIn 0.3s ease" }}>
          {notif}
        </div>
      )}

      {admin && <AdminPanel onClose={closeAdminPanel} products={products} setProducts={setProducts} cats={cats} setCats={setCats} />}

      <button onClick={()=>navigate('/admin')} style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1001, background:"linear-gradient(135deg,#4F8EF7,#A855F7)", color:"#fff", border:"none", borderRadius:14, padding:"10px 16px", cursor:"pointer", fontSize:13, fontWeight:700, display:"flex", alignItems:"center", gap:6, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
        <Settings size={14}/> Admin Panel
      </button>

      {/* Cart Dropdown */}
      {cartOpen && (
        <div style={{ position:"fixed", top:80, right:20, background:"#fff", borderRadius:20, boxShadow:"0 20px 60px rgba(0,0,0,0.14)", width:340, zIndex:400, overflow:"hidden", animation:"fadeIn 0.2s ease" }}>
          <div style={{ padding:"16px 18px", borderBottom:"1px solid #F0F0F0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontWeight:800, fontSize:15 }}>My Cart ({cartCount})</span>
            <button onClick={()=>setCartOpen(false)} style={{ background:"none", border:"none", cursor:"pointer" }}><X size={16}/></button>
          </div>
          <div style={{ maxHeight:300, overflowY:"auto", padding:"8px 18px" }}>
            {cart.length===0?(
              <div style={{ textAlign:"center", padding:"32px 0", color:"#ccc" }}>
                <div style={{ fontSize:40, marginBottom:8 }}>🛒</div>
                <div style={{ fontSize:13, color:"#888" }}>Your cart is empty</div>
              </div>
            ):cart.map(item=>(
              <div key={item.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 0", borderBottom:"1px solid #F5F5F5" }}>
                <div style={{ fontSize:26, background:"#F8F9FC", borderRadius:10, width:42, height:42, display:"flex", alignItems:"center", justifyContent:"center" }}>{item.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:600 }}>{item.name}</div>
                  <div style={{ fontSize:11, color:"#888" }}>×{item.qty}</div>
                </div>
                <div style={{ fontSize:13, fontWeight:700, color:"#FF6B00" }}>LKR {(item.price*item.qty).toLocaleString()}</div>
              </div>
            ))}
          </div>
          {cart.length>0 && (
            <div style={{ padding:18, borderTop:"1px solid #F0F0F0" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                <span style={{ fontWeight:700 }}>Total</span>
                <span style={{ fontWeight:800, color:"#FF6B00", fontSize:16 }}>LKR {cartTotal.toLocaleString()}</span>
              </div>
              <button style={{ width:"100%", background:"linear-gradient(135deg,#FF6B00,#FF8C42)", color:"#fff", border:"none", borderRadius:12, padding:"12px", cursor:"pointer", fontWeight:700, fontSize:14 }}>
                Checkout →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Hero Banner */}
      <section style={{ background:hs.bg, minHeight:500, position:"relative", overflow:"hidden", display:"flex", alignItems:"center", transition:"background 0.8s ease" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 65% 50%,rgba(255,107,0,0.07),transparent 70%)" }}/>
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"56px 40px", display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", position:"relative", zIndex:2 }}>
          <div style={{ maxWidth:500 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(255,107,0,0.14)", border:"1px solid rgba(255,107,0,0.28)", borderRadius:20, padding:"5px 14px", marginBottom:18 }}>
              <span style={{ fontSize:12 }}>⚡</span>
              <span style={{ color:hs.accent, fontSize:11, fontWeight:700, letterSpacing:1.2, textTransform:"uppercase" }}>QuickArt Platform</span>
            </div>
            <h1 style={{ fontSize:58, fontWeight:900, color:"#fff", lineHeight:1.05, margin:"0 0 10px", fontFamily:"'Sora',sans-serif" }}>
              {hs.title}<br/><span style={{ color:hs.accent }}>{hs.highlight}</span>
            </h1>
            <p style={{ color:"rgba(255,255,255,0.6)", fontSize:15, lineHeight:1.75, margin:"0 0 30px" }}>{hs.sub}</p>
            <div style={{ display:"flex", gap:12 }}>
              <button style={{ background:`linear-gradient(135deg,${hs.accent},${hs.accent}bb)`, color:"#fff", border:"none", borderRadius:14, padding:"13px 26px", cursor:"pointer", fontWeight:700, fontSize:14, display:"flex", alignItems:"center", gap:8 }}>
                Explore Now <ArrowRight size={16}/>
              </button>
              <button style={{ background:"rgba(255,255,255,0.09)", color:"#fff", border:"1px solid rgba(255,255,255,0.18)", borderRadius:14, padding:"13px 22px", cursor:"pointer", fontWeight:600, fontSize:14, backdropFilter:"blur(10px)" }}>
                View Demo
              </button>
            </div>
            <div style={{ display:"flex", gap:32, marginTop:34 }}>
              {[["50K+","Products"],["1M+","Customers"],["200+","Brands"]].map(([n,l])=>(
                <div key={l}>
                  <div style={{ color:"#fff", fontSize:20, fontWeight:800 }}>{n}</div>
                  <div style={{ color:"rgba(255,255,255,0.45)", fontSize:11 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ fontSize:140, opacity:0.88, filter:"drop-shadow(0 20px 60px rgba(0,0,0,0.5))", animation:"float 3s ease-in-out infinite" }}>{hs.emoji}</div>
        </div>
        <div style={{ position:"absolute", bottom:20, left:"50%", transform:"translateX(-50%)", display:"flex", gap:8 }}>
          {HERO_SLIDES.map((_,i)=>(
            <button key={i} onClick={()=>setSlide(i)} style={{ width:i===slide?28:8, height:8, borderRadius:4, background:i===slide?hs.accent:"rgba(255,255,255,0.28)", border:"none", cursor:"pointer", transition:"all 0.3s" }}/>
          ))}
        </div>
        <button onClick={()=>setSlide(s=>(s-1+HERO_SLIDES.length)%HERO_SLIDES.length)} style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.18)", borderRadius:"50%", width:42, height:42, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(8px)" }}>
          <ChevronLeft size={20} color="#fff"/>
        </button>
        <button onClick={()=>setSlide(s=>(s+1)%HERO_SLIDES.length)} style={{ position:"absolute", right:16, top:"50%", transform:"translateY(-50%)", background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.18)", borderRadius:"50%", width:42, height:42, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(8px)" }}>
          <ChevronRight size={20} color="#fff"/>
        </button>
      </section>

      {/* Feature Bar */}
      <div style={{ background:"#1a1a1a", padding:"13px 40px" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", display:"flex", justifyContent:"space-around" }}>
          {[["🚚","Free Delivery","Over LKR 5,000"],["🛡️","Secure Payment","100% Protected"],["↩️","Easy Returns","30 Day Policy"],["⚡","24/7 Support","Always Here"],["🏆","Top Quality","Verified Products"]].map(([e,l,s])=>(
            <div key={l} style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:20 }}>{e}</span>
              <div>
                <div style={{ color:"#fff", fontSize:12, fontWeight:700 }}>{l}</div>
                <div style={{ color:"rgba(255,255,255,0.4)", fontSize:10 }}>{s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"30px 20px" }}>

        {/* AI/3D/VR/AR Tabs */}
        <div style={{ background:"#fff", borderRadius:20, padding:22, marginBottom:26, boxShadow:"0 4px 24px rgba(0,0,0,0.06)" }}>
          <div style={{ display:"flex", gap:4, marginBottom:18, borderBottom:"2px solid #F0F0F0" }}>
            {[{id:"ai",l:"🤖 AI Assistant"},{id:"3d",l:"🔮 3D Viewer"},{id:"vr",l:"👗 Virtual Fitone Room"},{id:"ar",l:"🥽 AR Features"}].map(({id,l})=>(
              <button key={id} onClick={() => {
                if (id === 'ai') navigate('/quick-art-ai');
                else if (id === '3d') navigate('/quickart-3d');
                else if (id === 'vr') navigate('/virtual-fitting-room');
                else setTab(id);
              }} style={{ padding:"9px 16px", border:"none", borderBottom: tab===id?"3px solid #FF6B00":"3px solid transparent", background:"none", cursor:"pointer", fontWeight:700, fontSize:12, color: tab===id?"#FF6B00":"#888", marginBottom:-2, transition:"all 0.2s" }}>{l}</button>
            ))}
          </div>
          {tab==="ai" && (
            <div>
              <p style={{ color:"#888", fontSize:13, marginBottom:14 }}>AI-powered search — describe any product naturally or upload an image.</p>
              <div style={{ display:"flex", gap:10 }}>
                <div style={{ flex:1, background:"#F4F6FA", borderRadius:14, padding:"13px 16px", display:"flex", alignItems:"center", gap:10, border:"2px solid transparent", transition:"border 0.2s" }}>
                  <Search size={16} color="#aaa"/>
                  <input placeholder="Search products, categories, or brands..." style={{ flex:1, border:"none", background:"none", outline:"none", fontSize:14, color:"#333" }}/>
                </div>
                <button style={{ background:"#F4F6FA", border:"1px solid #eee", borderRadius:12, padding:"11px 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontSize:12, fontWeight:600, color:"#555" }}>
                  <Camera size={14}/> Image Search
                </button>
                <button style={{ background:"linear-gradient(135deg,#FF6B00,#FF8C42)", color:"#fff", border:"none", borderRadius:12, padding:"11px 22px", cursor:"pointer", fontWeight:700, fontSize:14 }}>🔍 Search</button>
              </div>
            </div>
          )}
          {tab==="3d" && (
            <div style={{ background:"linear-gradient(135deg,#0d2137,#1a4a6e)", borderRadius:16, padding:30, textAlign:"center" }}>
              <div style={{ fontSize:56, marginBottom:14, animation:"float 3s ease-in-out infinite" }}>🔮</div>
              <h3 style={{ color:"#fff", fontWeight:800, fontSize:18, margin:"0 0 8px" }}>3D Product Viewer</h3>
              <p style={{ color:"rgba(255,255,255,0.55)", fontSize:13, marginBottom:18 }}>Explore products from every angle with immersive 3D technology. Zoom, rotate, and inspect before buying.</p>
              <button style={{ background:"#00D4FF", color:"#1a1a1a", border:"none", borderRadius:12, padding:"11px 22px", cursor:"pointer", fontWeight:700, fontSize:14 }}>Launch 3D Viewer →</button>
            </div>
          )}
          {tab==="vr" && (
            <div style={{ background:"linear-gradient(135deg,#200122,#6f0000)", borderRadius:16, padding:30, textAlign:"center" }}>
              <div style={{ fontSize:56, marginBottom:14, animation:"float 3s ease-in-out infinite" }}>👗</div>
              <h3 style={{ color:"#fff", fontWeight:800, fontSize:18, margin:"0 0 8px" }}>Virtual Fitone Room</h3>
              <p style={{ color:"rgba(255,255,255,0.55)", fontSize:13, marginBottom:18 }}>Try on clothes and accessories virtually using our AI-powered fitting room technology.</p>
              <button style={{ background:"#FF69B4", color:"#fff", border:"none", borderRadius:12, padding:"11px 22px", cursor:"pointer", fontWeight:700, fontSize:14 }}>Enter Fitting Room →</button>
            </div>
          )}
          {tab==="ar" && (
            <div style={{ background:"linear-gradient(135deg,#0f0c29,#302b63)", borderRadius:16, padding:30, textAlign:"center" }}>
              <div style={{ fontSize:56, marginBottom:14, animation:"float 3s ease-in-out infinite" }}>🥽</div>
              <h3 style={{ color:"#fff", fontWeight:800, fontSize:18, margin:"0 0 8px" }}>AR Try-On Technology</h3>
              <p style={{ color:"rgba(255,255,255,0.55)", fontSize:13, marginBottom:18 }}>Place furniture in your room, try glasses, watches — all in augmented reality before you buy.</p>
              <button style={{ background:"#FF6B00", color:"#fff", border:"none", borderRadius:12, padding:"11px 22px", cursor:"pointer", fontWeight:700, fontSize:14 }}>Start AR Experience →</button>
            </div>
          )}
        </div>

        {/* Flash Sale */}
        <div style={{ background:"linear-gradient(135deg,#1a1a1a,#2d1a00)", borderRadius:20, padding:"18px 26px", marginBottom:26, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
            <div style={{ background:"#FF6B00", borderRadius:12, padding:"7px 14px", display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ fontSize:14 }}>⚡</span>
              <span style={{ color:"#fff", fontWeight:800, fontSize:13 }}>FLASH SALE</span>
            </div>
            <span style={{ color:"rgba(255,255,255,0.6)", fontSize:13 }}>Ends in</span>
            <div style={{ display:"flex", gap:6 }}>
              {[[pad(cd.h),"HRS"],[pad(cd.m),"MIN"],[pad(cd.s),"SEC"]].map(([n,l])=>(
                <div key={l} style={{ background:"#FF6B00", borderRadius:10, padding:"7px 10px", textAlign:"center", minWidth:48 }}>
                  <div style={{ color:"#fff", fontSize:17, fontWeight:800, lineHeight:1 }}>{n}</div>
                  <div style={{ color:"rgba(255,255,255,0.65)", fontSize:8, letterSpacing:1 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <button style={{ background:"#FF6B00", color:"#fff", border:"none", borderRadius:12, padding:"11px 20px", cursor:"pointer", fontWeight:700, fontSize:13 }}>View All Deals →</button>
        </div>

        {/* Featured Products */}
        <div style={{ marginBottom:34 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:22 }}>⭐</span>
              <h2 style={{ fontSize:21, fontWeight:800, color:"#1a1a1a", margin:0 }}>Featured Products</h2>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={()=>setPSlide(s=>Math.max(0,s-1))} style={{ background:"#fff", border:"1px solid #eee", borderRadius:"50%", width:34, height:34, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><ChevronLeft size={15}/></button>
              <button onClick={()=>setPSlide(s=>Math.min(products.length-3,s+1))} style={{ background:"#1a1a1a", border:"none", borderRadius:"50%", width:34, height:34, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><ChevronRight size={15} color="#fff"/></button>
              <button style={{ background:"none", border:"1px solid #FF6B00", color:"#FF6B00", borderRadius:20, padding:"6px 16px", cursor:"pointer", fontSize:12, fontWeight:600 }}>View All →</button>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
            {visProds.map(p=><ProductCard key={p.id} product={p} onAdd={addCart} onWish={toggleWish} wished={wish.includes(p.id)}/>)}
          </div>
        </div>

        {/* Ad Banners */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:34 }}>
          {[
            { emoji:"💻", label:"EXCLUSIVE OFFER", title:"Gaming Laptops\nUp to 40% Off", btn:"Shop Electronics →", bg:"linear-gradient(135deg,#1a1a2e,#4F8EF7)", btnColor:"#4F8EF7" },
            { emoji:"👗", label:"NEW ARRIVALS", title:"Fashion Collection\nSpring 2026", btn:"Explore Fashion →", bg:"linear-gradient(135deg,#200122,#E879A0)", btnColor:"#E879A0" },
          ].map((ad,i)=>(
            <div key={i} style={{ background:ad.bg, borderRadius:20, padding:"26px 24px", display:"flex", alignItems:"center", gap:20, overflow:"hidden" }}>
              <div style={{ fontSize:54 }}>{ad.emoji}</div>
              <div>
                <div style={{ color:"rgba(255,255,255,0.55)", fontSize:10, fontWeight:700, letterSpacing:2, marginBottom:6, textTransform:"uppercase" }}>{ad.label}</div>
                <div style={{ color:"#fff", fontSize:18, fontWeight:800, marginBottom:12, whiteSpace:"pre-line" }}>{ad.title}</div>
                <button style={{ background:"#fff", color:ad.btnColor, border:"none", borderRadius:10, padding:"8px 16px", cursor:"pointer", fontWeight:700, fontSize:12 }}>{ad.btn}</button>
              </div>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div style={{ marginBottom:34 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:22 }}>📂</span>
              <h2 style={{ fontSize:21, fontWeight:800, color:"#1a1a1a", margin:0 }}>All Categories</h2>
            </div>
            <button style={{ background:"none", border:"1px solid #FF6B00", color:"#FF6B00", borderRadius:20, padding:"6px 16px", cursor:"pointer", fontSize:12, fontWeight:600 }}>All →</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:12 }}>
            {cats.map((c,i)=>(
              <div key={i} style={{ background:"#fff", borderRadius:16, padding:"18px 10px", textAlign:"center", cursor:"pointer", boxShadow:"0 2px 8px rgba(0,0,0,0.05)", transition:"all 0.2s" }}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 12px 30px ${c.color}20`;}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.05)";}}>
                <div style={{ width:50, height:50, background:`${c.color}14`, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 10px", fontSize:24 }}>{c.icon}</div>
                <div style={{ fontSize:11, fontWeight:700, color:"#1a1a1a" }}>{c.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Browse by Image Type */}
        <div style={{ marginBottom:34 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
            <span style={{ fontSize:22 }}>📸</span>
            <h2 style={{ fontSize:21, fontWeight:800, color:"#1a1a1a", margin:0 }}>Browse by Image Type</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:14 }}>
            {[{l:"Product Photos",e:"📸"},{l:"Model Shots",e:"👥"},{l:"Videos",e:"🎥"},{l:"Size Charts",e:"📐"},{l:"Lifestyle",e:"✨"}].map(({l,e})=>(
              <div key={l} style={{ background:"#fff", borderRadius:16, padding:22, textAlign:"center", cursor:"pointer", boxShadow:"0 2px 8px rgba(0,0,0,0.05)", transition:"all 0.2s" }}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 10px 28px rgba(0,0,0,0.1)";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.05)";}}>
                <div style={{ fontSize:34, marginBottom:10 }}>{e}</div>
                <div style={{ fontSize:12, fontWeight:700, color:"#1a1a1a" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* All Products */}
        <div style={{ marginBottom:34 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:22 }}>📈</span>
              <h2 style={{ fontSize:21, fontWeight:800, color:"#1a1a1a", margin:0 }}>All Products</h2>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button style={{ background:"#fff", border:"1px solid #eee", borderRadius:10, padding:"7px 14px", cursor:"pointer", fontSize:12, fontWeight:600, display:"flex", alignItems:"center", gap:5 }}><Filter size={12}/> Filter</button>
              <button style={{ background:"none", border:"1px solid #FF6B00", color:"#FF6B00", borderRadius:20, padding:"6px 16px", cursor:"pointer", fontSize:12, fontWeight:600 }}>View All →</button>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
            {products.map(p=><ProductCard key={p.id} product={p} onAdd={addCart} onWish={toggleWish} wished={wish.includes(p.id)}/>)}
          </div>
        </div>

        {/* Brands */}
        <div style={{ marginBottom:34 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
            <span style={{ fontSize:22 }}>🏆</span>
            <h2 style={{ fontSize:21, fontWeight:800, color:"#1a1a1a", margin:0 }}>Top Brands</h2>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
            {BRANDS.map(b=>(
              <div key={b} style={{ background:"#fff", borderRadius:14, padding:"13px 22px", cursor:"pointer", boxShadow:"0 2px 8px rgba(0,0,0,0.05)", fontWeight:700, fontSize:14, color:"#444", transition:"all 0.2s", border:"1px solid transparent" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="#FF6B00";e.currentTarget.style.color="#FF6B00";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="transparent";e.currentTarget.style.color="#444";}}>
                {b}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile App Banner */}
        <div style={{ background:"linear-gradient(135deg,#1a1a1a,#2d1a00,#1a1a1a)", borderRadius:24, padding:"38px 44px", marginBottom:34, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:24, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", right:0, top:0, width:400, height:"100%", background:"radial-gradient(ellipse at right,rgba(255,107,0,0.09),transparent)" }}/>
          <div style={{ position:"relative", zIndex:2 }}>
            <div style={{ color:"#FF6B00", fontSize:11, fontWeight:700, letterSpacing:2, marginBottom:10, textTransform:"uppercase" }}>📱 Mobile App Available</div>
            <h2 style={{ color:"#fff", fontSize:28, fontWeight:900, margin:"0 0 10px" }}>Shop Smarter with<br/><span style={{ color:"#FF6B00" }}>QuickArt App</span></h2>
            <p style={{ color:"rgba(255,255,255,0.55)", fontSize:13, margin:"0 0 24px", lineHeight:1.7 }}>Scan products, use AR try-on, get exclusive app-only deals.<br/>Available on iOS & Android.</p>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              <button style={{ background:"#fff", color:"#1a1a1a", border:"none", borderRadius:12, padding:"11px 20px", cursor:"pointer", fontWeight:700, fontSize:13, display:"flex", alignItems:"center", gap:7 }}>
                <Download size={15}/> App Store
              </button>
              <button style={{ background:"rgba(255,255,255,0.09)", color:"#fff", border:"1px solid rgba(255,255,255,0.18)", borderRadius:12, padding:"11px 20px", cursor:"pointer", fontWeight:700, fontSize:13, display:"flex", alignItems:"center", gap:7, backdropFilter:"blur(8px)" }}>
                <Download size={15}/> Google Play
              </button>
            </div>
          </div>
          <div style={{ fontSize:110, opacity:0.75, position:"relative", zIndex:2 }}>📱</div>
          <div style={{ display:"flex", flexDirection:"column", gap:12, position:"relative", zIndex:2 }}>
            {[["⚡","Instant Notifications"],["🔍","AI Product Search"],["🥽","AR Try-On"],["💳","1-Click Checkout"]].map(([e,l])=>(
              <div key={l} style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:18 }}>{e}</span>
                <span style={{ color:"rgba(255,255,255,0.75)", fontSize:13, fontWeight:600 }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div style={{ background:"linear-gradient(135deg,#FF6B00,#FF8C42)", borderRadius:20, padding:"32px 40px", marginBottom:34, textAlign:"center" }}>
          <h2 style={{ color:"#fff", fontSize:24, fontWeight:800, margin:"0 0 8px" }}>Stay in the Loop 📬</h2>
          <p style={{ color:"rgba(255,255,255,0.8)", fontSize:14, margin:"0 0 20px" }}>Get exclusive deals, new arrivals, and tech news delivered to your inbox.</p>
          <div style={{ display:"flex", gap:10, maxWidth:420, margin:"0 auto" }}>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Enter your email address..." style={{ flex:1, padding:"12px 16px", borderRadius:12, border:"none", outline:"none", fontSize:14 }}/>
            <button onClick={()=>{if(email){notify("✅ Subscribed successfully!");setEmail("");}}} style={{ background:"#1a1a1a", color:"#fff", border:"none", borderRadius:12, padding:"12px 20px", cursor:"pointer", fontWeight:700, fontSize:14, whiteSpace:"nowrap" }}>Subscribe</button>
          </div>
        </div>

        {/* Admin Panel Access Banner */}
        <div style={{ background:"linear-gradient(135deg,#1e293b,#0f172a)", borderRadius:24, padding:"36px 44px", marginBottom:34, display:"flex", alignItems:"center", justifyContent:"space-between", position:"relative", overflow:"hidden", boxShadow:"0 20px 40px rgba(0,0,0,0.15)", border:"1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ position:"absolute", top:-60, right:-60, width:240, height:240, background:"radial-gradient(circle, rgba(79, 142, 247, 0.1) 0%, transparent 70%)", borderRadius:"50%", pointerEvents:"none" }}></div>
            <div style={{ position:"absolute", bottom:-40, left:40, width:180, height:180, background:"radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)", borderRadius:"50%", pointerEvents:"none" }}></div>
            
            <div style={{ position:"relative", zIndex:2, maxWidth:600 }}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                    <div style={{ background:"rgba(255,255,255,0.08)", padding:"10px", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <Settings size={22} color="#4F8EF7" />
                    </div>
                    <div style={{ display:"flex", flexDirection:"column" }}>
                        <span style={{ color:"#4F8EF7", fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase" }}>Administrator</span>
                        <h2 style={{ color:"#fff", fontSize:26, fontWeight:800, margin:0, lineHeight:1.2 }}>Store Management Dashboard</h2>
                    </div>
                </div>
                <p style={{ color:"#94a3b8", fontSize:14, margin:0, lineHeight:1.6 }}>
                    Access the backend to manage inventory, track orders, update categories, and configure store settings. 
                    <span style={{ color:"rgba(255,255,255,0.4)", marginLeft:6 }}>Authorized personnel only.</span>
                </p>
            </div>
            
            <button 
                onClick={()=>navigate('/admin')} 
                style={{ 
                    position:"relative", zIndex:2, 
                    background:"linear-gradient(135deg,#4F8EF7,#2563EB)", 
                    color:"#fff", border:"none", borderRadius:14, 
                    padding:"16px 32px", cursor:"pointer", 
                    fontWeight:700, fontSize:14, 
                    display:"flex", alignItems:"center", gap:10, 
                    boxShadow:"0 8px 24px rgba(37, 99, 235, 0.25)", 
                    transition:"all 0.2s ease" 
                }}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 12px 30px rgba(37, 99, 235, 0.35)";}} 
                onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 8px 24px rgba(37, 99, 235, 0.25)";}}
            >
                Enter Admin Panel <ArrowRight size={18} />
            </button>
        </div>
      </div>

      {/* Footer */}
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
                  <div key={link} style={{ fontSize:12, color:"rgba(255,255,255,0.38)", marginBottom:9, cursor:"pointer", transition:"color 0.2s" }}
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
                <span key={l} style={{ fontSize:11, color:"rgba(255,255,255,0.28)", cursor:"pointer" }}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}