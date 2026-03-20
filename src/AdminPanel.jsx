import { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Footer from "./assets/Footer.jsx";


const COLORS = {
  orange: "#F97316",
  orangeLight: "#FED7AA",
  orangeDark: "#C2410C",
  black: "#0F0F0F",
  darkGray: "#1A1A1A",
  medGray: "#2A2A2A",
  lightGray: "#F5F5F4",
  border: "#E5E5E5",
  text: "#1C1C1C",
  textMuted: "#6B7280",
  white: "#FFFFFF",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  purple: "#8B5CF6",
};

const MOCK_CATEGORIES = [
  { id: "electronics", label: "Electronics", icon: "💻", color: "#4F8EF7", sub: ["Laptops", "Phones", "Accessories"] },
  { id: "fashion", label: "Fashion", icon: "👗", color: "#E879A0", sub: ["Tops", "Dresses", "Jeans"] },
  { id: "wearables", label: "Wearables", icon: "⌚", color: "#A855F7", sub: ["Smartwatches", "Fitness Trackers"] },
  { id: "photography", label: "Photography", icon: "📷", color: "#F59E0B", sub: ["Cameras", "Lenses", "Drones"] },
  { id: "audio", label: "Audio", icon: "🎧", color: "#10B981", sub: ["Headphones", "Speakers"] },
];

const MOCK_PRODUCTS = [
  { id: 1, name: "Wireless Earbuds Pro", category: "audio", price: 24500, orig: 29900, rating: 4.5, reviews: 128, badge: "Best Seller", color: "#10B981", emoji: "🎧", imgs: ["https://via.placeholder.com/150/10B981/FFFFFF?text=Audio"], colors: ["#000", "#fff"], specs: ["Bluetooth 5.2", "ANC"], sub: "Headphones" },
  { id: 2, name: "Smart Watch Elite", category: "wearables", price: 61000, orig: 75000, rating: 4.3, reviews: 87, badge: "New", color: "#A855F7", emoji: "⌚", imgs: ["https://via.placeholder.com/150/A855F7/FFFFFF?text=Watch"], colors: ["#333", "#eee"], specs: ["GPS", "Heart Rate"], sub: "Smartwatches" },
  { id: 3, name: "Camera Lens 85mm", category: "photography", price: 137500, orig: 150000, rating: 4.7, reviews: 45, badge: "Premium", color: "#F59E0B", emoji: "📷", imgs: ["https://via.placeholder.com/150/F59E0B/FFFFFF?text=Lens"], colors: ["#000"], specs: ["F1.8 Aperture"], sub: "Lenses" },
  { id: 4, name: "Gaming Laptop X15", category: "electronics", price: 289000, orig: 320000, rating: 4.8, reviews: 213, badge: "Hot", color: "#EF4444", emoji: "💻", imgs: ["https://via.placeholder.com/150/EF4444/FFFFFF?text=Laptop"], colors: ["#111", "#555"], specs: ["16GB RAM", "RTX 4070"], sub: "Laptops" },
];

const BRANDS = ["SoundWave", "TechGear", "OptiCraft", "MechPro", "SwiftStep", "Samsung", "Sony", "Apple", "LG", "Canon"];
const TYPES = ["Audio", "Wearable", "Lens", "Peripheral", "Athletic", "Casual", "Smart Home", "Gaming", "Fashion", "Accessories"];

function StatCard({ icon, label, value, change, color, sub }) {
  const isPos = change >= 0;
  return (
    <div style={{
      background: COLORS.white,
      borderRadius: 16,
      padding: "22px 24px",
      border: `1px solid ${COLORS.border}`,
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      transition: "transform 0.2s, box-shadow 0.2s",
      cursor: "default",
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)"; }}
    >
      <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, borderRadius: "0 16px 0 80px", background: `${color}14` }} />
      <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 13, color: COLORS.textMuted, fontWeight: 500, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.text, letterSpacing: "-0.5px" }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>{sub}</div>}
      <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: isPos ? COLORS.success : COLORS.danger }}>
          {isPos ? "▲" : "▼"} {Math.abs(change)}%
        </span>
        <span style={{ fontSize: 11, color: COLORS.textMuted }}>vs last month</span>
      </div>
    </div>
  );
}

function Badge({ status }) {
  const map = {
    "Active": { bg: "#DCFCE7", color: "#15803D" },
    "Low Stock": { bg: "#FEF3C7", color: "#B45309" },
    "Out of Stock": { bg: "#FEE2E2", color: "#B91C1C" },
    "Draft": { bg: "#F3F4F6", color: "#374151" },
  };
  const s = map[status] || map["Draft"];
  return (
    <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color }}>
      {status}
    </span>
  );
}

function ImageDropZone({ images, setImages }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleFiles = (files) => {
    const newImgs = Array.from(files).map(file => ({
      id: Math.random().toString(36).slice(2),
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setImages(prev => [...prev, ...newImgs]);
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        style={{
          border: `2px dashed ${dragging ? COLORS.orange : COLORS.border}`,
          borderRadius: 12,
          padding: "32px 20px",
          textAlign: "center",
          cursor: "pointer",
          background: dragging ? "#FFF7ED" : "#FAFAFA",
          transition: "all 0.2s",
        }}
      >
        <div style={{ fontSize: 36, marginBottom: 8 }}>🖼️</div>
        <div style={{ fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>Drop images here or click to upload</div>
        <div style={{ fontSize: 12, color: COLORS.textMuted }}>PNG, JPG, WEBP up to 10MB each</div>
        <input ref={inputRef} type="file" multiple accept="image/*" style={{ display: "none" }}
          onChange={e => handleFiles(e.target.files)} />
      </div>
      {images.length > 0 && (
        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          {images.map((img, i) => (
            <div key={img.id} style={{ position: "relative" }}>
              <div style={{
                width: 80, height: 80, borderRadius: 10, overflow: "hidden",
                border: i === 0 ? `2px solid ${COLORS.orange}` : `1px solid ${COLORS.border}`,
                background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <img src={img.url} alt={img.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                {i === 0 && (
                  <div style={{ position: "absolute", bottom: 2, left: "50%", transform: "translateX(-50%)", background: COLORS.orange, color: "#fff", fontSize: 9, padding: "1px 6px", borderRadius: 4, fontWeight: 700 }}>MAIN</div>
                )}
              </div>
              <button onClick={() => setImages(prev => prev.filter(p => p.id !== img.id))}
                style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%", background: COLORS.danger, color: "#fff", border: "none", cursor: "pointer", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddProductPanel({ onClose, onAdd, categories: propCategories }) {
  const [form, setForm] = useState({ name: "", type: "", brand: "", category: "", price: "", stock: "", description: "", status: "Active", tags: "" });
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);

  const validate = () => {
    const e = {};
    if (!form.name) e.name = "Required";
    if (!form.price) e.price = "Required";
    if (!form.category) e.category = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const categoryObject = propCategories.find(c => c.label === form.category);
    const newProduct = {
      ...form,
      id: Date.now(),
      price: Number(form.price),
      stock: Number(form.stock),
      category: categoryObject ? categoryObject.id : '',
      rating: 0,
      reviews: 0,
      orig: Number(form.price) * 1.2,
      badge: "NEW",
      color: categoryObject ? categoryObject.color : "#64748b",
      emoji: categoryObject ? categoryObject.icon : '📦',
      imgs: [images[0]?.url || `https://via.placeholder.com/150/${(categoryObject?.color || '64748b').substring(1)}/FFFFFF?text=${form.name.substring(0,3)}`],
      colors: ["#000000", "#ffffff"],
      specs: ["New Item"],
      sub: form.type,
    };
    onAdd(newProduct);
    onClose();
  };

  const Field = ({ label, name, type = "text", placeholder, options, required }) => (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: COLORS.text, marginBottom: 6 }}>
        {label} {required && <span style={{ color: COLORS.orange }}>*</span>}
      </label>
      {options ? (
        <select value={form[name]} onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))}
          style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${errors[name] ? COLORS.danger : COLORS.border}`, fontSize: 14, background: "#fff", outline: "none", color: COLORS.text, appearance: "none", cursor: "pointer" }}>
          <option value="">Select {label}</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : type === "textarea" ? (
        <textarea value={form[name]} onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))} placeholder={placeholder} rows={4}
          style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${errors[name] ? COLORS.danger : COLORS.border}`, fontSize: 14, outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} />
      ) : (
        <input type={type} value={form[name]} onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))} placeholder={placeholder}
          style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${errors[name] ? COLORS.danger : COLORS.border}`, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
      )}
      {errors[name] && <div style={{ fontSize: 11, color: COLORS.danger, marginTop: 3 }}>{errors[name]}</div>}
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "flex-end" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 580, height: "100vh", background: COLORS.white, boxShadow: "-8px 0 40px rgba(0,0,0,0.15)",
        display: "flex", flexDirection: "column", overflow: "hidden", animation: "slideIn 0.3s ease",
      }}>
        <style>{`@keyframes slideIn { from { transform: translateX(100%) } to { transform: translateX(0) } }`}</style>

        {/* Header */}
        <div style={{ padding: "24px 28px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: COLORS.black }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.white }}>Add New Product</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Fill in product details carefully</div>
          </div>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 8, border: "none", background: "#333", color: "#fff", cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", padding: "16px 28px", borderBottom: `1px solid ${COLORS.border}`, gap: 0 }}>
          {[["1", "Basic Info"], ["2", "Details"], ["3", "Images"]].map(([n, label], i) => (
            <div key={n} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div onClick={() => setStep(i + 1)} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: step >= i + 1 ? COLORS.orange : COLORS.border, color: step >= i + 1 ? "#fff" : COLORS.textMuted, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, transition: "all 0.2s" }}>{step > i + 1 ? "✓" : n}</div>
                <span style={{ fontSize: 12, fontWeight: 600, color: step >= i + 1 ? COLORS.text : COLORS.textMuted }}>{label}</span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: 2, background: step > i + 1 ? COLORS.orange : COLORS.border, margin: "0 8px", transition: "background 0.3s" }} />}
            </div>
          ))}
        </div>

        {/* Form */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
          {step === 1 && (
            <>
              <Field label="Product Name" name="name" placeholder="e.g. Wireless Earbuds Pro" required />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Field label="Category" name="category" options={propCategories.map(c => c.label)} required />
                <Field label="Product Type" name="type" options={TYPES} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Field label="Brand" name="brand" options={BRANDS} />
                <Field label="Status" name="status" options={["Active", "Draft", "Out of Stock"]} />
              </div>
              <Field label="Tags" name="tags" placeholder="wireless, audio, premium (comma separated)" />
            </>
          )}
          {step === 2 && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Field label="Price (LKR)" name="price" type="number" placeholder="0.00" required />
                <Field label="Stock Quantity" name="stock" type="number" placeholder="0" />
              </div>
              <Field label="Description" name="description" type="textarea" placeholder="Describe the product features, specifications, and benefits..." />

              {/* Pricing Preview */}
              {form.price && (
                <div style={{ background: "#FFF7ED", borderRadius: 12, padding: 16, border: `1px solid ${COLORS.orangeLight}`, marginTop: 8 }}>
                  <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 8, fontWeight: 600 }}>PRICING PREVIEW</div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                    <span style={{ color: COLORS.textMuted }}>Base Price</span>
                    <span style={{ fontWeight: 700 }}>LKR {Number(form.price).toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginTop: 4 }}>
                    <span style={{ color: COLORS.textMuted }}>After 10% discount</span>
                    <span style={{ fontWeight: 700, color: COLORS.orange }}>LKR {(Number(form.price) * 0.9).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </>
          )}
          {step === 3 && (
            <>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Product Images</div>
                <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 12 }}>First image will be used as the main product photo. You can drag to reorder.</div>
                <ImageDropZone images={images} setImages={setImages} />
              </div>

              {/* AI Alt Text hint */}
              <div style={{ background: "#F0FDF4", borderRadius: 10, padding: 14, border: "1px solid #BBF7D0", marginTop: 8, display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 20 }}>✨</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#15803D" }}>AI Image Enhancement</div>
                  <div style={{ fontSize: 12, color: "#166534", marginTop: 2 }}>Alt text and image tags will be auto-generated by AI after upload for better SEO.</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 28px", borderTop: `1px solid ${COLORS.border}`, display: "flex", gap: 10, justifyContent: "space-between", background: COLORS.lightGray }}>
          <button onClick={() => step > 1 ? setStep(s => s - 1) : onClose()}
            style={{ padding: "10px 22px", borderRadius: 10, border: `1.5px solid ${COLORS.border}`, background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 14, color: COLORS.text }}>
            {step > 1 ? "← Back" : "Cancel"}
          </button>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setForm(f => ({ ...f, status: "Draft" }))}
              style={{ padding: "10px 20px", borderRadius: 10, border: `1.5px solid ${COLORS.border}`, background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 14, color: COLORS.textMuted }}>
              Save Draft
            </button>
            {step < 3 ? (
              <button onClick={() => setStep(s => s + 1)}
                style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: COLORS.orange, color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>
                Continue →
              </button>
            ) : (
              <button onClick={handleSubmit}
                style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: COLORS.orange, color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                🚀 Publish Product
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AddCategoryModal({ onClose, onAdd, categories }) {
  const [form, setForm] = useState({ label: "", icon: "📦", description: "", color: "#F97316", featured: false });
  const icons = ["📦", "⚡", "📸", "💻", "👟", "👗", "🏠", "🎮", "🎵", "💄", "🍕", "🌿", "🚗", "⌚", "📱"];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: 480, background: COLORS.white, borderRadius: 20, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", animation: "fadeUp 0.3s ease" }}>
        <style>{`@keyframes fadeUp { from { opacity:0; transform: translateY(20px) } to { opacity:1; transform: translateY(0) } }`}</style>

        <div style={{ background: COLORS.black, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.white }}>Create New Category</div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 6, border: "none", background: "#333", color: "#fff", cursor: "pointer" }}>✕</button>
        </div>

        <div style={{ padding: 24 }}>
          {/* Preview */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <div style={{ width: 80, height: 80, borderRadius: 20, background: `${form.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, border: `2px solid ${form.color}` }}>
              {form.icon}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 6 }}>Category Name *</label>
            <input value={form.label} onChange={e => setForm(p => ({ ...p, label: e.target.value }))} placeholder="e.g. Electronics"
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${COLORS.border}`, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 8 }}>Choose Icon</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {icons.map(ic => (
                <button key={ic} onClick={() => setForm(p => ({ ...p, icon: ic }))}
                  style={{ width: 40, height: 40, borderRadius: 8, border: `2px solid ${form.icon === ic ? COLORS.orange : COLORS.border}`, background: form.icon === ic ? "#FFF7ED" : "#fff", cursor: "pointer", fontSize: 20 }}>
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 8 }}>Category Color</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["#F97316", "#3B82F6", "#8B5CF6", "#10B981", "#EC4899", "#F59E0B", "#EF4444", "#06B6D4"].map(c => (
                <div key={c} onClick={() => setForm(p => ({ ...p, color: c }))}
                  style={{ width: 32, height: 32, borderRadius: 8, background: c, cursor: "pointer", border: form.color === c ? `3px solid ${COLORS.text}` : "3px solid transparent", boxSizing: "border-box", transition: "border 0.15s" }} />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 6 }}>Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Short description of this category..." rows={3}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${COLORS.border}`, fontSize: 14, outline: "none", resize: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, padding: "12px 16px", background: COLORS.lightGray, borderRadius: 10 }}>
            <div onClick={() => setForm(p => ({ ...p, featured: !p.featured }))}
              style={{ width: 42, height: 24, borderRadius: 12, background: form.featured ? COLORS.orange : "#D1D5DB", position: "relative", cursor: "pointer", transition: "background 0.2s" }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: form.featured ? 21 : 3, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Feature this category on homepage</span>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onClose} style={{ flex: 1, padding: "12px", borderRadius: 10, border: `1.5px solid ${COLORS.border}`, background: "#fff", cursor: "pointer", fontWeight: 600 }}>Cancel</button>
            <button onClick={() => { onAdd({ ...form, id: form.label.toLowerCase().replace(/\s+/g, '-'), sub: [] }); onClose(); }}
              style={{ flex: 2, padding: "12px", borderRadius: 10, border: "none", background: COLORS.orange, color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>
              ✓ Create Category
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const NAV_ITEMS = [
  { id: "dashboard", icon: "📊", label: "Dashboard" },
  { id: "products", icon: "📦", label: "Products" },
  { id: "categories", icon: "🏷️", label: "Categories" },
  { id: "orders", icon: "🛒", label: "Orders" },
  { id: "customers", icon: "👥", label: "Customers" },
  { id: "analytics", icon: "📈", label: "Analytics" },
  { id: "settings", icon: "⚙️", label: "Settings" },
];

function MiniBarChart({ data, color }) {
  const max = Math.max(...data);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 48 }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, borderRadius: 4, background: color, opacity: 0.3 + (v / max) * 0.7, height: `${(v / max) * 100}%`, minHeight: 4, transition: "height 0.5s ease" }} />
      ))}
    </div>
  );
}

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    const success = await onLogin(email, password);
    if (!success) {
      setError('Invalid admin credentials or not an admin user.');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#F8F8F8' }}>
      <div style={{ background: 'white', padding: 40, borderRadius: 16, width: 400, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: 20, textAlign: 'center' }}>Admin Login</h2>
        {error && <p style={{ color: 'red', fontSize: 14, textAlign: 'center', marginBottom: 10 }}>{error}</p>}
        <input placeholder="Admin Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: 12, marginBottom: 10, borderRadius: 8, border: '1px solid #ddd' }} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: 12, marginBottom: 20, borderRadius: 8, border: '1px solid #ddd' }} />
        <button onClick={handleLogin} style={{ width: '100%', padding: 12, background: '#F97316', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}>
          Login
        </button>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notification, setNotification] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [connectionError, setConnectionError] = useState(false);
  const { user, login } = useAuth();
  const [isAdmin, setIsAdmin] = useState(user?.role === 'ADMIN');
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const productsRes = await fetch('http://localhost:8080/api/products');
      const categoriesRes = await fetch('http://localhost:8080/api/categories');
      if (productsRes.ok && categoriesRes.ok) {
        setProducts(await productsRes.json());
        setCategories(await categoriesRes.json());
        setConnectionError(false);
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      console.error("Backend connection error:", error);
      setConnectionError(true);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const handleAdminLogin = async (email, password) => {
    const loggedInUser = await login(email, password);
    if (loggedInUser && loggedInUser.role === 'ADMIN') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const notify = (msg, type = "success") => {
    if (type === 'error') console.error(msg);
    else console.log(msg);
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelect = (id) => setSelectedProducts(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const selectAll = () => setSelectedProducts(filteredProducts.length === selectedProducts.length ? [] : filteredProducts.map(p => p.id));

  const SIDEBAR_W = sidebarCollapsed ? 72 : 220;

  if (!isAdmin) {
    return <AdminLogin onLogin={handleAdminLogin} />;
  }

  return (
    <div style={{ display: "flex", fontFamily: "'Sora', 'DM Sans', sans-serif", background: "#F8F8F8", paddingTop: '60px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 3px; }
        input:focus, select:focus, textarea:focus { box-shadow: 0 0 0 3px ${COLORS.orange}33 !important; border-color: ${COLORS.orange} !important;
        }
      `}</style>

      {/* Sidebar */}
        <div style={{ width: SIDEBAR_W, background: COLORS.black, display: "flex", flexDirection: "column", transition: "width 0.25s ease", flexShrink: 0, position: "fixed", top: "60px", height: `calc(100vh - 60px)` }}>
        {/* Logo */}
        <div style={{ padding: "20px 16px", borderBottom: "1px solid #222", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: COLORS.orange, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🛍️</div>
          {!sidebarCollapsed && <span style={{ fontWeight: 800, fontSize: 16, color: COLORS.white, whiteSpace: "nowrap" }}>ShopAdmin</span>}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
          {NAV_ITEMS.map(item => {
            const active = activeNav === item.id;
            return (
              <div key={item.id} onClick={() => { setActiveNav(item.id); navigate(`/admin/${item.id}`); }}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", borderRadius: 10, cursor: "pointer", marginBottom: 2, background: active ? COLORS.orange : "transparent", transition: "all 0.15s", color: active ? "#fff" : "#888" }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#1A1A1A"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#888"; } }}
              >
                <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                {!sidebarCollapsed && <span style={{ fontSize: 14, fontWeight: active ? 700 : 500, whiteSpace: "nowrap" }}>{item.label}</span>}
                {!sidebarCollapsed && item.id === "orders" && <span style={{ marginLeft: "auto", background: COLORS.danger, color: "#fff", fontSize: 10, fontWeight: 800, padding: "2px 7px", borderRadius: 10 }}>5</span>}
              </div>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div style={{ padding: "12px 10px", borderTop: "1px solid #222" }}>
          <div onClick={() => setSidebarCollapsed(p => !p)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, cursor: "pointer", color: "#888" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#1A1A1A"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#888"; }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{sidebarCollapsed ? "→" : "←"}</span>
            {!sidebarCollapsed && <span style={{ fontSize: 13, whiteSpace: "nowrap" }}>Collapse</span>}
          </div>
        </div>
      </div>

      {/* Main */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", marginLeft: SIDEBAR_W, transition: 'margin-left 0.25s ease' }}>
        {/* Topbar */}
        <div style={{ background: COLORS.white, borderBottom: `1px solid ${COLORS.border}`, padding: "0 28px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: COLORS.text, textTransform: "capitalize" }}>{activeNav.replace(/-/g, ' ')}</div>
            <div style={{ fontSize: 12, color: COLORS.textMuted }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: 12, color: COLORS.textMuted, fontSize: 14 }}>🔍</span>
              <input placeholder="Quick search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                style={{ padding: "8px 14px 8px 34px", borderRadius: 10, border: `1.5px solid ${COLORS.border}`, fontSize: 13, outline: "none", width: 200, color: COLORS.text }} />
            </div>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: COLORS.lightGray, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
              🔔
              <div style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", background: COLORS.danger, border: "2px solid #fff" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 10, border: `1px solid ${COLORS.border}`, cursor: "pointer" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: COLORS.orange, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>👤</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700 }}>Admin User</div>
                <div style={{ fontSize: 10, color: COLORS.textMuted }}>Super Admin</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
          <div style={{ flex: 1, padding: 24 }}>
            {connectionError ? (
              <div style={{ textAlign: 'center', marginTop: '20vh', color: '#6B7280', fontFamily: 'sans-serif' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔌</div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>Cannot Connect to Backend</h2>
                <p style={{ maxWidth: '400px', margin: '0 auto 24px' }}>
                  It seems the backend server is not running or is unreachable. Please make sure your Spring Boot application is active.
                </p>
                <button 
                  onClick={fetchData} 
                  style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}>
                  Retry Connection
                </button>
              </div>
            ) : (
              <Outlet context={{ products, setProducts, categories, setCategories, notify, fetchData }} />
            )}
        </div>
      </div>

      {/* Modals */}
      {showAddProduct && (
        <AddProductPanel
          onClose={() => setShowAddProduct(false)}
          onAdd={async (p) => {
            try {
              const response = await fetch('http://localhost:8080/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(p),
              });
              if (response.ok) {
                const newProduct = await response.json();
                setProducts(prev => [...prev, newProduct]);
                notify("Product published successfully!");
              } else {
                notify("Failed to publish product.", "error");
              }
            } catch (error) {
              notify("Error connecting to backend.", "error");
            }
          }}
          categories={categories}
        />
      )}
      {showAddCategory && (
        <AddCategoryModal
          onClose={() => setShowAddCategory(false)}
          onAdd={async (c) => {
            // Similar fetch logic for adding a category
            const response = await fetch('http://localhost:8080/api/categories', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(c),
            });
            if (response.ok) {
              const newCategory = await response.json();
              setCategories(prev => [...prev, newCategory]);
              notify("Category created successfully!");
            }
          }} categories={categories}
        />
      )}
    </div>
  );
}