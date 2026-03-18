// Enhanced 360° Product Viewer with Physics-Based 3D Effect
// Canvas interpolation engine (C++-style frame blending in JS)
import { useState, useRef, useEffect, useCallback } from "react";

const COLORS = ["#1a1a1a", "#c9a96e", "#8b9e8b", "#b5c4d8"];
const COLOR_NAMES = ["Obsidian", "Champagne", "Sage", "Powder Blue"];
const SIZES = ["XS", "S", "M", "L", "XL"];

/* ── Physics constants ── */
const FRICTION = 0.88;
const SENSITIVITY = 0.35;
const TILT_MAX = 15;
const TILT_EASE = 0.08;

export default function ProductViewer3D() {
  const [images, setImages] = useState([]);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isAutoSpin, setIsAutoSpin] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [thumbIdx, setThumbIdx] = useState(0);

  /* ── Canvas + physics refs ── */
  const canvasRef = useRef(null);
  const stageRef = useRef(null);
  const physics = useRef({
    framePos: 0,       // float frame index
    velocity: 0,       // frames/tick
    dragging: false,
    lastX: 0,
    tiltX: 0, tiltY: 0,        // current tilt
    targetTiltX: 0, targetTiltY: 0,
    autoSpin: false,
    zoom: 1,
    panX: 0, panY: 0,
    panStartX: 0, panStartY: 0,
    panOriginX: 0, panOriginY: 0,
    rafId: null,
    images: [],        // ImageBitmap cache
  });
  const imagesRef = useRef([]);

  /* ── Generate demo frames on canvas (simulates C++ geometry renderer) ── */
  const generateDemoFrames = useCallback(async () => {
    const N = 24;
    const urls = [];
    for (let i = 0; i < N; i++) {
      const c = document.createElement("canvas");
      c.width = 600; c.height = 600;
      const ctx = c.getContext("2d");
      const angle = (i / N) * Math.PI * 2;
      // Background
      ctx.fillStyle = "#f2ede6";
      ctx.fillRect(0, 0, 600, 600);
      // Shadow
      ctx.save();
      ctx.translate(300, 420);
      ctx.scale(1, 0.3);
      const shadowGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 120 + Math.abs(Math.sin(angle)) * 30);
      shadowGrad.addColorStop(0, "rgba(0,0,0,0.22)");
      shadowGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = shadowGrad;
      ctx.beginPath(); ctx.arc(0, 0, 120, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      // Vase body
      ctx.save();
      ctx.translate(300, 300);
      const rotZ = Math.sin(angle) * 8;
      ctx.rotate(rotZ * Math.PI / 180);
      // Base gradient
      const bodyGrad = ctx.createLinearGradient(
        -80 + Math.cos(angle) * 60, -160,
        80 + Math.cos(angle) * 20, 160
      );
      bodyGrad.addColorStop(0, "#e8ddd0");
      bodyGrad.addColorStop(0.3 + Math.cos(angle) * 0.15, "#c9a96e");
      bodyGrad.addColorStop(0.7, "#a07848");
      bodyGrad.addColorStop(1, "#7a5530");
      ctx.fillStyle = bodyGrad;
      // Vase path
      ctx.beginPath();
      ctx.moveTo(0, -160);
      ctx.bezierCurveTo(40, -160, 70 + Math.cos(angle) * 15, -80, 80 + Math.cos(angle) * 20, 0);
      ctx.bezierCurveTo(90 + Math.cos(angle) * 20, 80, 70, 130, 50, 160);
      ctx.lineTo(-50, 160);
      ctx.bezierCurveTo(-70, 130, -90 + Math.cos(angle) * 20, 80, -80 + Math.cos(angle) * 20, 0);
      ctx.bezierCurveTo(-70 + Math.cos(angle) * 15, -80, -40, -160, 0, -160);
      ctx.closePath();
      ctx.fill();
      // Rim highlight
      const rimGrad = ctx.createLinearGradient(-30, -165, 30, -155);
      rimGrad.addColorStop(0, "#f5ead8");
      rimGrad.addColorStop(1, "#8b6030");
      ctx.strokeStyle = rimGrad;
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.ellipse(0, -158, 28, 10, 0, 0, Math.PI * 2);
      ctx.stroke();
      // Specular highlight
      const specX = -20 + Math.cos(angle + 0.5) * 40;
      const specGrad = ctx.createRadialGradient(specX, -60, 0, specX, -40, 60);
      specGrad.addColorStop(0, "rgba(255,255,240,0.65)");
      specGrad.addColorStop(1, "rgba(255,255,240,0)");
      ctx.fillStyle = specGrad;
      ctx.beginPath(); ctx.ellipse(specX, -50, 35, 55, -0.3, 0, Math.PI * 2); ctx.fill();
      // Texture lines
      ctx.strokeStyle = `rgba(100,60,20,${0.12 + Math.abs(Math.cos(angle)) * 0.05})`;
      ctx.lineWidth = 1.5;
      for (let t = -120; t < 140; t += 18) {
        const wt = 55 + Math.abs(t) * 0.18;
        ctx.beginPath();
        ctx.moveTo(-wt + Math.cos(angle) * 10, t);
        ctx.bezierCurveTo(-wt * 0.5, t + 4, wt * 0.5, t + 4, wt + Math.cos(angle) * 10, t);
        ctx.stroke();
      }
      ctx.restore();
      urls.push(c.toDataURL());
    }
    return urls;
  }, []);

  /* ── Load images into ImageBitmap cache ── */
  const loadBitmaps = useCallback(async (urls) => {
    const bitmaps = await Promise.all(
      urls.map(url => new Promise(res => {
        const img = new Image();
        img.onload = () => createImageBitmap(img).then(res);
        img.src = url;
      }))
    );
    physics.current.images = bitmaps;
    physics.current.framePos = 0;
    imagesRef.current = urls;
  }, []);

  /* ── Init with demo frames ── */
  useEffect(() => {
    generateDemoFrames().then(urls => {
      setImages(urls);
      loadBitmaps(urls);
      setIsAutoSpin(true);
      physics.current.autoSpin = true;
    });
  }, []);

  /* ── Upload handler ── */
  const handleUpload = useCallback((e) => {
    const files = Array.from(e.target.files);
    const urls = files.map(f => URL.createObjectURL(f));
    setImages(urls);
    loadBitmaps(urls);
    setThumbIdx(0);
    setIsAutoSpin(false);
    physics.current.autoSpin = false;
  }, [loadBitmaps]);

  /* ── Canvas render loop — C++-style frame interpolation ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const render = () => {
      const p = physics.current;
      const bitmaps = p.images;
      const N = bitmaps.length;

      if (N > 0) {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        // Interpolate between two frames
        const fi = ((p.framePos % N) + N) % N;
        const f0 = Math.floor(fi) % N;
        const f1 = (f0 + 1) % N;
        const t = fi - Math.floor(fi);

        ctx.save();
        ctx.translate(W / 2 + p.panX, H / 2 + p.panY);
        ctx.scale(p.zoom, p.zoom);
        ctx.translate(-W / 2, -H / 2);

        if (t < 0.01) {
          ctx.drawImage(bitmaps[f0], 0, 0, W, H);
        } else {
          ctx.globalAlpha = 1 - t;
          ctx.drawImage(bitmaps[f0], 0, 0, W, H);
          ctx.globalAlpha = t;
          ctx.drawImage(bitmaps[f1], 0, 0, W, H);
          ctx.globalAlpha = 1;
        }
        ctx.restore();
      }

      // Ease tilt toward target
      p.tiltX += (p.targetTiltX - p.tiltX) * TILT_EASE;
      p.tiltY += (p.targetTiltY - p.tiltY) * TILT_EASE;

      // Apply tilt to stage
      if (stageRef.current) {
        stageRef.current.style.transform =
          `perspective(800px) rotateX(${-p.tiltY}deg) rotateY(${p.tiltX}deg)`;
      }

      // Physics: apply velocity + friction
      if (!p.dragging) {
        if (p.autoSpin && N > 1) {
          p.velocity = 0.18;
        } else {
          p.velocity *= FRICTION;
        }
        p.framePos += p.velocity;
        if (Math.abs(p.velocity) < 0.001 && !p.autoSpin) p.velocity = 0;
      }

      setThumbIdx(Math.round(((p.framePos % N) + N) % N) % N);
      p.rafId = requestAnimationFrame(render);
    };

    physics.current.rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(physics.current.rafId);
  }, []);

  /* ── Sync canvas size to container ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      canvas.width = width;
      canvas.height = height;
    });
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  /* ── Pointer handlers ── */
  const onPointerDown = (e) => {
    const p = physics.current;
    if (p.zoom > 1) {
      p.panStartX = e.clientX; p.panStartY = e.clientY;
      p.panOriginX = p.panX; p.panOriginY = p.panY;
    } else {
      p.dragging = true;
      p.lastX = e.clientX;
      p.velocity = 0;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    const p = physics.current;
    const N = p.images.length;
    if (p.dragging && N > 0) {
      const dx = e.clientX - p.lastX;
      p.velocity = -dx * SENSITIVITY * (N / 24);
      p.framePos += p.velocity;
      p.lastX = e.clientX;
    } else if (p.zoom > 1 && e.buttons > 0) {
      p.panX = p.panOriginX + (e.clientX - p.panStartX);
      p.panY = p.panOriginY + (e.clientY - p.panStartY);
    }
  };

  const onPointerUp = () => { physics.current.dragging = false; };

  const onMouseMove = (e) => {
    const p = physics.current;
    if (p.dragging) return;
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    p.targetTiltX = nx * TILT_MAX;
    p.targetTiltY = ny * TILT_MAX;
  };

  const onMouseLeave = () => {
    physics.current.targetTiltX = 0;
    physics.current.targetTiltY = 0;
  };

  const onWheel = (e) => {
    e.preventDefault();
    const p = physics.current;
    p.zoom = Math.min(4, Math.max(1, p.zoom - e.deltaY * 0.002));
    setZoom(p.zoom);
    if (p.zoom <= 1) { p.panX = 0; p.panY = 0; }
  };

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  });

  const toggleSpin = () => {
    const next = !isAutoSpin;
    setIsAutoSpin(next);
    physics.current.autoSpin = next;
    if (!next) physics.current.velocity = 0;
  };

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  /* ─────────────── Render ─────────────── */
  return (
    <div style={S.page}>
      {/* ── LEFT: Viewer ── */}
      <div style={S.viewerCol}>
        <div
          ref={stageRef}
          style={{ ...S.stage, cursor: physics.current.zoom > 1 ? "grab" : "ew-resize" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
        >
          <canvas ref={canvasRef} style={S.canvas} />

          {/* Controls overlay */}
          <div style={S.controls}>
            <Btn onClick={() => { physics.current.zoom = Math.min(4, physics.current.zoom + 0.5); setZoom(physics.current.zoom); }} title="Zoom in">
              <PlusIcon />
            </Btn>
            <Btn onClick={() => { physics.current.zoom = Math.max(1, physics.current.zoom - 0.5); setZoom(physics.current.zoom); if(physics.current.zoom<=1){physics.current.panX=0;physics.current.panY=0;} }} title="Zoom out">
              <MinusIcon />
            </Btn>
            <Btn onClick={() => { physics.current.zoom=1; physics.current.panX=0; physics.current.panY=0; setZoom(1); }} title="Reset">
              <ResetIcon />
            </Btn>
            <Btn onClick={toggleSpin} title="Auto spin" active={isAutoSpin}>
              <SpinIcon />
            </Btn>
          </div>

          <div style={S.badge360}>
            <SpinIcon size={12} />
            <span>360°</span>
          </div>

          {images.length > 1 && (
            <div style={S.frameBar}>
              {Array.from({ length: Math.min(images.length, 24) }, (_, i) => {
                const idx = Math.floor(i * images.length / Math.min(images.length, 24));
                return (
                  <div
                    key={i}
                    style={{ ...S.dot, background: idx === thumbIdx ? "#1a1a1a" : "#d0ccc7" }}
                    onClick={() => { physics.current.framePos = idx; physics.current.velocity = 0; }}
                  />
                );
              })}
            </div>
          )}
        </div>

        {images.length > 1 && zoom === 1 && (
          <p style={S.hint}>
            <ArrowIcon /> Drag to rotate · Scroll to zoom · Hover for 3D tilt
          </p>
        )}

        {/* Thumbnail strip */}
        <div style={S.thumbStrip}>
          {images.slice(0, 8).map((src, i) => (
            <button key={i} style={{ ...S.thumb, outline: i === thumbIdx % 8 ? "2px solid #1a1a1a" : "2px solid transparent" }}
              onClick={() => { physics.current.framePos = i; physics.current.velocity = 0; setThumbIdx(i); }}>
              <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 6 }} />
            </button>
          ))}
          <label style={{ ...S.thumb, ...S.addThumb }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <input type="file" accept="image/*" multiple style={{ display:"none" }} onChange={handleUpload} />
          </label>
        </div>
      </div>

      {/* ── RIGHT: Product Info ── */}
      <div style={S.infoCol}>
        <p style={S.breadcrumb}>Home / Collection / <span style={{color:"#1a1a1a"}}>Product</span></p>
        <h1 style={S.title}>Artisan Ceramic Vase</h1>
        <p style={S.subtitle}>Handcrafted · Limited Edition</p>

        <div style={S.ratingRow}>
          {[1,2,3,4,5].map(s => (
            <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill={s<=4?"#c9a96e":"none"} stroke="#c9a96e" strokeWidth="1.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          ))}
          <span style={S.reviewCount}>4.0 (128 reviews)</span>
        </div>

        <div style={S.priceRow}>
          <span style={S.price}>$189.00</span>
          <span style={S.origPrice}>$240.00</span>
          <span style={S.discBadge}>21% OFF</span>
        </div>
        <p style={S.taxNote}>Inclusive of all taxes · Free shipping above $150</p>
        <div style={S.divider} />

        <div style={S.optionSec}>
          <p style={S.optLabel}>Color — <strong style={{color:"#1a1a1a",fontWeight:500}}>{COLOR_NAMES[selectedColor]}</strong></p>
          <div style={{display:"flex",gap:10}}>
            {COLORS.map((c,i) => (
              <button key={i} title={COLOR_NAMES[i]} style={{...S.swatch,background:c,outline:i===selectedColor?"2.5px solid #1a1a1a":"2px solid transparent",outlineOffset:3}}
                onClick={()=>setSelectedColor(i)} />
            ))}
          </div>
        </div>

        <div style={S.optionSec}>
          <p style={S.optLabel}>Size — <strong style={{color:"#1a1a1a",fontWeight:500}}>{selectedSize}</strong></p>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {SIZES.map(s => (
              <button key={s} style={{...S.sizeBtn,background:s===selectedSize?"#1a1a1a":"white",color:s===selectedSize?"white":"#1a1a1a",borderColor:s===selectedSize?"#1a1a1a":"#d8d4ce"}}
                onClick={()=>setSelectedSize(s)}>{s}</button>
            ))}
          </div>
        </div>
        <div style={S.divider} />

        <div style={S.qtyRow}>
          <p style={S.optLabel}>Quantity</p>
          <div style={S.qtyCtrl}>
            <button style={S.qtyBtn} onClick={()=>setQty(q=>Math.max(1,q-1))}>−</button>
            <span style={S.qtyVal}>{qty}</span>
            <button style={S.qtyBtn} onClick={()=>setQty(q=>q+1)}>+</button>
          </div>
        </div>

        <div style={S.ctaRow}>
          <button style={S.cartBtn} onClick={handleAddToCart}>
            {addedToCart ? <><CheckIcon/> Added!</> : <><CartIcon/> Add to Cart</>}
          </button>
          <button style={{...S.wishBtn,color:wishlisted?"#c9a96e":"#999"}} onClick={()=>setWishlisted(w=>!w)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlisted?"#c9a96e":"none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
        </div>
        <button style={S.buyNow}>Buy Now</button>
        <div style={S.divider} />

        <div style={S.pills}>
          {["Free Returns","Authentic Product","Secure Checkout","Gift Wrap"].map(f=>(
            <span key={f} style={S.pill}>{f}</span>
          ))}
        </div>

        <details style={S.det}><summary style={S.detSum}>Product Details</summary>
          <p style={S.detBody}>Hand-thrown on a traditional potter's wheel using locally sourced stoneware clay. Fired at 1280°C. Dimensions: 28cm × 14cm. Food-safe glaze. Dishwasher safe.</p>
        </details>
        <details style={S.det}><summary style={S.detSum}>Shipping & Returns</summary>
          <p style={S.detBody}>Ships within 3–5 business days. Free standard shipping over $150. Returns accepted within 30 days.</p>
        </details>
      </div>
    </div>
  );
}

/* ── Icon components ── */
const Btn = ({onClick,title,active,children}) => (
  <button style={{...S.iconBtn,color:active?"#c9a96e":"#555"}} onClick={onClick} title={title}>{children}</button>
);
const PlusIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>;
const MinusIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="8" y1="11" x2="14" y2="11"/></svg>;
const ResetIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>;
const SpinIcon = ({size=16}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-9-9"/><polyline points="21 3 21 9 15 9"/></svg>;
const ArrowIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:4,verticalAlign:"middle"}}><path d="M5 9l-3 3 3 3"/><path d="M19 9l3 3-3 3"/><line x1="2" y1="12" x2="22" y2="12"/></svg>;
const CheckIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>;
const CartIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>;

/* ── Styles ── */
const S = {
  page:{display:"flex",gap:40,padding:32,maxWidth:1100,margin:"0 auto",fontFamily:"'DM Sans','Segoe UI',sans-serif",background:"#faf9f7",minHeight:"100vh",flexWrap:"wrap"},
  viewerCol:{flex:"1 1 420px",display:"flex",flexDirection:"column",gap:12},
  stage:{position:"relative",width:"100%",aspectRatio:"1/1",background:"#f2ede6",borderRadius:20,overflow:"hidden",userSelect:"none",touchAction:"none",transformStyle:"preserve-3d",willChange:"transform",transition:"transform 0.05s linear"},
  canvas:{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"},
  controls:{position:"absolute",top:12,right:12,display:"flex",flexDirection:"column",gap:4,background:"rgba(255,255,255,0.85)",backdropFilter:"blur(6px)",borderRadius:12,padding:"6px 4px",border:"0.5px solid #e0dbd4"},
  iconBtn:{width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",background:"none",border:"none",cursor:"pointer",borderRadius:8,transition:"background 0.15s"},
  badge360:{position:"absolute",top:12,left:12,background:"rgba(255,255,255,0.85)",backdropFilter:"blur(6px)",borderRadius:20,padding:"4px 10px",display:"flex",alignItems:"center",gap:5,fontSize:12,fontWeight:500,color:"#555",border:"0.5px solid #e0dbd4"},
  frameBar:{position:"absolute",bottom:12,left:"50%",transform:"translateX(-50%)",display:"flex",gap:5,flexWrap:"wrap",justifyContent:"center",maxWidth:"80%"},
  dot:{width:6,height:6,borderRadius:"50%",cursor:"pointer",transition:"background 0.2s"},
  hint:{textAlign:"center",fontSize:12,color:"#a09890",margin:0,display:"flex",alignItems:"center",justifyContent:"center"},
  thumbStrip:{display:"flex",gap:8,flexWrap:"wrap"},
  thumb:{width:68,height:68,borderRadius:10,overflow:"hidden",cursor:"pointer",background:"#ede8e0",border:"none",padding:0,outlineOffset:3,flexShrink:0},
  addThumb:{display:"flex",alignItems:"center",justifyContent:"center",border:"1.5px dashed #c5bfb7",background:"transparent",cursor:"pointer",outline:"none"},
  infoCol:{flex:"1 1 340px",display:"flex",flexDirection:"column",gap:0,maxWidth:480},
  breadcrumb:{fontSize:12,color:"#a09890",marginBottom:12,marginTop:0},
  title:{fontSize:28,fontWeight:600,color:"#1a1a1a",margin:"0 0 4px",letterSpacing:"-0.5px",lineHeight:1.2},
  subtitle:{fontSize:13,color:"#a09890",margin:"0 0 12px",letterSpacing:0.5,textTransform:"uppercase"},
  ratingRow:{display:"flex",alignItems:"center",gap:3,marginBottom:14},
  reviewCount:{fontSize:13,color:"#a09890",marginLeft:6},
  priceRow:{display:"flex",alignItems:"baseline",gap:10,marginBottom:4},
  price:{fontSize:28,fontWeight:600,color:"#1a1a1a"},
  origPrice:{fontSize:16,color:"#b0a99e",textDecoration:"line-through"},
  discBadge:{fontSize:12,fontWeight:600,background:"#f0f7eb",color:"#4a7c2c",padding:"3px 8px",borderRadius:20,letterSpacing:0.3},
  taxNote:{fontSize:12,color:"#a09890",margin:"0 0 16px"},
  divider:{height:1,background:"#ede8e0",margin:"16px 0"},
  optionSec:{marginBottom:16},
  optLabel:{fontSize:13,color:"#a09890",margin:"0 0 10px",fontWeight:400},
  swatch:{width:28,height:28,borderRadius:"50%",cursor:"pointer",border:"none",outlineOffset:3,transition:"outline 0.15s"},
  sizeBtn:{width:46,height:40,borderRadius:8,fontSize:13,fontWeight:500,cursor:"pointer",border:"1px solid",transition:"all 0.15s",letterSpacing:0.3},
  qtyRow:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16},
  qtyCtrl:{display:"flex",alignItems:"center",gap:0,border:"1px solid #d8d4ce",borderRadius:10,overflow:"hidden"},
  qtyBtn:{width:36,height:36,background:"none",border:"none",fontSize:18,cursor:"pointer",color:"#1a1a1a",display:"flex",alignItems:"center",justifyContent:"center"},
  qtyVal:{width:40,textAlign:"center",fontSize:14,fontWeight:500,borderLeft:"1px solid #ede8e0",borderRight:"1px solid #ede8e0",lineHeight:"36px"},
  ctaRow:{display:"flex",gap:10,marginBottom:10},
  cartBtn:{flex:1,height:48,background:"#1a1a1a",color:"white",border:"none",borderRadius:12,fontSize:14,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,letterSpacing:0.3,transition:"background 0.2s"},
  wishBtn:{width:48,height:48,background:"white",border:"1px solid #d8d4ce",borderRadius:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s",flexShrink:0},
  buyNow:{width:"100%",height:48,background:"white",color:"#1a1a1a",border:"1.5px solid #1a1a1a",borderRadius:12,fontSize:14,fontWeight:600,cursor:"pointer",letterSpacing:0.3,transition:"all 0.2s",marginBottom:16},
  pills:{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16},
  pill:{fontSize:11,fontWeight:500,background:"#f2ede6",color:"#7a6f63",padding:"5px 12px",borderRadius:20,letterSpacing:0.2},
  det:{borderTop:"1px solid #ede8e0",padding:"12px 0"},
  detSum:{fontSize:13,fontWeight:500,color:"#1a1a1a",cursor:"pointer",listStyle:"none",display:"flex",justifyContent:"space-between",userSelect:"none"},
  detBody:{fontSize:13,color:"#6b6056",lineHeight:1.7,margin:"10px 0 4px"},
};