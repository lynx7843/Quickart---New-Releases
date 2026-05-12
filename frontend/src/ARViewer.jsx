import React, { useState, useRef, useEffect, Suspense, Component } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { Video, X, Box } from 'lucide-react';

const Model = ({ url }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} position={[0, -1, 0]} scale={1} />;
};

// Error boundary to prevent full page crashes if Canvas fails
class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1e293b', color: '#f87171', padding: '1rem', textAlign: 'center', borderRadius: '1.5rem' }}>Failed to load 3D Canvas. Please resolve package dependency mismatches.</div>;
    }
    return this.props.children;
  }
}

export default function ARViewer() {
  const [products, setProducts] = useState([]);
  const [activeModel, setActiveModel] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    // Generate 8 fallback items (item1 to item8) in case backend is empty or unreachable
    const fallbackProducts = Array.from({ length: 8 }).map((_, i) => ({
      _id: `PROD-000${i + 1}`,
      name: `Design Item ${i + 1}`,
      description: `High quality 3D design item ${i + 1}.`,
      price: 2000 + (i * 500),
      imageUrl: `${process.env.REACT_APP_AR_IMAGE_BASE_URL}/item${i + 1}.jpg`,
      model3dUrl: `${process.env.REACT_APP_AR_MODEL_BASE_URL}/item${i + 1}.glb`,
      category: "DESIGN"
    }));

    fetch('http://localhost:8080/api/v1/products')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          const arProducts = data.filter(p => p.model3dUrl).slice(0, 8);
          if (arProducts.length > 0) {
            // Ensure we always show 8 items by filling empty slots with fallbacks
            const combined = [...arProducts, ...fallbackProducts].slice(0, 8);
            setProducts(combined);
            return;
          }
        }
        // Use fallback if no products have a model3dUrl or list is empty
        setProducts(fallbackProducts);
      })
      .catch(err => {
        console.error("Error fetching AR products:", err);
        setProducts(fallbackProducts);
      });

    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      if (err.name === "NotAllowedError" || err.message.includes("denied")) {
        alert("Camera access denied! Please click the lock/site-settings icon in your browser's URL bar, allow camera permissions, and refresh the page.");
      } else {
        alert(`Camera error: ${err.message}. Make sure you are running on 'localhost' or an 'https' connection.`);
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  return (
    <div style={{ height: 'calc(100vh - 80px)', background: '#F4F6FA', padding: '2rem', display: 'flex', gap: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Left Sidebar: Product Cards */}
      <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', paddingRight: '10px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 1rem 0', color: '#1a1a1a' }}>Select Item</h2>
        {products.length === 0 ? (
          <p style={{ color: '#64748b' }}>Loading 3D models...</p>
        ) : (
          products.map((model) => {
            const active = activeModel && (activeModel._id === model._id || activeModel.id === model.id);
            return (
              <div 
                key={model._id || model.id} 
                onClick={() => setActiveModel(model)}
                style={{ 
                  background: "#fff", 
                  borderRadius: 16, 
                  padding: 14, 
                  boxShadow: active ? "0 0 0 2px #557a8c, 0 12px 30px rgba(0,0,0,0.08)" : "0 4px 24px rgba(0,0,0,0.04)", 
                  transition: "all 0.2s", 
                  display: 'flex', 
                  flexDirection: 'column', 
                  cursor: 'pointer' 
                }}
                onMouseEnter={e => { if(!active) { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.08)"; }}}
                onMouseLeave={e => { if(!active) { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.04)"; }}}
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

      {/* Right Area: AR Viewer */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', color: '#1a1a1a', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontWeight: 800 }}>
            <Box color="#557a8c" size={36} /> AR Design Viewer
          </h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '1.1rem' }}>Select an item from the left and view it in your real environment.</p>
        </div>

        {/* Simple Camera View Box */}
        <div style={{
          position: 'relative', width: '100%', maxWidth: '900px', flex: 1, 
          background: '#000', borderRadius: '1.5rem', overflow: 'hidden', 
          boxShadow: '0 24px 50px rgba(0,0,0,0.2)'
        }}>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, opacity: isCameraActive ? 1 : 0, transition: 'opacity 0.3s ease' }} 
          />

          {!isCameraActive && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', zIndex: 0, background: 'linear-gradient(135deg, #1e293b, #0f172a)' }}>
              <Video size={56} opacity={0.3} style={{ marginBottom: '1rem' }} />
              <p style={{ color: '#94a3b8', fontSize: '1.1rem', fontWeight: 500 }}>Camera is turned off</p>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>Start the camera to see models in your space</p>
            </div>
          )}

          <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'auto' }}>
            <CanvasErrorBoundary>
              <Canvas camera={{ position: [0, 1, 4], fov: 50 }}>
                <Suspense fallback={null}>
                  <ambientLight intensity={0.8} />
                  <directionalLight position={[10, 10, 5]} intensity={1.5} />
                  <Environment preset="city" />
                  {activeModel?.model3dUrl && <Model url={activeModel.model3dUrl} />}
                  <OrbitControls enableZoom={true} autoRotate={!isCameraActive} autoRotateSpeed={2} />
                </Suspense>
              </Canvas>
            </CanvasErrorBoundary>
          </div>

          <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 2 }}>
            {!isCameraActive ? (
              <button onClick={startCamera} style={{ background: '#557a8c', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                <Video size={18} /> Start Camera
              </button>
            ) : (
              <button onClick={stopCamera} style={{ background: 'rgba(0,0,0,0.7)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 20px', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', backdropFilter: 'blur(8px)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,50,50,0.8)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}>
                <X size={18} /> Stop Camera
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}