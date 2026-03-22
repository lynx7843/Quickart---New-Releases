import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "./pages/CartContext";
import { ShoppingCart, Search, Globe, ChevronDown, Star, Heart, Zap, Shield, Truck, RefreshCw, ChevronLeft, ChevronRight, Plus, Trash2, Edit, BarChart2, Package, Users, CreditCard, Settings, LogOut, Bell, Tag, Home, Grid, Camera, Watch, Headphones, Shirt, Dumbbell, BookOpen, Gem, Car, Monitor, Cpu, Tv, Download, ArrowRight, TrendingUp, Award, Filter, MoreVertical, X, ShieldCheck, RotateCcw, Trophy } from "lucide-react";
import { categoriesData } from "./assets/all.jsx";

const HERO_SLIDES = [
  { 
    title: "Virtual",
    highlight: "Fitone Room",
    sub: "AI-powered virtual fitting room experience",
    bg: "linear-gradient(135deg,#200122,#6f0000,#200122)",
    accent: "#557a8c",
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
    path: "/virtual-fitting-room"
  },
  { 
    title: "3D Product",
    highlight: "Viewer",
    sub: "Explore every angle with immersive 3D technology",
    bg: "linear-gradient(135deg,#0d2137,#1a4a6e,#0d2137)",
    accent: "#557a8c",
    img: "https://images.unsplash.com/photo-1616469829941-c7200edec809?q=80&w=1000&auto=format&fit=crop",
    path: "/quickart3d"
  },
  { 
    title: "Smart",
    highlight: "AI Assistant",
    sub: "Personalized shopping powered by AI",
    bg: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
    accent: "#557a8c",
    img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop",
    path: "/quick-art-ai"
  },
];

const BRANDS = [
  "NEXUS AI",
  "AURA",
  "QuantumLeap",
  "Stellar",
  "Nova",
  "Orion",
  "CyberCore",
  "Zenith",
];

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

export default function QuickArt({ products, setProducts, cats, setCats }) {
  const location = useLocation();
  const navigate = useNavigate(); 
  const { cart, addToCart, cartTotal, cartCount, isCartOpen, closeCart, removeItem } = useCart();
  const [slide, setSlide] = useState(0);
  const [tab, setTab] = useState("ai");
  const [wish, setWish] = useState([]);
  const [pSlide, setPSlide] = useState(0);
  const [cd, setCd] = useState({ h:5, m:32, s:17 });
  const [notif, setNotif] = useState(null);
  const [email, setEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const results = [];

    categoriesData.forEach(cat => {
      if (cat.name.toLowerCase().includes(lowerQuery)) {
        results.push({ ...cat, type: 'Category' });
      }
      cat.subCategories.forEach(sub => {
        if (sub.name.toLowerCase().includes(lowerQuery)) {
          results.push({ ...sub, type: 'SubCategory', parentName: cat.name });
        }
      });
    });
    setSearchResults(results.slice(0, 10));
  };

  // Fetch data from the backend when the component mounts
  useEffect(() => {
    // Using static data to ensure products with images are displayed
    // fetchInitialData();
  }, []);

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
    addToCart(p);
    notify(`✅ ${p.name} added to cart!`);
  };

  const toggleWish = id => setWish(prev => prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);

  const hs = HERO_SLIDES[slide];
  const pad = n => String(n).padStart(2,"0");
  const visProds = products.slice(pSlide, pSlide+3);

  return (
    <div style={{ fontFamily:"'Sora','Segoe UI',sans-serif", minHeight:"100vh", background:"#F4F6FA", overflowX:"hidden", position: "relative" }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800;900&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:#f4f6fa; }
        ::-webkit-scrollbar-thumb { background:#557a8c; border-radius:3px; }
      `}</style>

      {/* Notification */}
      {notif && (
        <div style={{ position:"fixed", top:80, right:20, background:"#1a1a1a", color:"#fff", padding:"12px 20px", borderRadius:12, zIndex:9999, fontSize:13, fontWeight:600, boxShadow:"0 8px 30px rgba(0,0,0,0.25)", animation:"fadeIn 0.3s ease" }}>
          {notif}
        </div>
      )}



      {/* Cart Dropdown */}
      {isCartOpen && (
        <div style={{ position:"fixed", top:80, right:20, background:"#fff", borderRadius:20, boxShadow:"0 20px 60px rgba(0,0,0,0.14)", width:340, zIndex:400, overflow:"hidden", animation:"fadeIn 0.2s ease" }}>
          <div style={{ padding:"16px 18px", borderBottom:"1px solid #F0F0F0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontWeight:800, fontSize:15 }}>My Cart ({cartCount})</span>
            <button onClick={closeCart} style={{ background:"none", border:"none", cursor:"pointer" }}><X size={16}/></button>
          </div>
          <div style={{ maxHeight:300, overflowY:"auto", padding:"8px 18px" }}>
            {cart.length===0?(
              <div style={{ textAlign:"center", padding:"32px 0", color:"#ccc" }}>
                <div style={{ fontSize:40, marginBottom:8 }}>⚪</div>
                <div style={{ fontSize:13, color:"#557a8c" }}>Your cart is empty</div>
              </div>
            ):cart.map(item=>(
              <div key={item.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 0", borderBottom:"1px solid #F5F5F5" }}>
                <div style={{ fontSize:26, background:"#F8F9FC", borderRadius:10, width:42, height:42, display:"flex", alignItems:"center", justifyContent:"center" }}>{item.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:600 }}>{item.name}</div>
                  <div style={{ fontSize:11, color:"#557a8c" }}>×{item.qty}</div>
                </div>
                <div style={{ fontSize:13, fontWeight:700, color:"#111111" }}>LKR {(item.price*item.qty).toLocaleString()}</div>
                <button onClick={() => removeItem(item.id)} style={{ background:"none", border:"none", cursor:"pointer", color:"#aaa", marginLeft:8 }}><Trash2 size={14}/></button>
              </div>
            ))}
          </div>
          {cart.length>0 && (
            <div style={{ padding:18, borderTop:"1px solid #F0F0F0" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                <span style={{ fontWeight:700 }}>Total</span>
                <span style={{ fontWeight:800, color:"#111111", fontSize:16 }}>LKR {cartTotal.toLocaleString()}</span>
              </div>
              <button onClick={() => { navigate('/cart'); closeCart(); }} style={{ width:"100%", background:"#557a8c", color:"#fff", border:"none", borderRadius:12, padding:"12px", cursor:"pointer", fontWeight:700, fontSize:14 }}>
                Checkout →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Hero Banner */}
      <section style={{ position: "relative", minHeight: "600px", background: "#111111", color: "#fff", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {/* Background Gradients */}
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 70% 50%, ${hs.accent}26, transparent 50%)` }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 30%, rgba(30,58,138,0.2), transparent 50%)" }} />

        <button onClick={()=>setSlide(s=>(s-1+HERO_SLIDES.length)%HERO_SLIDES.length)} style={{ position:"absolute", left:32, top:"50%", transform:"translateY(-50%)", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"50%", width:48, height:48, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(4px)", zIndex: 20, color: "#cbd5e1", transition: "background 0.2s" }} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.1)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.05)"}>
          <ChevronLeft size={24} />
        </button>
        <button onClick={()=>setSlide(s=>(s+1)%HERO_SLIDES.length)} style={{ position:"absolute", right:32, top:"50%", transform:"translateY(-50%)", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"50%", width:48, height:48, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(4px)", zIndex: 20, color: "#cbd5e1", transition: "background 0.2s" }} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.1)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.05)"}>
          <ChevronRight size={24} />
        </button>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", width: "100%", position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
          {/* Left Content */}
          <div style={{ maxWidth: 600, padding: "40px 0" }}>
            {/* Badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 999, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", marginBottom: 32, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
              <Zap size={16} fill={hs.accent} color={hs.accent} />
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, color: hs.accent, textTransform: "uppercase" }}>Quickart Platform</span>
            </div>

            {/* Heading */}
            <h1 style={{ fontSize: "clamp(3rem, 5vw, 4.5rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: 24, fontFamily: "'Sora', sans-serif", letterSpacing: "-0.02em" }}>
              {hs.title} <br />
              <span style={{ color: "#ffffff" }}>
                {hs.highlight}
              </span>
            </h1>

            {/* Subheading */}
            <p style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.6, marginBottom: 40, maxWidth: 480 }}>
              {hs.sub}
            </p>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 16, marginBottom: 64, flexWrap: "wrap" }}>
              <button onClick={() => hs.path && navigate(hs.path)} style={{ padding: "14px 32px", borderRadius: 999, background: hs.accent, color: "#0f172a", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: `0 0 20px ${hs.accent}66`, transition: "transform 0.2s" }} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
                Explore Now <ArrowRight size={18} />
              </button>
              <button onClick={() => navigate('/quickart3d')} style={{ padding: "14px 32px", borderRadius: 999, background: "rgba(255,255,255,0.1)", color: "#fff", fontWeight: 600, fontSize: 15, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", backdropFilter: "blur(10px)" }}>
                View Demo
              </button>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", alignItems: "center", gap: 48 }}>
              {[["50K+", "Products"], ["1M+", "Customers"], ["200+", "Brands"]].map(([val, label], i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>{val}</span>
                  <span style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content */}
          <div style={{ flex: 1, display: "flex", justifyContent: "center", position: "relative", minHeight: 400, alignItems: "center" }}>
            {/* Glow */}
            <div style={{ position: "absolute", width: 300, height: 300, background: `${hs.accent}33`, borderRadius: "50%", filter: "blur(80px)", zIndex: 0 }} />
            
            {/* Image/Emoji */}
            <div style={{ position: "relative", zIndex: 1, animation: "float 6s ease-in-out infinite" }}>
              {hs.img ? (
                <img src={hs.img} alt={hs.title} style={{ width: "100%", maxWidth: 450, borderRadius: 30, transform: "rotate(-10deg)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)", transition: "all 0.5s" }} />
              ) : (
                <div style={{ fontSize: 180, filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.5))", transform: "rotate(-10deg)" }}>{hs.emoji}</div>
              )}
              
              {/* Floating UI Card */}
              <div style={{ position: "absolute", bottom: -30, left: "50%", transform: "translateX(-50%)", background: "rgba(11, 17, 33, 0.8)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.1)", padding: "10px 20px", borderRadius: 999, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 10px 30px rgba(0,0,0,0.3)", whiteSpace: "nowrap" }}>
                <RotateCcw size={16} color={hs.accent} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>Drag to rotate 360°</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 12, zIndex: 20 }}>
          {HERO_SLIDES.map((_,i)=>(
            <button key={i} onClick={()=>setSlide(i)} style={{ width:i===slide?32:8, height:8, borderRadius:4, background:i===slide?hs.accent:"rgba(255,255,255,0.2)", border:"none", cursor:"pointer", transition:"all 0.3s" }}/>
          ))}
        </div>
      </section>

      {/* Bottom Features Banner */}
      <div style={{ background: "#1a1a1a", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "24px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
          {[
            { icon: Truck, color: "#f4f6fa", title: "Free Delivery", sub: "Over LKR 5,000" },
            { icon: ShieldCheck, color: "#f4f6fa", title: "Secure Payment", sub: "100% Protected" },
            { icon: RotateCcw, color: "#f4f6fa", title: "Easy Returns", sub: "30 Day Policy" },
            { icon: Headphones, color: "#f4f6fa", title: "24/7 Support", sub: "Always Here" },
            { icon: Trophy, color: "#f4f6fa", title: "Top Quality", sub: "Verified Products" },
          ].map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "center" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: `${f.color}1a`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <f.icon size={24} color={f.color} />
              </div>
              <div>
                <h4 style={{ color: "#fff", fontSize: 14, fontWeight: 700, margin: 0 }}>{f.title}</h4>
                <p style={{ color: "#64748b", fontSize: 12, margin: "4px 0 0" }}>{f.sub}</p>
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
                else if (id === 'vr') navigate('/virtual-fitting-room');
                else setTab(id);
              }} style={{ padding:"9px 16px", border:"none", borderBottom: tab===id?"3px solid #557a8c":"3px solid transparent", background:"none", cursor:"pointer", fontWeight:700, fontSize:12, color: tab===id?"#557a8c":"#557a8c", marginBottom:-2, transition:"all 0.2s" }}>{l}</button>
            ))}
          </div>
          {tab==="ai" && (
            <div>
              <p style={{ color:"#557a8c", fontSize:14, marginBottom:18 }}>AI-powered search — describe any product naturally or upload an image.</p>
              <div style={{ display:"flex", gap:14, marginBottom: 24 }}>
                <div style={{ flex:1, background:"#F4F6FA", borderRadius:18, padding:"18px 24px", display:"flex", alignItems:"center", gap:14, border:"2px solid transparent", transition:"border 0.2s", position: "relative" }}>
                  <Search size={22} color="#aaa"/>
                  <input 
                    value={searchQuery} 
                    onChange={handleSearch} 
                    placeholder="Search products, categories, or brands..." 
                    style={{ flex:1, border:"none", background:"none", outline:"none", fontSize:17, color:"#333" }}
                  />
                  {searchResults.length > 0 && (
                    <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", borderRadius: 16, marginTop: 8, boxShadow: "0 10px 40px rgba(0,0,0,0.1)", zIndex: 100, maxHeight: 300, overflowY: "auto", padding: 8 }}>
                      {searchResults.map((item, idx) => (
                        <div key={idx} onClick={() => navigate('/all-categories')} style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", borderRadius: 10, transition: "background 0.1s" }} onMouseEnter={e => e.currentTarget.style.background = "#f8f9fa"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          {item.image ? (
                            <img src={item.image} alt={item.name} style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover" }} />
                          ) : (
                            <div style={{ width: 36, height: 36, borderRadius: 8, background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                              {item.icon || "📂"}
                            </div>
                          )}
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: "#333" }}>{item.name}</div>
                            <div style={{ fontSize: 11, color: "#557a8c" }}>{item.type} {item.parentName ? `in ${item.parentName}` : ""}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button style={{ background:"#F4F6FA", border:"1px solid #eee", borderRadius:18, padding:"18px 28px", cursor:"pointer", display:"flex", alignItems:"center", gap:10, fontSize:15, fontWeight:600, color:"#555" }}>
                  <Camera size={20}/> Image Search
                </button>
                <button style={{ background:"#557a8c", color:"#fff", border:"none", borderRadius:18, padding:"18px 36px", cursor:"pointer", fontWeight:700, fontSize:17 }}>🔍 Search</button>
              </div>
              <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 6 }}>
                {[{l:"Product Photos",e:"📸"},{l:"Model Shots",e:"👥"},{l:"Videos",e:"🎥"},{l:"Size Charts",e:"📐"},{l:"Lifestyle",e:"✨"}].map(({l,e})=>(
                   <button key={l} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 20px", background: "#fff", border: "1px solid #eee", borderRadius: 14, cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#444", whiteSpace: "nowrap", transition: "all 0.2s" }} onMouseEnter={e=>e.currentTarget.style.borderColor="#557a8c"} onMouseLeave={e=>e.currentTarget.style.borderColor="#eee"}>
                     <span>{e}</span> {l}
                   </button>
                ))}
              </div>
            </div>
          )}
          {tab==="3d" && (
            <div style={{ background:"linear-gradient(135deg,#0d2137,#1a4a6e)", borderRadius:16, padding:30, textAlign:"center" }}>
              <div style={{ fontSize:56, marginBottom:14, animation:"float 3s ease-in-out infinite" }}>🔮</div>
              <h3 style={{ color:"#fff", fontWeight:800, fontSize:18, margin:"0 0 8px" }}>3D Product Viewer</h3>
              <p style={{ color:"rgba(255,255,255,0.55)", fontSize:13, marginBottom:18 }}>Explore products from every angle with immersive 3D technology. Zoom, rotate, and inspect before buying.</p>
              <button onClick={() => navigate('/quickart3d')} style={{ background:"#557a8c", color:"#fff", border:"none", borderRadius:12, padding:"11px 22px", cursor:"pointer", fontWeight:700, fontSize:14 }}>Launch 3D Viewer →</button>
            </div>
          )}
          {tab==="vr" && (
            <div style={{ background:"linear-gradient(135deg,#200122,#6f0000)", borderRadius:16, padding:30, textAlign:"center" }}>
              <div style={{ fontSize:56, marginBottom:14, animation:"float 3s ease-in-out infinite" }}>👗</div>
              <h3 style={{ color:"#fff", fontWeight:800, fontSize:18, margin:"0 0 8px" }}>Virtual Fitone Room</h3>
              <p style={{ color:"rgba(255,255,255,0.55)", fontSize:13, marginBottom:18 }}>Try on clothes and accessories virtually using our AI-powered fitting room technology.</p>
              <button style={{ background:"#557a8c", color:"#fff", border:"none", borderRadius:12, padding:"11px 22px", cursor:"pointer", fontWeight:700, fontSize:14 }}>Enter Fitting Room →</button>
            </div>
          )}
          {tab==="ar" && (
            <div style={{ background:"linear-gradient(135deg,#0f0c29,#302b63)", borderRadius:16, padding:30, textAlign:"center" }}>
              <div style={{ fontSize:56, marginBottom:14, animation:"float 3s ease-in-out infinite" }}>🥽</div>
              <h3 style={{ color:"#fff", fontWeight:800, fontSize:18, margin:"0 0 8px" }}>AR Try-On Technology</h3>
              <p style={{ color:"rgba(255,255,255,0.55)", fontSize:13, marginBottom:18 }}>Place furniture in your room, try glasses, watches — all in augmented reality before you buy.</p>
              <button onClick={() => navigate('/ar-viewer')} style={{ background:"#557a8c", color:"#fff", border:"none", borderRadius:12, padding:"11px 22px", cursor:"pointer", fontWeight:700, fontSize:14 }}>Start AR Experience →</button>
            </div>
          )}
        </div>

        {/* Flash Sale */}
        <div style={{ background:"linear-gradient(135deg,#111111,#222222)", borderRadius:20, padding:"18px 26px", marginBottom:26, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
            <div style={{ background:"#557a8c", borderRadius:12, padding:"7px 14px", display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ fontSize:14 }}>⚡</span>
              <span style={{ color:"#fff", fontWeight:800, fontSize:13 }}>FLASH SALE</span>
            </div>
            <span style={{ color:"rgba(255,255,255,0.7)", fontSize:13 }}>Ends in</span>
            <div style={{ display:"flex", gap:6 }}>
              {[[pad(cd.h),"HRS"],[pad(cd.m),"MIN"],[pad(cd.s),"SEC"]].map(([n,l])=>(
                <div key={l} style={{ background:"rgba(255,255,255,0.1)", borderRadius:10, padding:"7px 10px", textAlign:"center", minWidth:48 }}>
                  <div style={{ color:"#fff", fontSize:17, fontWeight:800, lineHeight:1 }}>{n}</div>
                  <div style={{ color:"rgba(255,255,255,0.7)", fontSize:8, letterSpacing:1 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => navigate('/all-categories')} style={{ background:"#fff", color:"#557a8c", border:"none", borderRadius:12, padding:"11px 20px", cursor:"pointer", fontWeight:700, fontSize:13 }}>View All Deals →</button>
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
              <button onClick={() => navigate('/all-categories')} style={{ background:"none", border:"1px solid #557a8c", color:"#557a8c", borderRadius:20, padding:"6px 16px", cursor:"pointer", fontSize:12, fontWeight:600 }}>View All →</button>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
            {visProds.map(p=><ProductCard key={p.id} product={p} onAdd={addCart} onWish={toggleWish} wished={wish.includes(p.id)}/>)}
          </div>
        </div>

        {/* Ad Banners */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:34 }}>
          {[
            { emoji:"💻", label:"EXCLUSIVE OFFER", title:"Gaming Laptops\nUp to 40% Off", btn:"Shop Electronics →", bg:"linear-gradient(135deg,#111111,#222222)", btnColor:"#557a8c", path: "/all-categories" },
            { emoji:"👗", label:"NEW ARRIVALS", title:"Fashion Collection\nSpring 2026", btn:"Explore Fashion →", bg:"linear-gradient(135deg,#4a6878,#557a8c)", btnColor:"#557a8c", path: "/all-categories" },
            { emoji:"🎧", label:"LIMITED EDITION", title:"Premium Audio\nStudio Quality", btn:"Shop Audio →", bg:"linear-gradient(135deg,#020617,#1e293b)", btnColor:"#557a8c", path: "/all-categories" },
            { emoji:"👟", label:"TRENDING NOW", title:"Sports Gear\nPro Performance", btn:"Shop Sports →", bg:"linear-gradient(135deg,#111827,#334155)", btnColor:"#557a8c", path: "/all-categories" },
          ].map((ad,i)=>(
            <div key={i} style={{ background:ad.bg, borderRadius:20, padding:"26px 24px", display:"flex", alignItems:"center", gap:20, overflow:"hidden" }}>
              <div style={{ fontSize:54 }}>{ad.emoji}</div>
              <div>
                <div style={{ color:"rgba(255,255,255,0.55)", fontSize:10, fontWeight:700, letterSpacing:2, marginBottom:6, textTransform:"uppercase" }}>{ad.label}</div>
                <div style={{ color:"#fff", fontSize:18, fontWeight:800, marginBottom:12, whiteSpace:"pre-line" }}>{ad.title}</div>
                <button onClick={() => navigate(ad.path)} style={{ background:"#fff", color:ad.btnColor, border:"none", borderRadius:10, padding:"8px 16px", cursor:"pointer", fontWeight:700, fontSize:12, backgroundClip: "text" }}>{ad.btn}</button>
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
            <button onClick={() => navigate('/all-categories')} style={{ background:"none", border:"1px solid #557a8c", color:"#557a8c", borderRadius:20, padding:"6px 16px", cursor:"pointer", fontSize:12, fontWeight:600 }}>All →</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:12 }}>
            {cats.map((c,i)=>(
              <div key={i} style={{ background:"#fff", borderRadius:16, padding:"18px 10px", textAlign:"center", cursor:"pointer", boxShadow:"0 2px 8px rgba(0,0,0,0.05)", transition:"all 0.2s" }}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 12px 30px ${c.color}30`;}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.05)";}}>
                <div style={{ width:50, height:50, background:`${c.color}14`, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 10px", fontSize:24 }}>{c.icon}</div>
                <div style={{ fontSize:11, fontWeight:700, color:"#1a1a1a" }}>{c.name || c.label}</div>
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
              <button onClick={() => navigate('/all-categories')} style={{ background:"none", border:"1px solid #557a8c", color:"#557a8c", borderRadius:20, padding:"6px 16px", cursor:"pointer", fontSize:12, fontWeight:600 }}>View All →</button>
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
                onMouseEnter={e=>{e.currentTarget.style.borderColor="#557a8c";e.currentTarget.style.color="#557a8c";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="transparent";e.currentTarget.style.color="#444";}}>
                {b}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile App Banner */}
        <div style={{ background:"linear-gradient(135deg,#111111,#222222)", borderRadius:24, padding:"38px 44px", marginBottom:34, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:24, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", right:0, top:0, width:400, height:"100%", background:"radial-gradient(ellipse at right,rgba(85, 122, 140, 0.15),transparent)" }}/>
          <div style={{ position:"relative", zIndex:2 }}>
            <div style={{ color:"#f4f6fa", fontSize:11, fontWeight:700, letterSpacing:2, marginBottom:10, textTransform:"uppercase" }}>📱 Mobile App Available</div>
            <h2 style={{ color:"#fff", fontSize:28, fontWeight:900, margin:"0 0 10px" }}>Shop Smarter with<br/><span style={{ color:"#fff" }}>QuickArt App</span></h2>
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
          <img src="https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=400&q=80" alt="Mobile App" style={{ width: 200, borderRadius: 20, transform: "rotate(-10deg)", boxShadow: "0 20px 40px rgba(0,0,0,0.4)", position: "relative", zIndex: 2 }} />
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
        <div style={{ background:"#111111", borderRadius:20, padding:"32px 40px", marginBottom:34, textAlign:"center" }}>
          <h2 style={{ color:"#fff", fontSize:24, fontWeight:800, margin:"0 0 8px" }}>Stay in the Loop 📬</h2>
          <p style={{ color:"rgba(255,255,255,0.8)", fontSize:14, margin:"0 0 20px" }}>Get exclusive deals, new arrivals, and tech news delivered to your inbox.</p>
          <div style={{ display:"flex", gap:10, maxWidth:420, margin:"0 auto" }}>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Enter your email address..." style={{ flex:1, padding:"12px 16px", borderRadius:12, border:"none", outline:"none", fontSize:14 }}/>
            <button onClick={()=>{if(email){notify("✅ Subscribed successfully!");setEmail("");}}} style={{ background:"#1a1a1a", color:"#fff", border:"none", borderRadius:12, padding:"12px 20px", cursor:"pointer", fontWeight:700, fontSize:14, whiteSpace:"nowrap" }}>Subscribe</button>
          </div>
        </div>

      </div>


    </div>
  );
}