import { useState, useEffect, useRef } from "react";

/* ─── GLOBAL STYLES ─────────────────────────────────────────────────────── */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:'DM Sans',sans-serif;background:#F7F4EF;color:#1a1a1a;}
    button,input,select{font-family:'DM Sans',sans-serif;cursor:pointer;}
    ::-webkit-scrollbar{width:5px;height:5px;}
    ::-webkit-scrollbar-track{background:#ede8e0;}
    ::-webkit-scrollbar-thumb{background:#FF6B00;border-radius:4px;}

    @keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
    @keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
    @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}

    .prod-card{background:#fff;border-radius:20px;overflow:hidden;border:1px solid rgba(0,0,0,0.06);transition:transform 0.3s cubic-bezier(.34,1.56,.64,1),box-shadow 0.3s ease;display:flex;flex-direction:column;}
    .prod-card:hover{transform:translateY(-6px);box-shadow:0 24px 56px rgba(255,107,0,0.14),0 4px 16px rgba(0,0,0,0.06) !important;}
    .btn-primary{background:#FF6B00;color:#fff;border:none;border-radius:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.2s;}
    .btn-primary:hover{background:#e05a00;box-shadow:0 8px 28px rgba(255,107,0,0.35);transform:translateY(-1px);}

    .viewer-area{cursor:grab;user-select:none;}
    .viewer-area.dragging{cursor:grabbing;}

    @media(max-width:900px){
      .detail-grid{grid-template-columns:1fr !important;}
      .prod-grid{grid-template-columns:repeat(2,1fr) !important;}
    }
  `}</style>
);

const C = {
  orange:"#FF6B00",orangeL:"#FF9340",orangeD:"#E05A00",orangeBg:"rgba(255,107,0,0.07)",
  bg:"#F7F4EF",bgCard:"#FFFFFF",bgSoft:"#F2EDE6",
  border:"rgba(0,0,0,0.07)",
  text:"#1A1A1A",textSub:"#6B6B6B",textMut:"#B0A898",
  green:"#0F9B6A",red:"#E53E3E",
};

/* ══════════════════════════════════════════════════════════════
   REAL 360° VIEWER
   - 4 product images preloaded
   - Drag left/right → cycles through frames
   - CSS perspective rotateY tilt follows drag (looks 3D)
   - Inertia on release → gentle auto-rotate
   - Scroll to zoom
   - Clean white/cream background
══════════════════════════════════════════════════════════════ */
function Viewer360({ product, size = "small" }) {
  const wrapRef  = useRef(null);
  const imgRef   = useRef(null);
  const fadeRef  = useRef(null);

  // Mutable state in ref to avoid re-renders
  const S = useRef({
    deg:     0,       // cumulative rotation degrees
    vel:     0.22,    // current velocity (auto-rotate when idle)
    dragging: false,
    lastX:   0,
    tilt:    0,       // current CSS tilt
    tiltTarget: 0,
    zoom:    1,
    frameIdx: 0,
    rafId:   null,
    imgs:    [],      // Image objects,
  });

  const images = product.imgs || (product.image ? [product.image] : ['https://via.placeholder.com/600x300?text=No+Image']);
  const FRAMES   = images.length;
  const DEG_PER  = 360 / FRAMES;        // 90° per frame

  /* Preload images */
  useEffect(() => {
    if (!product) return;
    S.current.deg = 0;
    S.current.tilt = 0;
    S.current.tiltTarget = 0;
    S.current.frameIdx = 0;
    S.current.zoom = 1;
    S.current.imgs = images.map((src, i) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      return img;
    });

    // Set first image immediately
    if (imgRef.current)  imgRef.current.src  = images[0];
    if (fadeRef.current) fadeRef.current.src = images[0];
  }, [product?.id, images]);

  /* Animation loop */
  useEffect(() => {
    const wrap = wrapRef.current;
    const imgEl  = imgRef.current;
    const fadeEl = fadeRef.current;
    if (!wrap || !imgEl || !fadeEl) return;
    const s = S.current;
    let prevFrame = 0;

    const loop = () => {
      // Auto-rotate when not dragging
      if (!s.dragging) {
        s.deg += s.vel;
        s.vel += (0.22 - s.vel) * 0.015; // drift back to default speed
        s.tiltTarget *= 0.85;
      }
      // Smooth tilt
      s.tilt += (s.tiltTarget - s.tilt) * 0.1;

      // Compute frame
      const normalDeg = ((s.deg % 360) + 360) % 360;
      const frame = Math.floor(normalDeg / DEG_PER) % FRAMES;

      if (frame !== prevFrame) {
        const incoming = images[frame];
        // Crossfade: put current on fadeEl (fades out), new on imgEl
        fadeEl.src = imgEl.src;
        fadeEl.style.opacity = "1";
        imgEl.src = incoming;
        imgEl.style.opacity = "1";

        // Fade out the back layer
        requestAnimationFrame(() => {
          fadeEl.style.transition = "opacity 0.15s ease";
          fadeEl.style.opacity = "0";
        });

        prevFrame = frame;
        s.frameIdx = frame;
      }

      // Apply perspective tilt — real 3D depth feel
      const clampedTilt = Math.max(-28, Math.min(28, s.tilt));
      const scaleVal = s.zoom;
      const transform = `perspective(1000px) rotateY(${clampedTilt}deg) scale(${scaleVal})`;
      imgEl.style.transform  = transform;
      fadeEl.style.transform = transform;

      // Update dots
      if (wrap._dots) {
        wrap._dots.forEach((d, i) => {
          if (i === frame) {
            d.style.background = "#FF6B00";
            d.style.width = "14px";
            d.style.borderRadius = "4px";
          } else {
            d.style.background = "rgba(255,107,0,0.25)";
            d.style.width = "6px";
            d.style.borderRadius = "50%";
          }
        });
      }

      s.rafId = requestAnimationFrame(loop);
    };
    s.rafId = requestAnimationFrame(loop);

    // Collect dot elements
    wrap._dots = Array.from(wrap.querySelectorAll(".vdot"));

    /* ── INPUT EVENTS ── */
    const getX = e => e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;

    const onDown = e => {
      s.dragging = true;
      s.lastX = getX(e);
      wrap.classList.add("dragging");
    };
    const onMove = e => {
      if (!s.dragging) return;
      const cx = getX(e);
      const dx = cx - s.lastX;
      s.lastX = cx;
      s.deg += dx * (size === "large" ? 0.5 : 0.65);
      s.vel = dx * 0.16;
      s.tiltTarget = dx * 1.6;
    };
    const onUp = () => {
      s.dragging = false;
      s.tiltTarget = 0;
      wrap.classList.remove("dragging");
    };
    const onWheel = e => {
      e.preventDefault();
      s.zoom = Math.max(1, Math.min(2.6, s.zoom - e.deltaY * 0.0008));
    };

    wrap.addEventListener("mousedown", onDown);
    wrap.addEventListener("touchstart", onDown, { passive:true });
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive:true });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    wrap.addEventListener("wheel", onWheel, { passive:false });

    return () => {
      cancelAnimationFrame(s.rafId);
      wrap.removeEventListener("mousedown", onDown);
      wrap.removeEventListener("touchstart", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove, { passive:true });
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
      wrap.removeEventListener("wheel", onWheel);
    };
  }, [product.id, size]);

  const large = size === "large";

  return (
    <div
      ref={wrapRef}
      className="viewer-area"
      style={{
        width:"100%", height:"100%",
        position:"relative", overflow:"hidden",
        background:"radial-gradient(ellipse at 50% 38%, #fff9f4 0%, #f5ede2 55%, #ece3d8 100%)",
      }}
    >
      {/* Back image (fading out) */}
      <img
        ref={fadeRef}
        alt={product.name || ''}
        src={images[0]}
        style={{
          position:"absolute", inset:0,
          width:"100%", height:"100%",
          objectFit:"contain",
          padding: large ? "20px 24px 32px" : "14px 14px 28px",
          pointerEvents:"none",
          willChange:"transform,opacity",
          opacity:0,
          transition:"opacity 0.15s ease",
          transformOrigin:"center center",
        }}
      />
      {/* Front image (current frame) */}
      <img
        ref={imgRef}
        alt={product.name}
        src={images[0]}
        style={{
          position:"absolute", inset:0,
          width:"100%", height:"100%",
          objectFit:"contain",
          padding: large ? "20px 24px 32px" : "14px 14px 28px",
          pointerEvents:"none",
          willChange:"transform,opacity",
          opacity:1,
          transformOrigin:"center center",
          filter:"drop-shadow(0 12px 28px rgba(0,0,0,0.13))",
        }}
      />

      {/* Subtle floor shadow */}
      <div style={{ position:"absolute", bottom:0, left:"15%", right:"15%", height:"8%", background:"radial-gradient(ellipse at center, rgba(0,0,0,0.09) 0%, transparent 70%)", pointerEvents:"none" }} />

      {/* 360 badge */}
      <div style={{ position:"absolute", top:10, right:10, background:"rgba(255,107,0,0.88)", backdropFilter:"blur(6px)", color:"#fff", fontSize:9, fontWeight:800, padding:"4px 10px", borderRadius:20, letterSpacing:1.2, display:"flex", alignItems:"center", gap:4, pointerEvents:"none", boxShadow:"0 2px 10px rgba(255,107,0,0.28)" }}>
        <span style={{ display:"inline-block", animation:"spin 2.5s linear infinite" }}>↻</span>
        360°
      </div>

      {/* Frame dots */}
      <div style={{ position:"absolute", bottom:8, left:"50%", transform:"translateX(-50%)", display:"flex", gap:5, alignItems:"center", pointerEvents:"none" }}>
        {images.map((_, i) => (
          <div key={i} className="vdot" style={{ width:i===0?14:6, height:6, borderRadius:i===0?4:"50%", background:i===0?"#FF6B00":"rgba(255,107,0,0.25)", transition:"all 0.2s ease" }} />
        ))}
      </div>

      {/* Hint text */}
      <div style={{ position:"absolute", bottom:22, left:"50%", transform:"translateX(-50%)", fontSize:9, color:"rgba(120,90,60,0.5)", fontWeight:600, letterSpacing:0.8, pointerEvents:"none", whiteSpace:"nowrap" }}>
        ← drag to rotate →
      </div>
    </div>
  );
}

/* ─── ATOMS ─────────────────────────────────────────────────── */
const Stars = ({ r }) => (
  <span>{"★★★★★".split("").map((s,i) => (
    <span key={i} style={{ color:i < Math.round(r) ? "#FF6B00" : "#E0D8CE", fontSize:12 }}>{s}</span>
  ))}</span>
);
const BADGES = { NEW:"#2563EB", HOT:"#FF6B00", SALE:"#E53E3E", BEST:"#0F9B6A", PRO:"#9333EA", LTD:"#CA8A04" };
const Badge = ({ lbl }) => (
  <span style={{ background:BADGES[lbl]||"#FF6B00", color:"#fff", fontSize:9, fontWeight:800, padding:"3px 9px", borderRadius:5, letterSpacing:1.5, boxShadow:`0 3px 12px ${BADGES[lbl]||"#FF6B00"}44` }}>{lbl}</span>
);
const disc = p => p.orig ? Math.round((1 - p.price / p.orig) * 100) : 0;

/* ══════════════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════════════ */
export default function QuickArt3D({ products, categories }) {
  const [activeCat, setActiveCat] = useState(null);
  const [activeSub, setActiveSub] = useState(null);
  const [selProd,   setSelProd]   = useState(null);
  const [view,      setView]      = useState("shop");
  const [cart,      setCart]      = useState([]);
  const [wishlist,  setWishlist]  = useState([]);
  const [search,    setSearch]    = useState("");
  const [qty,       setQty]       = useState(1);
  const [selColor,  setSelColor]  = useState(null);
  const [payMethod, setPayMethod] = useState("upi");
  const [delivery,  setDelivery]  = useState("standard");
  const [location,  setLocation]  = useState(null);
  const [locLoading,setLocLoading]= useState(false);
  const [addr,      setAddr]      = useState({name:"",phone:"",street:"",city:"",pin:"",state:""});
  const [card,      setCard]      = useState({num:"",name:"",exp:"",cvv:""});
  const [upi,       setUpi]       = useState("");
  const [toast,     setToast]     = useState(null);
  const [orderRef,  setOrderRef]  = useState("");

  const showToast = (msg, type="info") => { setToast({msg,type}); setTimeout(()=>setToast(null), 2800); };
  const cartCount  = cart.reduce((s,i) => s+i.qty, 0);
  const cartTotal  = cart.reduce((s,i) => s+i.price*i.qty, 0);
  const delFee     = delivery==="express" ? 299 : delivery==="standard" ? 99 : 0;
  const grandTotal = cartTotal + delFee;

  const filtered = (products || []).filter(p => {
    if (activeSub) return p.sub === activeSub;
    if (activeCat) return p.category === activeCat;
    if (search)    return p.name.toLowerCase().includes(search.toLowerCase()) || p.sub.toLowerCase().includes(search.toLowerCase());
    return true;
  });

  const openProduct = p => { setSelProd(p); setSelColor(p.colors[0]); setQty(1); setView("product"); window.scrollTo(0,0); };
  const addToCart   = () => {
    setCart(prev => { const ex = prev.find(i=>i.id===selProd.id&&i.color===selColor); if(ex) return prev.map(i=>i.id===selProd.id&&i.color===selColor?{...i,qty:i.qty+qty}:i); return [...prev,{...selProd,color:selColor,qty}]; });
    showToast(`✓ ${selProd.name} added to cart`,"success"); setView("shop");
  };
  const placeOrder = () => { const ref="QA"+Date.now().toString(36).toUpperCase().slice(-8); setOrderRef(ref); setCart([]); setView("confirm"); showToast("🎉 Order placed!","success"); };
  const getLocation = () => {
    setLocLoading(true);
    navigator.geolocation?.getCurrentPosition(
      pos => { setLocation({lat:pos.coords.latitude.toFixed(4),lng:pos.coords.longitude.toFixed(4)}); setLocLoading(false); showToast("📍 Location captured!","success"); },
      ()  => { setLocation({lat:"12.9716",lng:"77.5946"}); setLocLoading(false); showToast("📍 Demo location set","info"); }
    )||(setLocation({lat:"12.9716",lng:"77.5946"}),setLocLoading(false));
  };

  const catData = categories.find(c=>c.id===activeCat);

  // Style helpers
  const inp    = { width:"100%", background:"#faf9f7", border:`1px solid ${C.border}`, borderRadius:10, padding:"11px 14px", fontSize:13, outline:"none", marginBottom:10, color:C.text };
  const inpRow = { display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 };
  const bigBtn = { width:"100%", padding:"14px", background:`linear-gradient(135deg,${C.orange},${C.orangeD})`, color:"#fff", border:"none", borderRadius:12, fontSize:14, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, boxShadow:`0 8px 28px rgba(255,107,0,0.28)`, letterSpacing:0.3, transition:"all 0.2s" };
  const methBtn= a => ({ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"13px 16px", background:a?"rgba(255,107,0,0.06)":"#faf9f7", border:`1.5px solid ${a?C.orange:C.border}`, borderRadius:12, cursor:"pointer", marginBottom:8, color:a?C.orange:C.text, fontSize:13, transition:"all 0.2s" });
  const delOpt = a => ({ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:a?"rgba(255,107,0,0.05)":"#faf9f7", border:`1px solid ${a?C.orange:C.border}`, borderRadius:10, cursor:"pointer", marginBottom:8, transition:"all 0.2s" });

  return (
    <div style={{ minHeight:"100vh", background:C.bg }}>
      <GlobalStyle/>

      {/* ── CATEGORY NAV ── */}
      {(view==="shop"||view==="product") && (
        <div style={{ background:"#fff", borderBottom:`1px solid ${C.border}`, position:"sticky", top:0, zIndex:50 }}>
          <div style={{ maxWidth:1440, margin:"0 auto", padding:"0 24px", display:"flex", gap:2, overflowX:"auto", scrollbarWidth:"none" }}>
            <button style={{ padding:"12px 14px", fontSize:11, fontWeight:!activeCat?700:400, color:!activeCat?C.orange:C.textSub, background:"none", border:"none", borderBottom:!activeCat?`2.5px solid ${C.orange}`:"2.5px solid transparent", cursor:"pointer", whiteSpace:"nowrap", transition:"all 0.2s" }}
              onClick={()=>{setActiveCat(null);setActiveSub(null);setView("shop");setSearch("");}}>☰ All</button>
            {categories.map(c=>(
              <button key={c.id} style={{ padding:"12px 11px", fontSize:11, fontWeight:activeCat===c.id?700:400, color:activeCat===c.id?c.color:C.textSub, background:"none", border:"none", borderBottom:activeCat===c.id?`2.5px solid ${c.color}`:"2.5px solid transparent", cursor:"pointer", whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:4, transition:"all 0.2s" }}
                onClick={()=>{setActiveCat(c.id);setActiveSub(null);setView("shop");setSearch("");}}>
                {c.icon} {c.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── SUB-CAT BAR ── */}
      {catData && view==="shop" && (
        <div style={{ background:"#fdf9f5", borderBottom:`1px solid rgba(255,107,0,0.12)` }}>
          <div style={{ maxWidth:1440, margin:"0 auto", padding:"8px 24px", display:"flex", gap:8, overflowX:"auto", scrollbarWidth:"none" }}>
            <button style={{ padding:"5px 16px", fontSize:11, fontWeight:!activeSub?700:400, background:!activeSub?C.orange:"#fff", color:!activeSub?"#fff":C.textSub, border:`1px solid ${!activeSub?C.orange:C.border}`, borderRadius:20, cursor:"pointer", whiteSpace:"nowrap", transition:"all 0.2s" }} onClick={()=>setActiveSub(null)}>All {catData.label}</button>
            {catData.sub.map(s=>(
              <button key={s} style={{ padding:"5px 16px", fontSize:11, fontWeight:activeSub===s?700:400, background:activeSub===s?C.orange:"#fff", color:activeSub===s?"#fff":C.textSub, border:`1px solid ${activeSub===s?C.orange:C.border}`, borderRadius:20, cursor:"pointer", whiteSpace:"nowrap", transition:"all 0.2s" }} onClick={()=>setActiveSub(s)}>{s}</button>
            ))}
          </div>
        </div>
      )}

      {/* ══════════ SHOP ══════════ */}
      {view==="shop" && (
        <div style={{ maxWidth:1440, margin:"0 auto", padding:"28px 24px 80px" }}>

          {/* HERO */}
          {!activeCat && !search && (
            <div style={{ position:"relative", borderRadius:28, overflow:"hidden", marginBottom:36, background:"linear-gradient(135deg, #fffaf5 0%, #fff4e8 50%, #ffecd3 100%)", border:"1px solid rgba(255,107,0,0.1)", boxShadow:"0 8px 48px rgba(255,107,0,0.08)" }}>
              <div style={{ position:"absolute", top:-80, right:280, width:360, height:360, borderRadius:"50%", background:"radial-gradient(circle, rgba(255,107,0,0.07) 0%, transparent 70%)", pointerEvents:"none" }}/>
              <div style={{ position:"relative", zIndex:2, display:"flex", alignItems:"center", gap:40, padding:"44px 48px", flexWrap:"wrap" }}>
                <div style={{ flex:1, minWidth:280, animation:"fadeUp 0.7s ease both" }}>
                  <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,107,0,0.08)", border:"1px solid rgba(255,107,0,0.2)", borderRadius:20, padding:"5px 14px", marginBottom:18 }}>
                    <span style={{ width:6, height:6, borderRadius:"50%", background:C.orange, display:"inline-block" }}/>
                    <span style={{ fontSize:10, color:C.orange, fontWeight:700, letterSpacing:2 }}>REAL PRODUCT · 4-ANGLE 360° VIEW</span>
                  </div>
                  <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:50, fontWeight:800, lineHeight:1.08, marginBottom:14, color:C.text }}>
                    Shop with<br/><span style={{ color:C.orange }}>360° Rotation</span>
                  </h1>
                  <p style={{ color:C.textSub, fontSize:14, lineHeight:1.85, marginBottom:26, maxWidth:400 }}>
                    Drag any product to rotate it — see every angle in full detail.<br/>
                    Real images. Real 3D feel. All 11 categories.
                  </p>
                  <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                    <button className="btn-primary" style={{ ...bigBtn, width:"auto", padding:"13px 28px" }} onClick={()=>setActiveCat("electronics")}>⚡ Shop Electronics</button>
                    <button style={{ padding:"13px 24px", background:"#fff", border:`1.5px solid ${C.border}`, color:C.text, borderRadius:12, fontSize:13, fontWeight:600, cursor:"pointer", transition:"all 0.2s" }}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor=C.orange;e.currentTarget.style.color=C.orange;}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.text;}}
                      onClick={()=>setActiveCat("fashion")}>👗 Fashion</button>
                  </div>
                  <div style={{ display:"flex", gap:28, marginTop:28 }}>
                    {[["16+","Products"],["11","Categories"],["360°","3D View"],["Free","Returns"]].map(([n,l])=>(
                      <div key={l}>
                        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:C.orange }}>{n}</div>
                        <div style={{ fontSize:10, color:C.textMut, letterSpacing:1, marginTop:1 }}>{l.toUpperCase()}</div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Hero viewer */}
                <div style={{ width:300, height:280, flexShrink:0, borderRadius:24, overflow:"hidden", boxShadow:"0 16px 64px rgba(255,107,0,0.14)", border:"1px solid rgba(255,107,0,0.1)" }}>
                  <Viewer360 product={products[0]} size="small"/>
                </div>
              </div>
            </div>
          )}

          {/* CATEGORY GRID */}
          {!activeCat && !search && (
            <>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700 }}>Browse Categories</h2>
                <span style={{ fontSize:11, color:C.textSub }}>11 departments</span>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))", gap:10, marginBottom:40 }}>
                {categories.map(c=>(
                  <div key={c.id} onClick={()=>{setActiveCat(c.id);setActiveSub(null);}}
                    style={{ background:"#fff", border:`1px solid ${C.border}`, borderRadius:16, padding:"16px 10px", textAlign:"center", cursor:"pointer", transition:"all 0.28s cubic-bezier(.34,1.56,.64,1)" }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=c.color+"55";e.currentTarget.style.background=c.color+"0a";e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 12px 32px ${c.color}18`;}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background="#fff";e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
                    <div style={{ width:46, height:46, borderRadius:12, background:`${c.color}14`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, margin:"0 auto 8px" }}>{c.icon}</div>
                    <div style={{ fontSize:11, fontWeight:600, color:c.color }}>{c.label}</div>
                    <div style={{ fontSize:10, color:C.textMut, marginTop:2 }}>{c.sub.length} types</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* PRODUCT GRID */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, display:"flex", alignItems:"center", gap:10 }}>
              {activeCat?<>{catData?.icon} {catData?.label}</>:search?`🔍 "${search}"`:"⭐ Featured Products"}
              <span style={{ fontSize:12, color:C.textSub, fontWeight:400, background:C.bgSoft, padding:"3px 12px", borderRadius:20, fontFamily:"'DM Sans',sans-serif" }}>{filtered.length}</span>
            </h2>
            <span style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(255,107,0,0.07)", border:"1px solid rgba(255,107,0,0.18)", borderRadius:20, padding:"4px 13px", fontSize:10, fontWeight:700, color:C.orange, letterSpacing:1 }}>↻ DRAG · ROTATE · 360°</span>
          </div>

          <div className="prod-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(255px,1fr))", gap:18 }}>
            {filtered.map(p=>(
              <div key={p.id} className="prod-card" style={{ boxShadow:"0 2px 16px rgba(0,0,0,0.06)" }}>
                {/* Viewer */}
                <div style={{ width:"100%", height:240, borderRadius:"20px 20px 0 0", overflow:"hidden" }}>
                  <Viewer360 product={p} size="small"/>
                </div>

                {/* Badge + wish */}
                <div style={{ padding:"10px 14px 0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <Badge lbl={p.badge || 'NEW'}/>
                  <button style={{ background:"#fff", border:`1px solid ${C.border}`, borderRadius:"50%", width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:wishlist.includes(p.id)?C.red:C.textMut, boxShadow:"0 2px 8px rgba(0,0,0,0.07)", transition:"all 0.2s" }}
                    onClick={()=>setWishlist(prev=>prev.includes(p.id)?prev.filter(x=>x!==p.id):[...prev,p.id])}>
                    {wishlist.includes(p.id)?"♥":"♡"}
                  </button>
                </div>

                {/* Info */}
                <div style={{ padding:"8px 16px 0", flex:1, cursor:"pointer" }} onClick={()=>openProduct(p)}>
                  <div style={{ fontSize:10, color:p.accent||C.orange, letterSpacing:1.2, textTransform:"uppercase", fontWeight:600, marginBottom:3 }}>{p.sub || p.category}</div>
                  <div style={{ fontSize:14, fontWeight:600, lineHeight:1.4, marginBottom:6, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{p.name}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <Stars r={p.rating || 0}/>
                    {p.reviews > 0 && <span style={{ fontSize:10, color:C.textSub }}>({p.reviews.toLocaleString()})</span>}
                  </div>
                  <div style={{ display:"flex", alignItems:"baseline", gap:8, marginTop:8, flexWrap:"wrap" }}>
                    <span style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:C.orange }}>Rs. {p.price.toLocaleString()}</span>
                    {p.orig && <>
                      <span style={{ fontSize:11, color:C.textMut, textDecoration:"line-through" }}>Rs. {p.orig.toLocaleString()}</span>
                      <span style={{ fontSize:9, background:"rgba(255,107,0,0.1)", color:C.orange, padding:"2px 7px", borderRadius:4, fontWeight:700 }}>{disc(p)}% off</span>
                    </>}
                  </div>
                  <div style={{ display:"flex", gap:6, marginTop:8 }}>
                    {p.colors?.slice(0,5).map(c=><div key={c} style={{ width:12, height:12, borderRadius:"50%", background:c, border:"1.5px solid rgba(0,0,0,0.1)" }}/>)}
                  </div>
                </div>

                {/* CTA */}
                <div style={{ padding:"12px 16px 16px" }}>
                  <button className="btn-primary" style={{ ...bigBtn, fontSize:12, padding:"11px" }} onClick={()=>openProduct(p)}>🛒 View & Add to Cart</button>
                </div>
              </div>
            ))}
          </div>

          {filtered.length===0 && (
            <div style={{ textAlign:"center", padding:"80px 0" }}>
              <div style={{ fontSize:52, marginBottom:12 }}>🔍</div>
              <div style={{ fontSize:15, color:C.textSub, marginBottom:20 }}>No products found</div>
              <button className="btn-primary" style={{ ...bigBtn, width:"auto", padding:"12px 28px", display:"inline-flex" }} onClick={()=>{setSearch("");setActiveCat(null);}}>Clear Filters</button>
            </div>
          )}
        </div>
      )}

      {/* ══════════ PRODUCT DETAIL ══════════ */}
      {view==="product" && selProd && (
        <div style={{ maxWidth:1440, margin:"0 auto", padding:"24px 24px 80px" }}>
          <button style={{ background:"none", border:"none", color:C.orange, fontSize:13, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:5, marginBottom:22 }}
            onClick={()=>setView("shop")}>← Back to {catData?.label||"Shop"}</button>

          <div className="detail-grid" style={{ display:"grid", gridTemplateColumns:"1fr 420px", gap:24, alignItems:"start" }}>

            {/* LEFT */}
            <div>
              <div style={{ background:"#fff", borderRadius:24, overflow:"hidden", border:`1px solid ${C.border}`, boxShadow:"0 4px 40px rgba(0,0,0,0.07)" }}>
                {/* Big viewer */}
                <div style={{ height:520 }}>
                  <Viewer360 product={selProd} size="large"/>
                </div>

                {/* Instruction bar */}
                <div style={{ background:"rgba(255,107,0,0.04)", borderTop:`1px solid rgba(255,107,0,0.1)`, padding:"11px 22px", display:"flex", alignItems:"center", justifyContent:"center", gap:28 }}>
                  {[["🖱","DRAG LEFT/RIGHT TO ROTATE"],["🔍","SCROLL TO ZOOM"],["📸","4 REAL PRODUCT ANGLES"]].map(([ic,l])=>(
                    <div key={l} style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:14 }}>{ic}</span>
                      <span style={{ fontSize:9, color:C.orange, fontWeight:700, letterSpacing:1 }}>{l}</span>
                    </div>
                  ))}
                </div>

                {/* Color swatches */}
                <div style={{ padding:"16px 22px", borderBottom:`1px solid ${C.border}` }}>
                  <div style={{ fontSize:10, fontWeight:700, color:C.textSub, letterSpacing:1.5, marginBottom:10 }}>COLOR OPTIONS</div>
                  <div style={{ display:"flex", gap:10 }}>
                    {selProd.colors.map((c,i)=>(
                      <div key={i} onClick={()=>setSelColor(c)}
                        style={{ width:38, height:38, borderRadius:10, background:c, border:`2.5px solid ${selColor===c?C.orange:"rgba(0,0,0,0.1)"}`, cursor:"pointer", transform:selColor===c?"scale(1.15)":"scale(1)", transition:"all 0.2s", boxShadow:selColor===c?`0 0 0 3px rgba(255,107,0,0.18)`:undefined }}/>
                    ))}
                  </div>
                </div>

                {/* Thumbnails */}
                <div style={{ padding:"16px 22px 14px", display:"flex", gap:10, alignItems:"center" }}>
                  <span style={{ fontSize:10, fontWeight:700, color:C.textSub, letterSpacing:1, flexShrink:0 }}>VIEWS</span>
                  {selProd.imgs.map((img,i)=>(
                    <div key={i} style={{ width:72, height:72, borderRadius:12, overflow:"hidden", border:`2px solid ${C.border}`, cursor:"pointer", transition:"all 0.2s", background:C.bgSoft }}
                      onMouseEnter={e=>e.currentTarget.style.borderColor=C.orange}
                      onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                      <img src={img} alt={`view-${i+1}`} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                    </div>
                  ))}
                </div>

                {/* Specs */}
                <div style={{ padding:"0 22px 18px", display:"flex", gap:8, flexWrap:"wrap" }}>
                  {selProd.specs.map(s=>(
                    <span key={s} style={{ background:C.bgSoft, border:`1px solid ${C.border}`, borderRadius:20, fontSize:11, padding:"5px 14px", color:C.textSub, fontWeight:500 }}>✦ {s}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div style={{ background:"#fff", borderRadius:24, border:`1px solid ${C.border}`, padding:"26px", boxShadow:"0 4px 40px rgba(0,0,0,0.06)", position:"sticky", top:72 }}>
              <div style={{ fontSize:10, color:selProd.accent||C.orange, letterSpacing:2, textTransform:"uppercase", marginBottom:5, fontWeight:700 }}>{selProd.category} · {selProd.sub}</div>
              <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:800, color:C.text, lineHeight:1.2, marginBottom:12 }}>{selProd.name}</h1>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                <Stars r={selProd.rating}/>
                <span style={{ fontSize:11, color:C.textSub }}>{selProd.reviews.toLocaleString()} ratings</span>
                <span style={{ fontSize:11, color:C.green, fontWeight:600, background:"rgba(15,155,106,0.08)", padding:"2px 9px", borderRadius:20 }}>✓ In Stock</span>
              </div>
              <div style={{ display:"flex", alignItems:"baseline", gap:12, marginBottom:6, flexWrap:"wrap" }}>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:34, fontWeight:800, color:C.orange }}>Rs. {selProd.price.toLocaleString()}</span>
                <span style={{ fontSize:16, color:C.textMut, textDecoration:"line-through" }}>Rs. {selProd.orig.toLocaleString()}</span>
                <span style={{ background:"rgba(255,107,0,0.1)", color:C.orange, padding:"4px 12px", borderRadius:8, fontSize:13, fontWeight:800 }}>{disc(selProd)}% OFF</span>
              </div>
              <div style={{ fontSize:13, color:C.green, fontWeight:500, marginBottom:16 }}>🎉 You save Rs. {(selProd.orig-selProd.price).toLocaleString()}</div>
              <div style={{ fontSize:12, color:C.textSub, lineHeight:1.85, marginBottom:16, paddingBottom:16, borderBottom:`1px solid ${C.border}` }}>
                {selProd.specs.join(" · ")} — Premium quality with manufacturer warranty. 100% authentic.
              </div>

              {/* Delivery */}
              <div style={{ fontSize:10, fontWeight:700, color:C.textSub, letterSpacing:1.5, marginBottom:10 }}>DELIVERY</div>
              {[{id:"free",label:"🐢 Economy",sub:"7–10 days",price:"FREE"},{id:"standard",label:"📦 Standard",sub:"3–5 days · BlueDart",price:"Rs. 99"},{id:"express",label:"⚡ Express",sub:"1–2 days · FedEx",price:"Rs. 299"}].map(d=>(
                <div key={d.id} style={delOpt(delivery===d.id)} onClick={()=>setDelivery(d.id)}>
                  <span style={{ color:delivery===d.id?C.orange:C.textMut }}>{delivery===d.id?"◉":"◎"}</span>
                  <div style={{ flex:1 }}><div style={{ fontSize:12, color:delivery===d.id?C.orange:C.text, fontWeight:delivery===d.id?600:400 }}>{d.label}</div><div style={{ fontSize:10, color:C.textSub }}>{d.sub}</div></div>
                  <span style={{ fontSize:12, fontWeight:700, color:delivery===d.id?C.orange:C.textSub }}>{d.price}</span>
                </div>
              ))}

              {/* Qty */}
              <div style={{ display:"flex", alignItems:"center", gap:12, margin:"16px 0" }}>
                <span style={{ fontSize:10, fontWeight:700, color:C.textSub, letterSpacing:1 }}>QTY:</span>
                <button style={{ width:32, height:32, background:C.orangeBg, border:`1px solid rgba(255,107,0,0.2)`, borderRadius:8, fontSize:18, color:C.orange, display:"flex", alignItems:"center", justifyContent:"center" }} onClick={()=>setQty(Math.max(1,qty-1))}>−</button>
                <span style={{ fontSize:16, fontWeight:700, minWidth:28, textAlign:"center" }}>{qty}</span>
                <button style={{ width:32, height:32, background:C.orangeBg, border:`1px solid rgba(255,107,0,0.2)`, borderRadius:8, fontSize:18, color:C.orange, display:"flex", alignItems:"center", justifyContent:"center" }} onClick={()=>setQty(qty+1)}>+</button>
                <span style={{ fontSize:11, color:C.textSub }}>= <b style={{ color:C.orange }}>Rs. {(selProd.price*qty).toLocaleString()}</b></span>
              </div>

              <button className="btn-primary" style={bigBtn} onClick={addToCart}>🛒 Add to Cart</button>
              <button className="btn-primary" style={{ ...bigBtn, background:"linear-gradient(135deg,#1a1a1a,#333)", boxShadow:"0 8px 28px rgba(0,0,0,0.2)", marginTop:8 }} onClick={()=>{addToCart();setView("cart");}}>⚡ Buy Now</button>
              <button style={{ ...bigBtn, background:"transparent", border:`1px solid ${wishlist.includes(selProd.id)?C.red:C.border}`, color:wishlist.includes(selProd.id)?C.red:C.textSub, boxShadow:"none", marginTop:8, transition:"all 0.2s" }}
                onClick={()=>setWishlist(prev=>prev.includes(selProd.id)?prev.filter(x=>x!==selProd.id):[...prev,selProd.id])}>
                {wishlist.includes(selProd.id)?"♥ Remove Wishlist":"♡ Add to Wishlist"}
              </button>
              <div style={{ marginTop:14, padding:"12px 16px", background:C.bgSoft, borderRadius:12, display:"flex", gap:14, fontSize:10, color:C.textSub, flexWrap:"wrap", justifyContent:"center" }}>
                <span>🔒 Secure Pay</span><span>↩ 30-Day Return</span><span>✓ Authentic</span><span>🚚 Free Rs.999+</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ CART ══════════ */}
      {view==="cart" && (
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"28px 24px 80px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:800 }}>My Cart <span style={{ fontSize:14, color:C.textSub, fontWeight:400, fontFamily:"'DM Sans',sans-serif" }}>({cartCount})</span></h2>
            <button style={{ background:"none", border:"none", color:C.orange, fontSize:12, fontWeight:600, cursor:"pointer" }} onClick={()=>setView("shop")}>← Continue Shopping</button>
          </div>
          {cart.length===0 && (
            <div style={{ textAlign:"center", padding:"80px", background:"#fff", borderRadius:24, border:`1px solid ${C.border}` }}>
              <div style={{ fontSize:56, marginBottom:14 }}>🛒</div>
              <div style={{ fontSize:16, color:C.textSub, marginBottom:20 }}>Your cart is empty</div>
              <button className="btn-primary" style={{ ...bigBtn, width:"auto", padding:"12px 30px", display:"inline-flex" }} onClick={()=>setView("shop")}>Start Shopping</button>
            </div>
          )}
          {cart.map(item=>(
            <div key={`${item.id}-${item.color}`} style={{ background:"#fff", border:`1px solid ${C.border}`, borderRadius:16, padding:16, marginBottom:10, display:"flex", gap:14, alignItems:"center", boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}>
              <div style={{ width:88, height:88, borderRadius:12, overflow:"hidden", flexShrink:0, background:C.bgSoft }}>
                <img src={item.imgs[0]} alt={item.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:10, color:item.accent||C.orange, textTransform:"uppercase", letterSpacing:1, fontWeight:600 }}>{item.sub}</div>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:4 }}>{item.name}</div>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <div style={{ width:12, height:12, borderRadius:"50%", background:item.color, border:"1px solid rgba(0,0,0,0.1)" }}/>
                  <Stars r={item.rating}/>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <button style={{ width:30, height:30, background:C.orangeBg, border:`1px solid rgba(255,107,0,0.2)`, borderRadius:8, fontSize:16, color:C.orange, display:"flex", alignItems:"center", justifyContent:"center" }} onClick={()=>setCart(p=>p.map(i=>i.id===item.id&&i.color===item.color?{...i,qty:Math.max(1,i.qty-1)}:i))}>−</button>
                <span style={{ fontSize:14, fontWeight:700, minWidth:24, textAlign:"center" }}>{item.qty}</span>
                <button style={{ width:30, height:30, background:C.orangeBg, border:`1px solid rgba(255,107,0,0.2)`, borderRadius:8, fontSize:16, color:C.orange, display:"flex", alignItems:"center", justifyContent:"center" }} onClick={()=>setCart(p=>p.map(i=>i.id===item.id&&i.color===item.color?{...i,qty:i.qty+1}:i))}>+</button>
              </div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:C.orange, minWidth:110, textAlign:"right" }}>Rs. {(item.price*item.qty).toLocaleString()}</div>
              <button style={{ background:"none", border:"none", color:C.red, fontSize:18, cursor:"pointer", padding:"4px 8px" }} onClick={()=>setCart(p=>p.filter(i=>!(i.id===item.id&&i.color===item.color)))}>✕</button>
            </div>
          ))}
          {cart.length>0 && (
            <div style={{ background:"#fff", border:`1px solid ${C.border}`, borderRadius:16, padding:22, marginTop:16, boxShadow:"0 4px 24px rgba(0,0,0,0.05)" }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:700, marginBottom:14, paddingBottom:12, borderBottom:`1px solid ${C.border}` }}>Order Summary</div>
              {[{l:"Subtotal",v:`Rs. ${cartTotal.toLocaleString()}`},{l:`Delivery (${delivery})`,v:delFee===0?"FREE":`Rs. ${delFee}`}].map(r=>(
                <div key={r.l} style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:C.textSub, marginBottom:8 }}><span>{r.l}</span><span>{r.v}</span></div>
              ))}
              <div style={{ height:1, background:C.border, margin:"12px 0" }}/>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:20, fontWeight:800 }}>
                <span>Grand Total</span><span style={{ color:C.orange, fontFamily:"'Playfair Display',serif" }}>Rs. {grandTotal.toLocaleString()}</span>
              </div>
              <div style={{ fontSize:11, color:C.green, marginTop:5 }}>🎉 Save Rs. {cart.reduce((s,i)=>(i.orig-i.price)*i.qty+s,0).toLocaleString()}</div>
              <button className="btn-primary" style={{ ...bigBtn, marginTop:16 }} onClick={()=>setView("payment")}>Proceed to Checkout →</button>
            </div>
          )}
        </div>
      )}

      {/* ══════════ PAYMENT ══════════ */}
      {view==="payment" && (
        <div style={{ maxWidth:800, margin:"0 auto", padding:"28px 24px 80px" }}>
          <button style={{ background:"none", border:"none", color:C.orange, fontSize:12, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:4, marginBottom:18 }} onClick={()=>setView("cart")}>← Back to Cart</button>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:800, marginBottom:4 }}>Secure Checkout</h2>
          <div style={{ fontSize:11, color:C.textSub, marginBottom:22 }}>🔒 256-bit SSL Encrypted · QuickArt Payments</div>

          <div style={{ background:"#fff", border:`1px solid ${C.border}`, borderRadius:16, padding:18, marginBottom:14 }}>
            <div style={{ fontSize:13, fontWeight:700, marginBottom:12, paddingBottom:10, borderBottom:`1px solid ${C.border}` }}>🛒 Order Summary</div>
            {cart.map(i=><div key={`${i.id}-${i.color}`} style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:C.textSub, marginBottom:6 }}><span>{i.name} ×{i.qty}</span><b style={{ color:C.orange }}>Rs. {(i.price*i.qty).toLocaleString()}</b></div>)}
            <div style={{ height:1, background:C.border, margin:"10px 0" }}/>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:18, fontWeight:800 }}><span>Grand Total</span><span style={{ color:C.orange }}>Rs. {grandTotal.toLocaleString()}</span></div>
          </div>

          <div style={{ background:"#fff", border:`1px solid ${C.border}`, borderRadius:16, padding:18, marginBottom:14 }}>
            <div style={{ fontSize:13, fontWeight:700, marginBottom:12, paddingBottom:10, borderBottom:`1px solid ${C.border}` }}>📍 Delivery Address</div>
            <button style={methBtn(!!location)} onClick={getLocation}><span style={{ fontSize:18 }}>📍</span><div style={{ textAlign:"left" }}><div style={{ fontWeight:600 }}>{locLoading?"Detecting...":location?"Location Detected ✓":"Use Current Location"}</div>{location&&<div style={{ fontSize:10, color:C.green }}>GPS: {location.lat}, {location.lng}</div>}</div></button>
            {["Full Name→name","Phone→phone","Street Address→street"].map(f=>{const[ph,k]=f.split("→");return<input key={k} style={inp} placeholder={ph} value={addr[k]} onChange={e=>setAddr({...addr,[k]:e.target.value})}/>;} )}
            <div style={inpRow}>{["City→city","PIN Code→pin"].map(f=>{const[ph,k]=f.split("→");return<input key={k} style={inp} placeholder={ph} value={addr[k]} onChange={e=>setAddr({...addr,[k]:e.target.value})}/>;} )}</div>
            <input style={inp} placeholder="State" value={addr.state} onChange={e=>setAddr({...addr,state:e.target.value})}/>
          </div>

          <div style={{ background:"#fff", border:`1px solid ${C.border}`, borderRadius:16, padding:18, marginBottom:14 }}>
            <div style={{ fontSize:13, fontWeight:700, marginBottom:12, paddingBottom:10, borderBottom:`1px solid ${C.border}` }}>🚚 Delivery</div>
            {[{id:"free",label:"🐢 Economy — 7–10 days",sub:"India Post",price:"FREE"},{id:"standard",label:"📦 Standard — 3–5 days",sub:"BlueDart · DTDC",price:"Rs. 99"},{id:"express",label:"⚡ Express — 1–2 days",sub:"FedEx · XpressBees",price:"Rs. 299"}].map(d=>(
              <button key={d.id} style={methBtn(delivery===d.id)} onClick={()=>setDelivery(d.id)}><span>{delivery===d.id?"◉":"◎"}</span><div style={{ flex:1, textAlign:"left" }}><div style={{ fontWeight:600 }}>{d.label}</div><div style={{ fontSize:10, color:C.textSub }}>{d.sub}</div></div><span style={{ fontWeight:700 }}>{d.price}</span></button>
            ))}
          </div>

          <div style={{ background:"#fff", border:`1px solid ${C.border}`, borderRadius:16, padding:18, marginBottom:14 }}>
            <div style={{ fontSize:13, fontWeight:700, marginBottom:12, paddingBottom:10, borderBottom:`1px solid ${C.border}` }}>💳 Payment Method</div>
            <button style={methBtn(payMethod==="upi")} onClick={()=>setPayMethod("upi")}><span style={{ fontSize:20 }}>📱</span><div style={{ textAlign:"left", flex:1 }}><div style={{ fontWeight:600 }}>UPI Payment</div><div style={{ fontSize:10, color:C.textSub }}>PhonePe · GPay · Paytm · BHIM</div></div>{payMethod==="upi"&&<span style={{ color:C.green, fontWeight:700 }}>✓</span>}</button>
            {payMethod==="upi"&&<div style={{ padding:"0 0 10px" }}><input style={inp} placeholder="UPI ID (e.g. name@paytm)" value={upi} onChange={e=>setUpi(e.target.value)}/><div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>{[{l:"📲 PhonePe",c:"#6739B7"},{l:"🅶 GPay",c:"#4285F4"},{l:"💰 Paytm",c:"#00BAF2"},{l:"🇮🇳 BHIM",c:C.orange}].map(u=><div key={u.l} style={{ padding:"6px 14px", background:`${u.c}14`, border:`1px solid ${u.c}44`, borderRadius:8, fontSize:11, color:u.c, cursor:"pointer", fontWeight:600 }}>{u.l}</div>)}</div></div>}
            <button style={methBtn(payMethod==="card")} onClick={()=>setPayMethod("card")}><span style={{ fontSize:20 }}>💳</span><div style={{ textAlign:"left", flex:1 }}><div style={{ fontWeight:600 }}>Credit / Debit Card</div><div style={{ fontSize:10, color:C.textSub }}>VISA · Mastercard · RuPay · Amex</div></div>{payMethod==="card"&&<span style={{ color:C.green, fontWeight:700 }}>✓</span>}</button>
            {payMethod==="card"&&<div style={{ padding:"0 0 10px" }}><input style={inp} placeholder="Card Number" maxLength={19} value={card.num} onChange={e=>setCard({...card,num:e.target.value})}/><input style={inp} placeholder="Cardholder Name" value={card.name} onChange={e=>setCard({...card,name:e.target.value})}/><div style={inpRow}><input style={inp} placeholder="MM/YY" maxLength={5} value={card.exp} onChange={e=>setCard({...card,exp:e.target.value})}/><input style={inp} placeholder="CVV" maxLength={4} type="password" value={card.cvv} onChange={e=>setCard({...card,cvv:e.target.value})}/></div></div>}
            <button style={methBtn(payMethod==="netbank")} onClick={()=>setPayMethod("netbank")}><span style={{ fontSize:20 }}>🏦</span><div style={{ textAlign:"left", flex:1 }}><div style={{ fontWeight:600 }}>Net Banking</div><div style={{ fontSize:10, color:C.textSub }}>SBI · HDFC · ICICI · Axis · Kotak</div></div>{payMethod==="netbank"&&<span style={{ color:C.green, fontWeight:700 }}>✓</span>}</button>
            {payMethod==="netbank"&&<div style={{ display:"flex", gap:8, flexWrap:"wrap", padding:"0 0 10px" }}>{["SBI","HDFC","ICICI","Axis","Kotak","PNB","BOI","Canara"].map(b=><div key={b} style={{ padding:"7px 14px", background:C.bgSoft, border:`1px solid ${C.border}`, borderRadius:8, fontSize:12, cursor:"pointer" }}>{b}</div>)}</div>}
            <button style={methBtn(payMethod==="emi")} onClick={()=>setPayMethod("emi")}><span style={{ fontSize:20 }}>📅</span><div style={{ textAlign:"left", flex:1 }}><div style={{ fontWeight:600 }}>No Cost EMI</div><div style={{ fontSize:10, color:C.textSub }}>3/6/9/12 months · All major cards</div></div>{payMethod==="emi"&&<span style={{ color:C.green, fontWeight:700 }}>✓</span>}</button>
            <button style={methBtn(payMethod==="cod")} onClick={()=>setPayMethod("cod")}><span style={{ fontSize:20 }}>💵</span><div style={{ textAlign:"left", flex:1 }}><div style={{ fontWeight:600 }}>Cash on Delivery</div><div style={{ fontSize:10, color:C.textSub }}>Pay in Rs. when delivered</div></div>{payMethod==="cod"&&<span style={{ color:C.green, fontWeight:700 }}>✓</span>}</button>
          </div>

          <div style={{ background:"rgba(255,107,0,0.04)", border:`1.5px solid rgba(255,107,0,0.18)`, borderRadius:14, padding:18, marginBottom:14 }}>
            {[{l:"Items",v:`Rs. ${cartTotal.toLocaleString()}`},{l:"Delivery",v:delFee===0?"FREE":`Rs. ${delFee}`}].map(r=><div key={r.l} style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:C.textSub, marginBottom:8 }}><span>{r.l}</span><span>{r.v}</span></div>)}
            <div style={{ height:1, background:"rgba(255,107,0,0.15)", margin:"10px 0" }}/>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:20, fontWeight:800 }}><span>Amount Payable</span><span style={{ color:C.orange, fontFamily:"'Playfair Display',serif" }}>Rs. {grandTotal.toLocaleString()}</span></div>
          </div>
          <button className="btn-primary" style={{ ...bigBtn, fontSize:15 }} onClick={placeOrder}>🔒 Place Order — Rs. {grandTotal.toLocaleString()}</button>
          <div style={{ textAlign:"center", fontSize:10, color:C.textMut, marginTop:12, display:"flex", justifyContent:"center", gap:16 }}>
            <span>🔒 Secure</span><span>↩ 30-Day Returns</span><span>✓ Authentic</span><span>📞 24/7 Support</span>
          </div>
        </div>
      )}

      {/* ══════════ CONFIRM ══════════ */}
      {view==="confirm" && (
        <div style={{ maxWidth:600, margin:"60px auto", padding:"0 24px", textAlign:"center" }}>
          <div style={{ fontSize:72, marginBottom:16 }}>✅</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:800, color:C.green, marginBottom:8 }}>Order Placed!</h2>
          <div style={{ fontSize:12, color:C.orange, letterSpacing:2, marginBottom:16, fontWeight:700 }}>ORDER #{orderRef}</div>
          <p style={{ fontSize:13, color:C.textSub, lineHeight:2, marginBottom:28 }}>
            Thank you for shopping at QuickArt! 🎉<br/>
            Estimated: <b style={{ color:C.text }}>{delivery==="express"?"1–2":delivery==="standard"?"3–5":"7–10"} business days</b><br/>
            {location&&<span>📍 GPS: {location.lat}, {location.lng}<br/></span>}
            Confirmation SMS & email sent.
          </p>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", marginBottom:32 }}>
            {[{l:"Confirmed",i:"✅"},{l:"Packed",i:"📦"},{l:"Shipped",i:"🚚"},{l:"Delivered",i:"🏠"}].map((s,i)=>(
              <span key={s.l} style={{ display:"flex", alignItems:"center" }}>
                <span style={{ textAlign:"center" }}>
                  <div style={{ width:46, height:46, borderRadius:"50%", background:i===0?C.orange:"#f0ebe3", border:`2px solid ${i===0?C.orange:C.border}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 5px", fontSize:18, boxShadow:i===0?`0 6px 20px rgba(255,107,0,0.3)`:undefined }}>{s.i}</div>
                  <div style={{ fontSize:9, color:i===0?C.orange:C.textMut, fontWeight:i===0?700:400 }}>{s.l}</div>
                </span>
                {i<3&&<div style={{ width:36, height:2, background:i===0?C.orange:C.border, marginBottom:20 }}/>}
              </span>
            ))}
          </div>
          <button className="btn-primary" style={{ ...bigBtn, width:"auto", padding:"14px 34px", display:"inline-flex" }} onClick={()=>{setView("shop");setActiveCat(null);}}>Continue Shopping →</button>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div style={{ position:"fixed", bottom:28, left:"50%", transform:"translateX(-50%)", background:toast.type==="success"?C.green:toast.type==="error"?C.red:"#1a1a1a", color:"#fff", padding:"12px 24px", borderRadius:30, fontSize:13, fontWeight:600, zIndex:9999, display:"flex", alignItems:"center", gap:8, boxShadow:"0 8px 32px rgba(0,0,0,0.18)", animation:"toastIn 0.3s ease", whiteSpace:"nowrap" }}>
          {toast.msg}
        </div>
      )}

      {/* FOOTER */}
      {view==="shop" && (
        <footer style={{ background:"#1a1a1a", color:"rgba(255,255,255,0.45)", padding:"36px 24px", marginTop:60 }}>
          <div style={{ maxWidth:1440, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:24 }}>
            <div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:800, color:"#fff", marginBottom:8, display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ background:`linear-gradient(135deg,${C.orange},${C.orangeD})`, borderRadius:8, width:28, height:28, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>⚡</span>
                QUICK ART
              </div>
              <div style={{ fontSize:11, lineHeight:2, color:"rgba(255,255,255,0.3)" }}>Smart. Fast. Reliable.<br/>Real 360° Images · 11 Categories<br/>Sri Lanka & India</div>
            </div>
            {[{t:"Categories",items:["Electronics","Fashion","Home & Kitchen","Grocery","Digital Products"]},{t:"Support",items:["Help Center","Contact Us","Returns","Track Order","FAQ"]},{t:"Payments",items:["UPI / GPay","VISA / Mastercard","RuPay","Net Banking","Cash on Delivery"]}].map(col=>(
              <div key={col.t}>
                <div style={{ color:C.orange, fontSize:10, fontWeight:700, marginBottom:10, letterSpacing:2 }}>{col.t.toUpperCase()}</div>
                {col.items.map(i=><div key={i} style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginBottom:7, cursor:"pointer", transition:"color 0.2s" }} onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.3)"}>{i}</div>)}
              </div>
            ))}
          </div>
          <div style={{ maxWidth:1440, margin:"24px auto 0", paddingTop:18, borderTop:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between", fontSize:10, color:"rgba(255,255,255,0.2)", flexWrap:"wrap", gap:8 }}>
            <span>© 2024 QuickArt. All rights reserved.</span>
            <span>Rs. (LKR/INR) · Real 360° Drag-to-Rotate Viewer · QuickArt</span>
          </div>
        </footer>
      )}
    </div>
  );
}