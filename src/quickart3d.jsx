import React, { useState } from 'react';
import { ShoppingBag, CreditCard, Star, ShieldCheck, Truck, RotateCcw, Plus, Minus, ZoomIn } from 'lucide-react';

const IMAGES = [
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=700&q=80",
  "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=700&q=80",
  "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=700&q=80",
  "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=700&q=80",
];

function ProductImageViewer() {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12, padding: '1.5rem' }}>
      {/* Main Image */}
      <div
        style={{
          flex: 1, borderRadius: '1.25rem', overflow: 'hidden', position: 'relative',
          cursor: zoomed ? 'zoom-out' : 'zoom-in', background: '#e8edf2', minHeight: 260,
        }}
        onMouseMove={handleMouseMove}
        onClick={() => setZoomed(z => !z)}
        onMouseLeave={() => setZoomed(false)}
      >
        <img
          src={IMAGES[active]}
          alt="Product"
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
            transform: zoomed ? 'scale(2)' : 'scale(1)',
            transition: zoomed ? 'transform 0.1s ease' : 'transform 0.4s ease',
            display: 'block',
          }}
        />
        {!zoomed && (
          <div style={{
            position: 'absolute', bottom: 14, right: 14,
            background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(6px)',
            borderRadius: 8, padding: '6px 10px',
            display: 'flex', alignItems: 'center', gap: 5,
            fontSize: 11, fontWeight: 700, color: '#024f59',
            letterSpacing: '0.05em', textTransform: 'uppercase',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <ZoomIn size={13} /> Click to zoom
          </div>
        )}
      </div>

      {/* Thumbnails */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        {IMAGES.map((src, i) => (
          <button
            key={i}
            onClick={() => { setActive(i); setZoomed(false); }}
            style={{
              width: 56, height: 56, borderRadius: 10, overflow: 'hidden',
              border: active === i ? '2.5px solid #024f59' : '2px solid transparent',
              padding: 0, cursor: 'pointer', background: '#e8edf2',
              boxShadow: active === i ? '0 0 0 3px rgba(2,79,89,0.15)' : 'none',
              transition: 'all 0.2s', flexShrink: 0,
            }}
          >
            <img src={src} alt={`View ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </button>
        ))}
      </div>
    </div>
  );
}

const ProductPage = () => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');

  const product = {
    name: "Nexus Core v2.0",
    price: 1299.00,
    reviews: 128,
    description: "Experience the next generation of modular computing. The Nexus Core v2.0 combines aesthetic minimalist design with unparalleled processing power, finished in our signature Deep Teal coating.",
    specs: [
      { label: "Material", value: "Aeronautical Grade Alloy" },
      { label: "Connectivity", value: "WiFi 7 / Bluetooth 5.4" },
      { label: "Dimensions", value: "220mm x 120mm x 80mm" },
    ],
  };

  const handleQuantity = (type) => {
    if (type === 'plus') setQuantity(q => q + 1);
    if (type === 'minus' && quantity > 1) setQuantity(q => q - 1);
  };

  const styles = `
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    .fade-in { animation: fadeIn 0.4s ease forwards; }
    .btn-primary {
      display: flex; align-items: center; justify-content: center; gap: 10px;
      background: #024f59; color: #fff; border: none; border-radius: 14px;
      font-size: 15px; font-weight: 700; cursor: pointer; width: 100%;
      padding: 1.1rem 0; transition: background 0.2s, transform 0.15s;
    }
    .btn-primary:hover { background: #033f47; transform: translateY(-1px); }
    .btn-primary:active { transform: translateY(0); }
    .btn-secondary {
      display: flex; align-items: center; justify-content: center; gap: 10px;
      background: #f4f6fa; color: #024f59; border: 1.5px solid #d1dde3; border-radius: 14px;
      font-size: 15px; font-weight: 700; cursor: pointer; width: 100%;
      padding: 1rem 0; transition: background 0.2s, transform 0.15s;
    }
    .btn-secondary:hover { background: #e7edf2; transform: translateY(-1px); }
  `;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef2f7 0%, #dde6ee 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'system-ui, sans-serif', color: '#024f59' }}>
      <style>{styles}</style>
      <div style={{ width: '100%', maxWidth: '1100px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', background: '#fff', borderRadius: '2rem', boxShadow: '0 24px 80px rgba(2,79,89,0.14)', overflow: 'hidden', minHeight: '85vh' }}>

        {/* Left: Image Viewer */}
        <div style={{ background: 'linear-gradient(145deg, #f4f6fa, #e8edf4)', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 420 }}>
          <ProductImageViewer />
          <p style={{ textAlign: 'center', paddingBottom: '1.25rem', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#557a8c', fontWeight: 700, margin: 0 }}>
            Click image to zoom · 4 views
          </p>
        </div>

        {/* Right: Product Info */}
        <div style={{ padding: '3rem 3.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#fff' }}>

          {/* Badge + Stars */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ background: '#e6f4f1', color: '#024f59', fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.08em' }}>New 2025</span>
            <div style={{ display: 'flex', color: '#f59e0b' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
            </div>
            <span style={{ fontSize: 12, color: '#557a8c', fontWeight: 500 }}>({product.reviews})</span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, margin: '0 0 0.4rem', lineHeight: 1.15 }}>{product.name}</h1>
          <p style={{ fontSize: '1.8rem', fontWeight: 300, color: '#557a8c', marginBottom: '1.5rem' }}>
            ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid #f0f0f0', marginBottom: '1.25rem' }}>
            {['details', 'specs', 'shipping'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                paddingBottom: 14, background: 'none', border: 'none',
                borderBottom: activeTab === tab ? '2px solid #024f59' : '2px solid transparent',
                fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
                color: activeTab === tab ? '#024f59' : '#557a8c',
                opacity: activeTab === tab ? 1 : 0.5, cursor: 'pointer', transition: 'all 0.2s',
              }}>{tab}</button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ minHeight: 80, marginBottom: '1.5rem' }}>
            {activeTab === 'details' && (
              <p className="fade-in" style={{ color: '#4b5563', lineHeight: 1.75, margin: 0, fontSize: 14 }}>{product.description}</p>
            )}
            {activeTab === 'specs' && (
              <div className="fade-in">
                {product.specs.map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '0.6rem 0', borderBottom: '1px solid #f9fafb' }}>
                    <span style={{ fontWeight: 600, color: '#557a8c' }}>{s.label}</span>
                    <span style={{ color: '#4b5563' }}>{s.value}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'shipping' && (
              <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[{ Icon: Truck, text: 'Free express shipping on orders over $500' }, { Icon: RotateCcw, text: '30-day effortless returns policy' }].map(({ Icon, text }, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#4b5563' }}>
                    <Icon size={16} color="#024f59" /><span>{text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Qty + Warranty */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: '1.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#557a8c', marginBottom: 10 }}>Quantity</label>
              <div style={{ display: 'inline-flex', alignItems: 'center', border: '1.5px solid #e5e7eb', borderRadius: 12 }}>
                <button onClick={() => handleQuantity('minus')} style={{ padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', color: '#024f59' }}><Minus size={14} /></button>
                <span style={{ padding: '0 12px', fontWeight: 700, minWidth: 32, textAlign: 'center' }}>{quantity}</span>
                <button onClick={() => handleQuantity('plus')} style={{ padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', color: '#024f59' }}><Plus size={14} /></button>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#557a8c', marginBottom: 10 }}>Protection</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#024f59', background: '#f4f6fa', padding: '10px 14px', borderRadius: 12, border: '1px solid rgba(85,122,140,0.15)' }}>
                <ShieldCheck size={16} /> 2 Year Warranty
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button className="btn-primary"><ShoppingBag size={18} />Add to Cart — ${(product.price * quantity).toLocaleString()}</button>
            <button className="btn-secondary"><CreditCard size={18} />Instant Checkout</button>
          </div>

          {/* Trust Badges */}
          <div style={{ marginTop: '1.75rem', paddingTop: '1.75rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.45, filter: 'grayscale(1)' }}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" style={{ height: 16 }} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" style={{ height: 12 }} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" style={{ height: 20 }} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_Pay_logo.svg" alt="Apple Pay" style={{ height: 16 }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;