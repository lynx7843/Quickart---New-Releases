import { useState, useEffect, useRef } from "react";

const C = {
  deep:       "#024f59",
  deepDark:   "#013840",
  deepLight:  "#035f6b",
  mid:        "#557a8c",
  midLight:   "#6a95a8",
  midDark:    "#3f6070",
  bg:         "#f4f6fa",
  bgCard:     "#ffffff",
  bgMuted:    "#eef1f7",
  accent:     "#0da89c",
  accentGlow: "#0da89c22",
  text:       "#0e2a30",
  textMid:    "#3a5a64",
  textMuted:  "#7a99a4",
  border:     "#dde5ee",
  success:    "#0fba7a",
  warning:    "#f59e0b",
  danger:     "#e84a5f",
  info:       "#3b9aca",
  white:      "#ffffff",
};

const CHART_DATA = {
  revenue: [42, 58, 51, 67, 73, 61, 88, 94, 78, 102, 91, 115],
  orders:  [12, 18, 14, 22, 19, 25, 31, 28, 35, 40, 33, 47],
  labels:  ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
};

const PRODUCTS = [
  { id: 1, name: "Wireless Earbuds Pro", sku: "AUD-001", category: "Audio", price: 24500, stock: 142, status: "Active", rating: 4.5, sales: 312 },
  { id: 2, name: "Smart Watch Elite", sku: "WBL-002", category: "Wearables", price: 61000, stock: 38, status: "Low Stock", rating: 4.3, sales: 187 },
  { id: 3, name: "Camera Lens 85mm", sku: "PHO-003", category: "Photography", price: 137500, stock: 0, status: "Out of Stock", rating: 4.7, sales: 94 },
  { id: 4, name: "Gaming Laptop X15", sku: "ELC-004", category: "Electronics", price: 289000, stock: 21, status: "Active", rating: 4.8, sales: 523 },
  { id: 5, name: "Noise Cancel Headset", sku: "AUD-005", category: "Audio", price: 18900, stock: 205, status: "Active", rating: 4.2, sales: 441 },
  { id: 6, name: "Drone Phantom V3", sku: "PHO-006", category: "Photography", price: 175000, stock: 14, status: "Low Stock", rating: 4.6, sales: 67 },
];

const ORDERS = [
  { id: "#ORD-2841", customer: "Amara Perera", amount: 61000, status: "Delivered", date: "Mar 20, 2026", items: 2 },
  { id: "#ORD-2840", customer: "Kasun Jayawardena", amount: 289000, status: "Processing", date: "Mar 20, 2026", items: 1 },
  { id: "#ORD-2839", customer: "Dilnoza Rahman", amount: 43400, status: "Shipped", date: "Mar 19, 2026", items: 3 },
  { id: "#ORD-2838", customer: "Thabo Nkosi", amount: 137500, status: "Pending", date: "Mar 19, 2026", items: 1 },
  { id: "#ORD-2837", customer: "Mei Lan", amount: 24500, status: "Delivered", date: "Mar 18, 2026", items: 2 },
];

const CATEGORIES = [
  { id: "electronics", label: "Electronics", icon: "💻", color: "#3b9aca", products: 48, revenue: "LKR 2.4M" },
  { id: "audio",       label: "Audio",       icon: "🎧", color: "#0fba7a", products: 32, revenue: "LKR 1.1M" },
  { id: "wearables",   label: "Wearables",   icon: "⌚", color: "#8b5cf6", products: 19, revenue: "LKR 890K" },
  { id: "photography", label: "Photography", icon: "📷", color: "#f59e0b", products: 27, revenue: "LKR 1.8M" },
  { id: "fashion",     label: "Fashion",     icon: "👗", color: "#e84a5f", products: 61, revenue: "LKR 640K" },
];

const NAV = [
  { id: "dashboard",  icon: "⬡",  label: "Dashboard"  },
  { id: "products",   icon: "◈",  label: "Products"   },
  { id: "categories", icon: "◉",  label: "Categories" },
  { id: "orders",     icon: "◷",  label: "Orders",   badge: 5 },
  { id: "customers",  icon: "◎",  label: "Customers"  },
  { id: "analytics",  icon: "◈",  label: "Analytics"  },
  { id: "settings",   icon: "◌",  label: "Settings"   },
];

function StatusBadge({ status }) {
  const map = {
    "Active":       { bg: "#dcfce7", color: "#15803d" },
    "Low Stock":    { bg: "#fef3c7", color: "#b45309" },
    "Out of Stock": { bg: "#fee2e2", color: "#b91c1c" },
    "Draft":        { bg: "#f3f4f6", color: "#374151" },
    "Delivered":    { bg: "#dcfce7", color: "#15803d" },
    "Processing":   { bg: "#dbeafe", color: "#1d4ed8" },
    "Shipped":      { bg: "#ede9fe", color: "#6d28d9" },
    "Pending":      { bg: "#fef3c7", color: "#b45309" },
  };
  const s = map[status] || map["Draft"];
  return (
    <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color, letterSpacing: "0.3px" }}>
      {status}



    </span>
  );
}

function Sparkline({ data, color, h = 40 }) {
  const max = Math.max(...data), min = Math.min(...data);
  const norm = v => h - ((v - min) / (max - min || 1)) * h;
  const w = 120;
  const step = w / (data.length - 1);
  const pts = data.map((v, i) => `${i * step},${norm(v)}`).join(" ");
  const area = `${pts} ${(data.length-1)*step},${h} 0,${h}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: 120, height: h, overflow: "visible" }}>
      <defs>
        <linearGradient id={`sg${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#sg${color.replace("#","")})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={(data.length-1)*step} cy={norm(data[data.length-1])} r="3" fill={color}/>
    </svg>
  );
}

function BarChart({ data, labels, color }) {
  const max = Math.max(...data);
  const [hovered, setHovered] = useState(null);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 140, paddingTop: 10 }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}
          onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
          {hovered === i && (
            <div style={{ fontSize: 10, fontWeight: 800, color: C.text, background: C.bgCard, border: `1px solid ${C.border}`, padding: "2px 6px", borderRadius: 4, whiteSpace: "nowrap", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>{v}</div>
          )}
          <div style={{ width: "100%", borderRadius: "4px 4px 0 0", background: hovered === i ? color : `${color}88`, height: `${(v / max) * 110}px`, transition: "all 0.2s", minHeight: 4 }}/>
          <div style={{ fontSize: 9, color: C.textMuted, fontWeight: 600 }}>{labels[i]}</div>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ segments }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  let cum = 0;
  const r = 52, cx = 60, cy = 60, stroke = 16;
  const circ = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 120 120" style={{ width: 120, height: 120 }}>
      {segments.map((seg, i) => {
        const pct = seg.value / total;
        const off = circ * (1 - pct);
        const rotate = (cum / total) * 360 - 90;
        cum += seg.value;
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth={stroke}
            strokeDasharray={`${circ * pct} ${circ * (1 - pct)}`} strokeDashoffset={0}
            style={{ transformOrigin: `${cx}px ${cy}px`, transform: `rotate(${rotate}deg)`, transition: "stroke-dasharray 0.5s ease" }}
          />
        );
      })}
      <text x={cx} y={cy - 6} textAnchor="middle" style={{ fontSize: 14, fontWeight: 800, fill: C.text }}>
        {total.toLocaleString()}
      </text>
      <text x={cx} y={cx + 10} textAnchor="middle" style={{ fontSize: 8, fill: C.textMuted }}>Total Sales</text>
    </svg>
  );
}

function StatCard({ icon, label, value, change, color, spark }) {
  const pos = change >= 0;
  return (
    <div style={{ background: C.bgCard, borderRadius: 16, padding: "22px 24px", border: `1px solid ${C.border}`, position: "relative", overflow: "hidden", boxShadow: "0 2px 12px rgba(2,79,89,0.06)", transition: "transform 0.2s, box-shadow 0.2s", cursor: "default" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(2,79,89,0.13)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(2,79,89,0.06)"; }}>
      <div style={{ position: "absolute", top: -20, right: -20, width: 90, height: 90, borderRadius: "50%", background: `${color}18` }}/>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 12 }}>{icon}</div>
          <div style={{ fontSize: 12, color: C.textMuted, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: C.text, letterSpacing: "-0.5px" }}>{value}</div>
          <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: pos ? C.success : C.danger }}>{pos ? "↑" : "↓"} {Math.abs(change)}%</span>
            <span style={{ fontSize: 11, color: C.textMuted }}>vs last month</span>
          </div>
        </div>
        {spark && <Sparkline data={spark} color={color} />}
      </div>
    </div>
  );
}

// ─── Add Product Panel ────────────────────────────────────────────────────────
const BRANDS = ["SoundWave","TechGear","OptiCraft","MechPro","Samsung","Sony","Apple","LG","Canon"];
const TYPES  = ["Audio","Wearable","Lens","Peripheral","Gaming","Fashion","Accessories","Smart Home"];

function AddProductPanel({ onClose, onAdd, categories }) {
  const [form, setForm] = useState({ name: "", type: "", brand: "", category: "", price: "", stock: "", description: "", status: "Active", tags: "" });
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const inputRef = useRef();

  const validate = () => {
    const e = {};
    if (!form.name) e.name = "Required";
    if (!form.price) e.price = "Required";
    if (!form.category) e.category = "Required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const cat = categories.find(c => c.label === form.category);
    onAdd({ ...form, id: Date.now(), price: +form.price, stock: +form.stock, category: cat?.id || "", rating: 0, reviews: 0, orig: +form.price*1.2, badge: "NEW", color: cat?.color || "#557a8c", emoji: cat?.icon || "📦", imgs: [images[0]?.url || "https://via.placeholder.com/150"], colors: ["#000"], specs: ["New"], sub: form.type });
    onClose();
  };

  const Field = ({ label, name, type="text", placeholder, options, required }) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.textMid, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {label}{required && <span style={{ color: C.danger }}> *</span>}
      </label>
      {options ? (
        <select value={form[name]} onChange={e => setForm(p => ({...p,[name]:e.target.value}))} style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:`1.5px solid ${errors[name]?C.danger:C.border}`, fontSize:14, background:C.bgCard, outline:"none", color:C.text, cursor:"pointer" }}>
          <option value="">Select {label}</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : type === "textarea" ? (
        <textarea value={form[name]} onChange={e => setForm(p=>({...p,[name]:e.target.value}))} placeholder={placeholder} rows={4} style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:`1.5px solid ${errors[name]?C.danger:C.border}`, fontSize:14, outline:"none", resize:"vertical", fontFamily:"inherit", boxSizing:"border-box" }}/>
      ) : (
        <input type={type} value={form[name]} onChange={e=>setForm(p=>({...p,[name]:e.target.value}))} placeholder={placeholder} style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:`1.5px solid ${errors[name]?C.danger:C.border}`, fontSize:14, outline:"none", boxSizing:"border-box" }}/>
      )}
      {errors[name] && <div style={{ fontSize:11, color:C.danger, marginTop:3 }}>{errors[name]}</div>}
    </div>
  );

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(2,79,89,0.45)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"flex-end" }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ width:560, height:"100vh", background:C.bgCard, boxShadow:"-12px 0 48px rgba(2,79,89,0.2)", display:"flex", flexDirection:"column", animation:"slideIn 0.3s cubic-bezier(0.16,1,0.3,1)" }}>
        <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>
        <div style={{ padding:"24px 28px", borderBottom:`1px solid ${C.border}`, background:`linear-gradient(135deg, ${C.deep}, ${C.deepLight})`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:18, fontWeight:800, color:C.white }}>Add New Product</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.6)", marginTop:2 }}>Step {step} of 3 — {["Basic Info","Details","Images"][step-1]}</div>
          </div>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:8, border:"none", background:"rgba(255,255,255,0.15)", color:"#fff", cursor:"pointer", fontSize:14 }}>✕</button>
        </div>

        <div style={{ display:"flex", padding:"0 28px", borderBottom:`1px solid ${C.border}`, gap:0, background:C.bg }}>
          {["Basic Info","Details","Images"].map((l,i) => (
            <div key={l} onClick={()=>setStep(i+1)} style={{ flex:1, padding:"14px 0", display:"flex", flexDirection:"column", alignItems:"center", gap:4, cursor:"pointer", borderBottom:`3px solid ${step===i+1?C.deep:"transparent"}`, transition:"border 0.2s" }}>
              <div style={{ width:24, height:24, borderRadius:"50%", background:step>i?C.deep:step===i+1?C.deep:C.border, color:step>=i+1?"#fff":C.textMuted, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800 }}>{step>i+1?"✓":i+1}</div>
              <span style={{ fontSize:11, fontWeight:600, color:step===i+1?C.deep:C.textMuted }}>{l}</span>
            </div>
          ))}
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:"24px 28px" }}>
          {step===1 && <>
            <Field label="Product Name" name="name" placeholder="e.g. Wireless Earbuds Pro" required/>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <Field label="Category" name="category" options={categories.map(c=>c.label)} required/>
              <Field label="Product Type" name="type" options={TYPES}/>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <Field label="Brand" name="brand" options={BRANDS}/>
              <Field label="Status" name="status" options={["Active","Draft","Out of Stock"]}/>
            </div>
            <Field label="Tags" name="tags" placeholder="wireless, audio, premium"/>
          </>}
          {step===2 && <>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <Field label="Price (LKR)" name="price" type="number" placeholder="0.00" required/>
              <Field label="Stock Qty" name="stock" type="number" placeholder="0"/>
            </div>
            <Field label="Description" name="description" type="textarea" placeholder="Product features, specs, benefits..."/>
            {form.price && <div style={{ background:`linear-gradient(135deg,#f0fdf4,#dcfce7)`, borderRadius:12, padding:16, border:`1px solid #bbf7d0`, marginTop:4 }}>
              <div style={{ fontSize:11, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:8 }}>Pricing Preview</div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:13 }}><span style={{ color:C.textMuted }}>Base Price</span><span style={{ fontWeight:800 }}>LKR {(+form.price).toLocaleString()}</span></div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginTop:6 }}><span style={{ color:C.textMuted }}>After 10% off</span><span style={{ fontWeight:800, color:C.success }}>LKR {(+form.price*0.9).toLocaleString()}</span></div>
            </div>}
          </>}
          {step===3 && <>
            <div style={{ border:`2px dashed ${C.border}`, borderRadius:14, padding:"32px 20px", textAlign:"center", cursor:"pointer", background:C.bg }} onClick={()=>inputRef.current.click()}>
              <div style={{ fontSize:36, marginBottom:8 }}>🖼️</div>
              <div style={{ fontWeight:700, color:C.text, marginBottom:4 }}>Drop images here or click to upload</div>
              <div style={{ fontSize:12, color:C.textMuted }}>PNG, JPG, WEBP up to 10MB</div>
              <input ref={inputRef} type="file" multiple accept="image/*" style={{ display:"none" }} onChange={e=>{ const files=Array.from(e.target.files); setImages(p=>[...p,...files.map(f=>({id:Math.random().toString(36).slice(2),url:URL.createObjectURL(f),name:f.name}))]); }}/>
            </div>
            {images.length>0 && <div style={{ display:"flex", gap:10, marginTop:12, flexWrap:"wrap" }}>
              {images.map((img,i)=>(
                <div key={img.id} style={{ position:"relative" }}>
                  <div style={{ width:76, height:76, borderRadius:10, overflow:"hidden", border:`2px solid ${i===0?C.deep:C.border}` }}>
                    <img src={img.url} alt={img.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                  </div>
                  <button onClick={()=>setImages(p=>p.filter(x=>x.id!==img.id))} style={{ position:"absolute", top:-6, right:-6, width:18, height:18, borderRadius:"50%", background:C.danger, color:"#fff", border:"none", cursor:"pointer", fontSize:10, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
                </div>
              ))}
            </div>}
          </>}
        </div>

        <div style={{ padding:"16px 28px", borderTop:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", background:C.bg }}>
          <button onClick={()=>step>1?setStep(s=>s-1):onClose()} style={{ padding:"10px 22px", borderRadius:10, border:`1.5px solid ${C.border}`, background:C.bgCard, cursor:"pointer", fontWeight:600, fontSize:13, color:C.textMid }}>
            {step>1?"← Back":"Cancel"}
          </button>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={()=>setForm(f=>({...f,status:"Draft"}))} style={{ padding:"10px 20px", borderRadius:10, border:`1.5px solid ${C.border}`, background:C.bgCard, cursor:"pointer", fontWeight:600, fontSize:13, color:C.textMuted }}>Save Draft</button>
            {step<3 ? (
              <button onClick={()=>setStep(s=>s+1)} style={{ padding:"10px 24px", borderRadius:10, border:"none", background:`linear-gradient(135deg,${C.deep},${C.deepLight})`, color:"#fff", cursor:"pointer", fontWeight:700, fontSize:13 }}>Continue →</button>
            ) : (
              <button onClick={handleSubmit} style={{ padding:"10px 24px", borderRadius:10, border:"none", background:`linear-gradient(135deg,${C.deep},${C.deepLight})`, color:"#fff", cursor:"pointer", fontWeight:700, fontSize:13 }}>🚀 Publish</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Add Category Modal ───────────────────────────────────────────────────────
function AddCategoryModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ label:"", icon:"📦", color:C.deep, description:"", featured:false });
  const ICONS = ["📦","⚡","📸","💻","👟","👗","🏠","🎮","🎵","💄","🌿","🚗","⌚","📱","🎒"];
  const PALETTE = [C.deep,"#3b9aca","#8b5cf6","#0fba7a","#e84a5f","#f59e0b","#06b6d4","#ec4899"];

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(2,79,89,0.45)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ width:460, background:C.bgCard, borderRadius:20, overflow:"hidden", boxShadow:"0 24px 64px rgba(2,79,89,0.25)", animation:"fadeUp 0.3s cubic-bezier(0.16,1,0.3,1)" }}>
        <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
        <div style={{ background:`linear-gradient(135deg,${C.deep},${C.deepLight})`, padding:"20px 24px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontSize:16, fontWeight:800, color:C.white }}>Create New Category</div>
          <button onClick={onClose} style={{ width:30, height:30, borderRadius:8, border:"none", background:"rgba(255,255,255,0.15)", color:"#fff", cursor:"pointer" }}>✕</button>
        </div>
        <div style={{ padding:24 }}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:20 }}>
            <div style={{ width:80, height:80, borderRadius:20, background:`${form.color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:40, border:`2px solid ${form.color}`, transition:"all 0.3s" }}>{form.icon}</div>
          </div>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:12, fontWeight:700, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.5px", color:C.textMid }}>Category Name *</label>
            <input value={form.label} onChange={e=>setForm(p=>({...p,label:e.target.value}))} placeholder="e.g. Electronics" style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:`1.5px solid ${C.border}`, fontSize:14, outline:"none", boxSizing:"border-box" }}/>
          </div>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:12, fontWeight:700, display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.5px", color:C.textMid }}>Icon</label>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {ICONS.map(ic=><button key={ic} onClick={()=>setForm(p=>({...p,icon:ic}))} style={{ width:38, height:38, borderRadius:8, border:`2px solid ${form.icon===ic?form.color:C.border}`, background:form.icon===ic?`${form.color}14`:"#fff", cursor:"pointer", fontSize:18 }}>{ic}</button>)}
            </div>
          </div>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:12, fontWeight:700, display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.5px", color:C.textMid }}>Color</label>
            <div style={{ display:"flex", gap:8 }}>
              {PALETTE.map(c=><div key={c} onClick={()=>setForm(p=>({...p,color:c}))} style={{ width:30, height:30, borderRadius:8, background:c, cursor:"pointer", border:`3px solid ${form.color===c?C.text:"transparent"}`, boxSizing:"border-box", transition:"border 0.15s" }}/>)}
            </div>
          </div>
          <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:12, fontWeight:700, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.5px", color:C.textMid }}>Description</label>
            <textarea value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} placeholder="Short description..." rows={2} style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:`1.5px solid ${C.border}`, fontSize:14, outline:"none", resize:"none", fontFamily:"inherit", boxSizing:"border-box" }}/>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={onClose} style={{ flex:1, padding:12, borderRadius:10, border:`1.5px solid ${C.border}`, background:"#fff", cursor:"pointer", fontWeight:600, color:C.textMid }}>Cancel</button>
            <button onClick={()=>{ if(form.label){ onAdd({...form,id:form.label.toLowerCase().replace(/\s+/g,'-'),sub:[],products:0,revenue:"LKR 0"}); onClose(); }}} style={{ flex:2, padding:12, borderRadius:10, border:"none", background:`linear-gradient(135deg,${C.deep},${C.deepLight})`, color:"#fff", cursor:"pointer", fontWeight:700, fontSize:14 }}>✓ Create Category</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard View ───────────────────────────────────────────────────────────
function DashboardView() {
  const stats = [
    { icon:"💰", label:"Total Revenue", value:"LKR 6.4M", change:12.4, color:C.deep, spark:[42,58,51,67,73,61,88,94,78,102] },
    { icon:"🛒", label:"Orders Today", value:"284", change:8.2, color:"#3b9aca", spark:[12,18,14,22,19,25,31,28,35,40] },
    { icon:"👥", label:"Active Customers", value:"1,842", change:5.7, color:C.success, spark:[300,320,310,340,360,350,380,400,390,420] },
    { icon:"📦", label:"Products Listed", value:"187", change:-2.1, color:"#8b5cf6", spark:[170,175,172,178,180,182,179,184,186,187] },
  ];

  const topProducts = PRODUCTS.slice(0,5);

  return (
    <div>
      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:18, marginBottom:24 }}>
        {stats.map(s=><StatCard key={s.label} {...s}/>)}
      </div>

      {/* Charts Row */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1.2fr", gap:18, marginBottom:24 }}>
        {/* Revenue Bar */}
        <div style={{ background:C.bgCard, borderRadius:16, padding:24, border:`1px solid ${C.border}`, boxShadow:"0 2px 12px rgba(2,79,89,0.05)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
            <div style={{ fontSize:14, fontWeight:800, color:C.text }}>Revenue</div>
            <span style={{ fontSize:11, color:C.success, fontWeight:700, background:"#dcfce7", padding:"2px 8px", borderRadius:10 }}>↑ 12.4%</span>
          </div>
          <div style={{ fontSize:11, color:C.textMuted, marginBottom:12 }}>Monthly overview — 2026</div>
          <BarChart data={CHART_DATA.revenue} labels={CHART_DATA.labels} color={C.deep}/>
        </div>

        {/* Orders Bar */}
        <div style={{ background:C.bgCard, borderRadius:16, padding:24, border:`1px solid ${C.border}`, boxShadow:"0 2px 12px rgba(2,79,89,0.05)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
            <div style={{ fontSize:14, fontWeight:800, color:C.text }}>Orders</div>
            <span style={{ fontSize:11, color:C.info, fontWeight:700, background:"#dbeafe", padding:"2px 8px", borderRadius:10 }}>↑ 8.2%</span>
          </div>
          <div style={{ fontSize:11, color:C.textMuted, marginBottom:12 }}>Monthly orders trend</div>
          <BarChart data={CHART_DATA.orders} labels={CHART_DATA.labels} color="#3b9aca"/>
        </div>

        {/* Category Donut */}
        <div style={{ background:C.bgCard, borderRadius:16, padding:24, border:`1px solid ${C.border}`, boxShadow:"0 2px 12px rgba(2,79,89,0.05)" }}>
          <div style={{ fontSize:14, fontWeight:800, color:C.text, marginBottom:4 }}>Sales by Category</div>
          <div style={{ fontSize:11, color:C.textMuted, marginBottom:16 }}>Distribution breakdown</div>
          <div style={{ display:"flex", alignItems:"center", gap:20 }}>
            <DonutChart segments={[
              { value:523, color:C.deep },
              { value:441, color:"#3b9aca" },
              { value:312, color:C.success },
              { value:187, color:"#8b5cf6" },
              { value:94,  color:C.warning },
            ]}/>
            <div style={{ flex:1 }}>
              {[["Electronics",523,C.deep],["Audio",441,"#3b9aca"],["Wearables",312,C.success],["Fashion",187,"#8b5cf6"],["Photography",94,C.warning]].map(([l,v,c])=>(
                <div key={l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:c, flexShrink:0 }}/>
                    <span style={{ fontSize:11, color:C.textMid, fontWeight:600 }}>{l}</span>
                  </div>
                  <span style={{ fontSize:11, fontWeight:800, color:C.text }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr", gap:18 }}>
        {/* Recent Orders */}
        <div style={{ background:C.bgCard, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", boxShadow:"0 2px 12px rgba(2,79,89,0.05)" }}>
          <div style={{ padding:"18px 24px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontSize:14, fontWeight:800, color:C.text }}>Recent Orders</div>
            <span style={{ fontSize:12, color:C.mid, fontWeight:600, cursor:"pointer" }}>View all →</span>
          </div>
          {ORDERS.map((o,i)=>(
            <div key={o.id} style={{ padding:"14px 24px", borderBottom:i<ORDERS.length-1?`1px solid ${C.border}`:"none", display:"flex", alignItems:"center", gap:16 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:`${C.deep}14`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>🛒</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:700, color:C.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{o.customer}</div>
                <div style={{ fontSize:11, color:C.textMuted }}>{o.id} · {o.items} item{o.items>1?"s":""}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:13, fontWeight:800, color:C.text }}>LKR {o.amount.toLocaleString()}</div>
                <StatusBadge status={o.status}/>
              </div>
            </div>
          ))}
        </div>

        {/* Top Products */}
        <div style={{ background:C.bgCard, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", boxShadow:"0 2px 12px rgba(2,79,89,0.05)" }}>
          <div style={{ padding:"18px 24px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontSize:14, fontWeight:800, color:C.text }}>Top Products</div>
            <span style={{ fontSize:12, color:C.mid, fontWeight:600, cursor:"pointer" }}>View all →</span>
          </div>
          {topProducts.map((p,i)=>{
            const maxSales = Math.max(...PRODUCTS.map(x=>x.sales));
            return (
              <div key={p.id} style={{ padding:"12px 24px", borderBottom:i<topProducts.length-1?`1px solid ${C.border}`:"none" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                  <span style={{ fontSize:11, color:C.textMuted, fontWeight:700, width:14 }}>#{i+1}</span>
                  <span style={{ fontSize:13, fontWeight:700, color:C.text, flex:1 }}>{p.name}</span>
                  <span style={{ fontSize:12, fontWeight:800, color:C.text }}>{p.sales}</span>
                </div>
                <div style={{ marginLeft:24, height:4, borderRadius:4, background:C.bgMuted, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${(p.sales/maxSales)*100}%`, background:`linear-gradient(90deg,${C.deep},${C.midLight})`, borderRadius:4, transition:"width 0.5s ease" }}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Products View ────────────────────────────────────────────────────────────
function ProductsView({ products, setProducts, onAddProduct }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [filter, setFilter] = useState("All");
  const categories = ["All","Electronics","Audio","Wearables","Photography","Fashion"];

  const filtered = products.filter(p =>
    (filter==="All" || p.category===filter.toLowerCase()) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleSelect = id => setSelected(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id]);
  const selectAll = () => setSelected(filtered.length===selected.length ? [] : filtered.map(p=>p.id));

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", top:"50%", transform:"translateY(-50%)", left:12, color:C.textMuted, fontSize:14 }}>🔍</span>
            <input placeholder="Search products..." value={search} onChange={e=>setSearch(e.target.value)} style={{ padding:"9px 14px 9px 36px", borderRadius:10, border:`1.5px solid ${C.border}`, fontSize:13, outline:"none", width:240, color:C.text }}/>
          </div>
          {categories.map(c=>(
            <button key={c} onClick={()=>setFilter(c)} style={{ padding:"8px 14px", borderRadius:10, border:`1.5px solid ${filter===c?C.deep:C.border}`, background:filter===c?`${C.deep}14`:"#fff", color:filter===c?C.deep:C.textMid, cursor:"pointer", fontWeight:filter===c?700:500, fontSize:12, transition:"all 0.15s" }}>{c}</button>
          ))}
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          {selected.length>0 && (
            <button onClick={()=>{ setProducts(p=>p.filter(x=>!selected.includes(x.id))); setSelected([]); }} style={{ padding:"9px 16px", borderRadius:10, border:`1.5px solid ${C.danger}20`, background:`${C.danger}10`, color:C.danger, cursor:"pointer", fontWeight:700, fontSize:13 }}>🗑 Delete ({selected.length})</button>
          )}
          <button onClick={onAddProduct} style={{ padding:"9px 20px", borderRadius:10, border:"none", background:`linear-gradient(135deg,${C.deep},${C.deepLight})`, color:"#fff", cursor:"pointer", fontWeight:700, fontSize:13, display:"flex", alignItems:"center", gap:6, boxShadow:`0 4px 16px ${C.deep}40` }}>+ Add Product</button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background:C.bgCard, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", boxShadow:"0 2px 12px rgba(2,79,89,0.05)" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:C.bg }}>
              <th style={{ padding:"14px 16px", textAlign:"left", width:40 }}>
                <input type="checkbox" checked={selected.length===filtered.length && filtered.length>0} onChange={selectAll} style={{ cursor:"pointer", accentColor:C.deep }}/>
              </th>
              {["Product","Category","Price","Stock","Status","Rating","Actions"].map(h=>(
                <th key={h} style={{ padding:"14px 16px", textAlign:"left", fontSize:11, fontWeight:700, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.5px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p,i)=>(
              <tr key={p.id} style={{ borderTop:`1px solid ${C.border}`, background:selected.includes(p.id)?`${C.deep}06`:"transparent", transition:"background 0.15s" }}
                onMouseEnter={e=>{ if(!selected.includes(p.id)) e.currentTarget.style.background=C.bg; }}
                onMouseLeave={e=>{ if(!selected.includes(p.id)) e.currentTarget.style.background="transparent"; }}>
                <td style={{ padding:"14px 16px" }}>
                  <input type="checkbox" checked={selected.includes(p.id)} onChange={()=>toggleSelect(p.id)} style={{ cursor:"pointer", accentColor:C.deep }}/>
                </td>
                <td style={{ padding:"14px 16px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:40, height:40, borderRadius:10, background:`${p.color||C.mid}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{p.emoji||"📦"}</div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{p.name}</div>
                      <div style={{ fontSize:11, color:C.textMuted }}>{p.sku||`SKU-${p.id}`}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding:"14px 16px" }}><span style={{ fontSize:12, color:C.textMuted, textTransform:"capitalize" }}>{p.category}</span></td>
                <td style={{ padding:"14px 16px" }}><span style={{ fontSize:13, fontWeight:700, color:C.text }}>LKR {p.price.toLocaleString()}</span></td>
                <td style={{ padding:"14px 16px" }}>
                  <span style={{ fontSize:13, fontWeight:700, color:p.stock===0?C.danger:p.stock<30?C.warning:C.success }}>{p.stock===0?"Out":p.stock}</span>
                </td>
                <td style={{ padding:"14px 16px" }}><StatusBadge status={p.status}/></td>
                <td style={{ padding:"14px 16px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <span style={{ fontSize:12 }}>⭐</span>
                    <span style={{ fontSize:12, fontWeight:700, color:C.text }}>{p.rating}</span>
                  </div>
                </td>
                <td style={{ padding:"14px 16px" }}>
                  <div style={{ display:"flex", gap:6 }}>
                    <button style={{ padding:"5px 10px", borderRadius:7, border:`1px solid ${C.border}`, background:C.bgCard, cursor:"pointer", fontSize:12, color:C.textMid, fontWeight:600 }}>Edit</button>
                    <button onClick={()=>setProducts(prev=>prev.filter(x=>x.id!==p.id))} style={{ padding:"5px 10px", borderRadius:7, border:`1px solid ${C.danger}30`, background:`${C.danger}08`, cursor:"pointer", fontSize:12, color:C.danger, fontWeight:600 }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length===0 && <div style={{ padding:"40px", textAlign:"center", color:C.textMuted, fontSize:14 }}>No products found</div>}
      </div>
      <div style={{ marginTop:12, fontSize:12, color:C.textMuted, fontWeight:600 }}>Showing {filtered.length} of {products.length} products</div>
    </div>
  );
}

// ─── Categories View ──────────────────────────────────────────────────────────
function CategoriesView({ categories, setCategories, onAdd }) {
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:18 }}>
        <button onClick={onAdd} style={{ padding:"9px 20px", borderRadius:10, border:"none", background:`linear-gradient(135deg,${C.deep},${C.deepLight})`, color:"#fff", cursor:"pointer", fontWeight:700, fontSize:13, boxShadow:`0 4px 16px ${C.deep}40` }}>+ Add Category</button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:18 }}>
        {categories.map(cat=>(
          <div key={cat.id} style={{ background:C.bgCard, borderRadius:16, border:`1px solid ${C.border}`, padding:24, boxShadow:"0 2px 12px rgba(2,79,89,0.05)", transition:"transform 0.2s,box-shadow 0.2s", cursor:"default" }}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 12px 32px rgba(2,79,89,0.12)";}}
            onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 2px 12px rgba(2,79,89,0.05)";}}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
              <div style={{ width:56, height:56, borderRadius:16, background:`${cat.color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, border:`1px solid ${cat.color}30` }}>{cat.icon}</div>
              <div style={{ width:8, height:8, borderRadius:"50%", background:C.success }}/>
            </div>
            <div style={{ fontSize:16, fontWeight:800, color:C.text, marginBottom:4 }}>{cat.label}</div>
            <div style={{ fontSize:12, color:C.textMuted, marginBottom:16 }}>Category ID: {cat.id}</div>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontSize:10, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.5px", fontWeight:600, marginBottom:2 }}>Products</div>
                <div style={{ fontSize:18, fontWeight:800, color:C.text }}>{cat.products}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:10, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.5px", fontWeight:600, marginBottom:2 }}>Revenue</div>
                <div style={{ fontSize:14, fontWeight:800, color:C.deep }}>{cat.revenue}</div>
              </div>
            </div>
            <div style={{ marginTop:16, height:4, background:C.bgMuted, borderRadius:4, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${Math.min((cat.products/80)*100,100)}%`, background:`linear-gradient(90deg,${cat.color},${cat.color}88)`, borderRadius:4 }}/>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
}

// ─── Orders View ──────────────────────────────────────────────────────────────
function OrdersView() {
  const [tab, setTab] = useState("All");
  const tabs = ["All","Pending","Processing","Shipped","Delivered"];
  const filtered = tab==="All" ? ORDERS : ORDERS.filter(o=>o.status===tab);
  return (
    <div>
      <div style={{ display:"flex", gap:6, marginBottom:18 }}>
        {tabs.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{ padding:"8px 16px", borderRadius:10, border:`1.5px solid ${tab===t?C.deep:C.border}`, background:tab===t?`${C.deep}14`:"#fff", color:tab===t?C.deep:C.textMid, cursor:"pointer", fontWeight:tab===t?700:500, fontSize:12, transition:"all 0.15s" }}>{t}</button>
        ))}
      </div>
      <div style={{ background:C.bgCard, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", boxShadow:"0 2px 12px rgba(2,79,89,0.05)" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:C.bg }}>
              {["Order ID","Customer","Items","Amount","Status","Date","Actions"].map(h=>(
                <th key={h} style={{ padding:"14px 20px", textAlign:"left", fontSize:11, fontWeight:700, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.5px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((o,i)=>(
              <tr key={o.id} style={{ borderTop:`1px solid ${C.border}` }}
                onMouseEnter={e=>e.currentTarget.style.background=C.bg}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{ padding:"16px 20px" }}><span style={{ fontSize:13, fontWeight:700, color:C.deep }}>{o.id}</span></td>
                <td style={{ padding:"16px 20px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:34, height:34, borderRadius:10, background:`${C.mid}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>👤</div>
                    <span style={{ fontSize:13, fontWeight:600, color:C.text }}>{o.customer}</span>
                  </div>
                </td>
                <td style={{ padding:"16px 20px" }}><span style={{ fontSize:13, color:C.textMid }}>{o.items}</span></td>
                <td style={{ padding:"16px 20px" }}><span style={{ fontSize:13, fontWeight:800, color:C.text }}>LKR {o.amount.toLocaleString()}</span></td>
                <td style={{ padding:"16px 20px" }}><StatusBadge status={o.status}/></td>
                <td style={{ padding:"16px 20px" }}><span style={{ fontSize:12, color:C.textMuted }}>{o.date}</span></td>
                <td style={{ padding:"16px 20px" }}>
                  <button style={{ padding:"5px 12px", borderRadius:7, border:`1px solid ${C.border}`, background:"#fff", cursor:"pointer", fontSize:12, color:C.textMid, fontWeight:600 }}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length===0 && <div style={{ padding:40, textAlign:"center", color:C.textMuted }}>No orders found</div>}
      </div>
    </div>
  );
}

// ─── Analytics View ───────────────────────────────────────────────────────────
function AnalyticsView() {
  const kpis = [
    { label:"Conversion Rate", value:"3.42%", change:0.8,  color:C.deep,    icon:"📊" },
    { label:"Avg Order Value",  value:"LKR 68,400", change:5.2, color:"#3b9aca", icon:"💳" },
    { label:"Cart Abandon",     value:"62.3%",  change:-4.1, color:C.warning, icon:"🛒" },
    { label:"Return Rate",      value:"4.1%",   change:-1.2, color:C.success, icon:"↩️" },
  ];
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:18, marginBottom:24 }}>
        {kpis.map(k=><StatCard key={k.label} {...k} spark={[30,45,38,52,48,60,55,68,72,65]}/>)}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
        <div style={{ background:C.bgCard, borderRadius:16, padding:24, border:`1px solid ${C.border}`, boxShadow:"0 2px 12px rgba(2,79,89,0.05)" }}>
          <div style={{ fontSize:14, fontWeight:800, color:C.text, marginBottom:4 }}>Revenue Trend</div>
          <div style={{ fontSize:11, color:C.textMuted, marginBottom:12 }}>Full year 2026</div>
          <BarChart data={CHART_DATA.revenue} labels={CHART_DATA.labels} color={C.deep}/>
        </div>
        <div style={{ background:C.bgCard, borderRadius:16, padding:24, border:`1px solid ${C.border}`, boxShadow:"0 2px 12px rgba(2,79,89,0.05)" }}>
          <div style={{ fontSize:14, fontWeight:800, color:C.text, marginBottom:4 }}>Order Volume</div>
          <div style={{ fontSize:11, color:C.textMuted, marginBottom:12 }}>Monthly orders 2026</div>
          <BarChart data={CHART_DATA.orders} labels={CHART_DATA.labels} color="#3b9aca"/>
        </div>
      </div>
    </div>
  );
}

// ─── Settings View ────────────────────────────────────────────────────────────
function SettingsView() {
  const [vals, setVals] = useState({ storeName:"ShopAdmin LK", email:"admin@shopadmin.lk", currency:"LKR", timezone:"Asia/Colombo", notifications:true, darkMode:false, twoFactor:true });
  const Toggle = ({ k }) => (
    <div onClick={()=>setVals(p=>({...p,[k]:!p[k]}))} style={{ width:42, height:24, borderRadius:12, background:vals[k]?C.deep:"#D1D5DB", position:"relative", cursor:"pointer", transition:"background 0.2s", flexShrink:0 }}>
      <div style={{ width:18, height:18, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:vals[k]?21:3, transition:"left 0.2s", boxShadow:"0 1px 4px rgba(0,0,0,0.2)" }}/>
    </div>
  );
  const Row = ({ label, desc, control }) => (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"18px 0", borderBottom:`1px solid ${C.border}` }}>
      <div><div style={{ fontSize:14, fontWeight:700, color:C.text }}>{label}</div><div style={{ fontSize:12, color:C.textMuted, marginTop:2 }}>{desc}</div></div>
      {control}
    </div>
  );
  return (
    <div style={{ maxWidth:640 }}>
      <div style={{ background:C.bgCard, borderRadius:16, padding:28, border:`1px solid ${C.border}`, marginBottom:18, boxShadow:"0 2px 12px rgba(2,79,89,0.05)" }}>
        <div style={{ fontSize:16, fontWeight:800, color:C.text, marginBottom:4 }}>Store Settings</div>
        <div style={{ fontSize:12, color:C.textMuted, marginBottom:20 }}>Manage your store configuration</div>
        {[["Store Name","storeName"],["Email","email"],["Currency","currency"],["Timezone","timezone"]].map(([l,k])=>(
          <div key={k} style={{ marginBottom:14 }}>
            <label style={{ fontSize:12, fontWeight:700, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.5px", color:C.textMid }}>{l}</label>
            <input value={vals[k]} onChange={e=>setVals(p=>({...p,[k]:e.target.value}))} style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:`1.5px solid ${C.border}`, fontSize:14, outline:"none", boxSizing:"border-box", color:C.text }}/>
          </div>
        ))}
        <button style={{ marginTop:8, padding:"10px 24px", borderRadius:10, border:"none", background:`linear-gradient(135deg,${C.deep},${C.deepLight})`, color:"#fff", cursor:"pointer", fontWeight:700, fontSize:13 }}>Save Changes</button>
      </div>
      <div style={{ background:C.bgCard, borderRadius:16, padding:28, border:`1px solid ${C.border}`, boxShadow:"0 2px 12px rgba(2,79,89,0.05)" }}>
        <div style={{ fontSize:16, fontWeight:800, color:C.text, marginBottom:4 }}>Preferences</div>
        <div style={{ fontSize:12, color:C.textMuted, marginBottom:4 }}>Customize your admin experience</div>
        <Row label="Email Notifications" desc="Receive order & system alerts" control={<Toggle k="notifications"/>}/>
        <Row label="Dark Mode" desc="Switch to dark theme" control={<Toggle k="darkMode"/>}/>
        <Row label="Two-Factor Auth" desc="Secure your admin account" control={<Toggle k="twoFactor"/>}/>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function AdminPanel() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [products, setProducts] = useState(PRODUCTS);
  const [categories, setCategories] = useState(CATEGORIES);
  const [globalSearch, setGlobalSearch] = useState("");

  const SIDEBAR_W = collapsed ? 68 : 224;

  const pageTitle = { dashboard:"Dashboard", products:"Products", categories:"Categories", orders:"Orders", customers:"Customers", analytics:"Analytics", settings:"Settings" };

  return (
    <div style={{ display:"flex", minHeight:"100vh", fontFamily:"'DM Sans','Nunito',sans-serif", background:C.bg, color:C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px;}
        input:focus,select:focus,textarea:focus{box-shadow:0 0 0 3px ${C.deep}22!important;border-color:${C.deep}!important;outline:none!important;}
        button:active{opacity:0.85;}
      `}</style>

      {/* Sidebar */}
      <div style={{ width:SIDEBAR_W, background:`linear-gradient(180deg, ${C.deep} 0%, ${C.deepDark} 100%)`, display:"flex", flexDirection:"column", position:"fixed", top:0, left:0, height:"100vh", transition:"width 0.25s cubic-bezier(0.16,1,0.3,1)", zIndex:100, flexShrink:0 }}>

        {/* Logo */}
        <div style={{ padding:"22px 18px", borderBottom:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", gap:12, flexShrink:0, overflow:"hidden" }}>
          <div style={{ width:36, height:36, borderRadius:10, background:C.accent, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0, boxShadow:`0 4px 12px ${C.accent}60` }}>🛍️</div>
          {!collapsed && <div style={{ overflow:"hidden" }}>
            <div style={{ fontSize:15, fontWeight:800, color:"#fff", whiteSpace:"nowrap", letterSpacing:"-0.3px" }}>ShopAdmin</div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.45)", fontWeight:500 }}>LK Platform</div>
          </div>}
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:"16px 10px", overflowY:"auto", overflowX:"hidden" }}>
          <div style={{ fontSize:9, fontWeight:700, color:"rgba(255,255,255,0.25)", letterSpacing:"1px", textTransform:"uppercase", padding:"0 8px 10px", display:collapsed?"none":"block" }}>Main Menu</div>
          {NAV.map(item => {
            const active = activeNav===item.id;
            return (
              <div key={item.id} onClick={()=>setActiveNav(item.id)}
                style={{ display:"flex", alignItems:"center", gap:11, padding:"11px 10px", borderRadius:11, cursor:"pointer", marginBottom:2, background:active?"rgba(255,255,255,0.12)":"transparent", transition:"all 0.15s", color:active?"#fff":"rgba(255,255,255,0.5)", position:"relative", overflow:"hidden" }}
                onMouseEnter={e=>{ if(!active){e.currentTarget.style.background="rgba(255,255,255,0.06)"; e.currentTarget.style.color="rgba(255,255,255,0.8)"; }}}
                onMouseLeave={e=>{ if(!active){e.currentTarget.style.background="transparent"; e.currentTarget.style.color="rgba(255,255,255,0.5)"; }}}>
                {active && <div style={{ position:"absolute", left:0, top:"50%", transform:"translateY(-50%)", width:3, height:20, borderRadius:2, background:C.accent }}/>}
                <span style={{ fontSize:16, flexShrink:0, fontStyle:"normal", width:20, textAlign:"center" }}>{item.icon}</span>
                {!collapsed && <span style={{ fontSize:13, fontWeight:active?700:500, whiteSpace:"nowrap", flex:1 }}>{item.label}</span>}
                {!collapsed && item.badge && <span style={{ background:C.danger, color:"#fff", fontSize:10, fontWeight:800, padding:"2px 6px", borderRadius:8 }}>{item.badge}</span>}
              </div>
            );
          })}
        </nav>

        {/* User + Collapse */}
        <div style={{ padding:"12px 10px", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
          {!collapsed && (
            <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 10px", borderRadius:11, background:"rgba(255,255,255,0.06)", marginBottom:8 }}>
              <div style={{ width:32, height:32, borderRadius:10, background:C.accent, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>👤</div>
              <div style={{ overflow:"hidden" }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#fff", whiteSpace:"nowrap" }}>Admin User</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)" }}>Super Admin</div>
              </div>
            </div>
          )}
          <div onClick={()=>setCollapsed(p=>!p)} style={{ display:"flex", alignItems:"center", justifyContent:collapsed?"center":"flex-start", gap:10, padding:"10px 10px", borderRadius:11, cursor:"pointer", color:"rgba(255,255,255,0.4)", transition:"all 0.15s" }}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.06)"; e.currentTarget.style.color="rgba(255,255,255,0.8)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="transparent"; e.currentTarget.style.color="rgba(255,255,255,0.4)";}}>
            <span style={{ fontSize:16 }}>{collapsed?"→":"←"}</span>
            {!collapsed && <span style={{ fontSize:12 }}>Collapse</span>}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex:1, marginLeft:SIDEBAR_W, transition:"margin-left 0.25s cubic-bezier(0.16,1,0.3,1)", display:"flex", flexDirection:"column" }}>

        {/* Topbar */}
        <div style={{ background:C.bgCard, borderBottom:`1px solid ${C.border}`, padding:"0 28px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0, position:"sticky", top:0, zIndex:50, boxShadow:"0 1px 8px rgba(2,79,89,0.06)" }}>
          <div>
            <div style={{ fontSize:18, fontWeight:800, color:C.text, textTransform:"capitalize", letterSpacing:"-0.3px" }}>{pageTitle[activeNav]}</div>
            <div style={{ fontSize:11, color:C.textMuted }}>
              {new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ position:"relative" }}>
              <span style={{ position:"absolute", top:"50%", transform:"translateY(-50%)", left:12, color:C.textMuted, fontSize:13 }}>🔍</span>
              <input placeholder="Quick search..." value={globalSearch} onChange={e=>setGlobalSearch(e.target.value)} style={{ padding:"8px 14px 8px 34px", borderRadius:10, border:`1.5px solid ${C.border}`, fontSize:12, outline:"none", width:200, color:C.text, background:C.bg }}/>
            </div>
            <div style={{ position:"relative", width:36, height:36, borderRadius:10, background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", border:`1px solid ${C.border}` }}>
              🔔
              <div style={{ position:"absolute", top:7, right:7, width:7, height:7, borderRadius:"50%", background:C.danger, border:"2px solid #fff" }}/>
            </div>
            <div style={{ width:36, height:36, borderRadius:10, background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", border:`1px solid ${C.border}`, fontSize:14 }}>⚙️</div>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ flex:1, padding:24, overflowY:"auto" }}>
          {activeNav==="dashboard"  && <DashboardView/>}
          {activeNav==="products"   && <ProductsView products={products} setProducts={setProducts} onAddProduct={()=>setShowAddProduct(true)}/>}
          {activeNav==="categories" && <CategoriesView categories={categories} setCategories={setCategories} onAdd={()=>setShowAddCategory(true)}/>}
          {activeNav==="orders"     && <OrdersView/>}
          {activeNav==="analytics"  && <AnalyticsView/>}
          {activeNav==="settings"   && <SettingsView/>}
          {activeNav==="customers"  && (
            <div style={{ textAlign:"center", paddingTop:80, color:C.textMuted }}>
              <div style={{ fontSize:64, marginBottom:16 }}>👥</div>
              <div style={{ fontSize:20, fontWeight:800, color:C.text, marginBottom:8 }}>Customers</div>
              <div style={{ fontSize:14 }}>Connect your backend to view customer data</div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddProduct && (
        <AddProductPanel
          onClose={()=>setShowAddProduct(false)}
          onAdd={p=>{ setProducts(prev=>[...prev,p]); }}
          categories={categories}
        />
      )}
      {showAddCategory && (
        <AddCategoryModal
          onClose={()=>setShowAddCategory(false)}
          onAdd={c=>setCategories(prev=>[...prev,c])}
        />
      )}
    </div>
  );
}