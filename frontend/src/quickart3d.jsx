import React, { useState, useEffect, Suspense, Component } from 'react';
import { ShoppingBag, CreditCard, Star, ShieldCheck, Truck, RotateCcw, Plus, Minus, ZoomIn, Box } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Environment, OrbitControls } from '@react-three/drei';

const ProductModel = ({ modelPath }) => {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} position={[0, -1, 0]} scale={1} />;
};

class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidUpdate(prevProps) {
    if (this.props.resetKey !== prevProps.resetKey) {
      this.setState({ hasError: false });
    }
  }
  render() {
    if (this.state.hasError) {
      return <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e8edf2', color: '#f87171', padding: '1rem', textAlign: 'center', borderRadius: '1.25rem' }}>Failed to load 3D Canvas.</div>;
    }
    return this.props.children;
  }
}

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [activeModel, setActiveModel] = useState(null);
  const [quantity, setQuantity] = useState(1);  
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const fallbackProducts = Array.from({ length: 8 }).map((_, i) => ({
      _id: `PROD-000${i + 1}`,
      name: "Living room furniture chair",
      description: "Modern minimal living room living room furniture chair.",
      price: 30000,
      imageUrl: `${process.env.REACT_APP_AR_IMAGE_BASE_URL}/item${i + 1}.jpg`,
      model3dUrl: `${process.env.REACT_APP_AR_MODEL_BASE_URL}/item1.glb`,
      category: "HOME",
      specs: ["High Quality", "Durable", "Modern Design"]
    }));

    fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/products`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          // Use real database items, but assign fallback 3D models if they don't have one
          const dbProducts = data.slice(0, 8).map((p, i) => ({
            ...p,
            model3dUrl: p.model3dUrl || `${process.env.REACT_APP_AR_MODEL_BASE_URL}/item1.glb`,
            imageUrl: p.imageUrl || (p.imageUrls && p.imageUrls[0]) || `${process.env.REACT_APP_AR_IMAGE_BASE_URL}/item${i + 1}.jpg`
          }));
          const combined = [...dbProducts, ...fallbackProducts].slice(0, 8);
          setProducts(combined);
          return;
        }
        setProducts(fallbackProducts);
      })
      .catch(err => {
        console.error("Error fetching 3D products:", err);
        setProducts(fallbackProducts);
      });
  }, []);

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
    <div style={{ height: 'calc(100vh - 80px)', background: '#F4F6FA', padding: '2rem', display: 'flex', gap: '2rem', fontFamily: 'system-ui, sans-serif', color: '#024f59' }}>
      <style>{styles}</style>

      {/* Left Sidebar: Product Cards */}
      <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', paddingRight: '10px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 1rem 0', color: '#1a1a1a' }}>Select Item</h2>
        {products.length === 0 ? (
          <p style={{ color: '#64748b' }}>Loading 3D models...</p>
        ) : (
          products.map((model) => {
            const isActive = activeModel && (activeModel._id === model._id || activeModel.id === model.id);
            return (
              <div 
                key={model._id || model.id} 
                onClick={() => { setActiveModel(model); setQuantity(1); }}
                style={{ 
                  background: "#fff", 
                  borderRadius: 16, 
                  padding: 14, 
                  boxShadow: isActive ? "0 0 0 2px #557a8c, 0 12px 30px rgba(0,0,0,0.08)" : "0 4px 24px rgba(0,0,0,0.04)", 
                  transition: "all 0.2s", 
                  display: 'flex', 
                  flexDirection: 'column', 
                  cursor: 'pointer' 
                }}
                onMouseEnter={e => { if(!isActive) { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.08)"; }}}
                onMouseLeave={e => { if(!isActive) { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.04)"; }}}
              >
                <div style={{ position: 'relative', marginBottom: 12, borderRadius: 12, overflow: "hidden", aspectRatio: "1/1", background: "#F4F6FA" }}>
                  <img src={model.imageUrl || (model.imageUrls && model.imageUrls[0])} alt={model.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <span style={{ position: 'absolute', top: 8, left: 8, background: '#1a1a1a', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{model.category || 'Product'}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={model.name}>{model.name}</div>
                <div style={{ fontSize: 12, color: "#666", marginBottom: 8, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", height: 34, lineHeight: 1.4 }}>
                  {model.description || "High quality product"}
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#111111", marginTop: 'auto' }}>LKR {model.price?.toLocaleString()}</div>
              </div>
            );
          })
        )}
      </div>

      {/* Right Area: 3D Viewer & Details */}
      <div style={{ flex: 1, display: 'flex', gap: '2rem', background: '#fff', borderRadius: '2rem', boxShadow: '0 24px 80px rgba(2,79,89,0.14)', overflow: 'hidden', padding: '1.5rem' }}>
        {activeModel ? (
          <>
            {/* 3D Viewer */}
            <div style={{ flex: 1, background: 'linear-gradient(145deg, #f4f6fa, #e8edf4)', borderRadius: '1.25rem', overflow: 'hidden', position: 'relative', cursor: 'grab', display: 'flex', flexDirection: 'column' }}>
              <CanvasErrorBoundary resetKey={activeModel?.model3dUrl}>
                <Canvas camera={{ position: [0, 1, 4], fov: 50 }}>
                  <Suspense fallback={null}>
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[10, 10, 10]} intensity={1.5} />
                    <Environment preset="city" />
                    {activeModel.model3dUrl && <ProductModel modelPath={activeModel.model3dUrl} />}
                    <OrbitControls enableZoom={true} autoRotate={true} autoRotateSpeed={2} />
                  </Suspense>
                </Canvas>
              </CanvasErrorBoundary>
              <div style={{ position: 'absolute', bottom: 14, right: 14, background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(6px)', borderRadius: 8, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: '#024f59', letterSpacing: '0.05em', textTransform: 'uppercase', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', pointerEvents: 'none' }}>
                <ZoomIn size={13} /> Scroll to zoom
              </div>
            </div>

            {/* Product Details */}
            <div style={{ width: '400px', display: 'flex', flexDirection: 'column', overflowY: 'auto', paddingRight: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ background: '#e6f4f1', color: '#024f59', fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{activeModel.badge || '3D View'}</span>
                <div style={{ display: 'flex', color: '#f59e0b' }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <span style={{ fontSize: 12, color: '#557a8c', fontWeight: 500 }}>({activeModel.reviews || 128})</span>
              </div>

              <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, margin: '0 0 0.4rem', lineHeight: 1.15 }}>{activeModel.name}</h1>
              <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#024f59', marginBottom: '1.5rem' }}>
                LKR {activeModel.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
                  <p className="fade-in" style={{ color: '#4b5563', lineHeight: 1.75, margin: 0, fontSize: 14 }}>{activeModel.description || "High quality 3D product."}</p>
                )}
                {activeTab === 'specs' && (
                  <div className="fade-in">
                    {(activeModel.specs || ["High Quality", "Modern Design"]).map((s, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '0.6rem 0', borderBottom: '1px solid #f9fafb' }}>
                        <span style={{ fontWeight: 600, color: '#557a8c' }}>Feature {i + 1}</span>
                        <span style={{ color: '#4b5563' }}>{s}</span>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'shipping' && (
                  <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {[{ Icon: Truck, text: 'Free express shipping on orders over LKR 5,000' }, { Icon: RotateCcw, text: '30-day effortless returns policy' }].map(({ Icon, text }, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#4b5563' }}>
                        <Icon size={16} color="#024f59" /><span>{text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Qty + Warranty */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: '1.75rem', marginTop: 'auto' }}>
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
                <button className="btn-primary"><ShoppingBag size={18} />Add to Cart — LKR {(activeModel.price * quantity).toLocaleString()}</button>
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
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#64748b' }}>
            <Box size={64} opacity={0.2} style={{ marginBottom: '1rem' }} />
            <p style={{ fontSize: '1.2rem', fontWeight: 500 }}>Select an item from the left to view in 3D</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;