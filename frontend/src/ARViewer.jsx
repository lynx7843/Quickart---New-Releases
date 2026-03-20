import React, { useState, useRef, useEffect, Suspense, Component } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { Video, X, Box, Cuboid } from 'lucide-react';

// IMPORTANT: Ensure these files actually exist in your frontend/public/3d-models/ folder.
// If item2.glb or item3.glb do not exist, switching to them will cause the Canvas to fail.
const AR_MODELS = [
  { id: 'design1', name: 'Design 1', path: '/3d-models/item.glb' },
  // { id: 'design2', name: 'Design 2', path: '/3d-models/item2.glb' }, // Uncomment when you add this file
  // { id: 'design3', name: 'Design 3', path: '/3d-models/item3.glb' }, // Uncomment when you add this file
];

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
  const [activeModel, setActiveModel] = useState(AR_MODELS[0]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
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
    <div style={{ minHeight: 'calc(100vh - 80px)', background: '#F4F6FA', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#1a1a1a', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontWeight: 800 }}>
          <Box color="#557a8c" size={36} /> AR Design Viewer
        </h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: '1.1rem' }}>View and switch between 3D designs in your real environment.</p>
      </div>

      {/* Simple Camera View Box */}
      <div style={{
        position: 'relative', width: '100%', maxWidth: '900px', height: '65vh', 
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
                <Model url={activeModel.path} />
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

      {/* Switch Models */}
      <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {AR_MODELS.map((model) => (
          <button key={model.id} onClick={() => setActiveModel(model)} style={{ padding: '14px 28px', borderRadius: '14px', cursor: 'pointer', fontWeight: 700, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s', background: activeModel.id === model.id ? '#557a8c' : '#fff', color: activeModel.id === model.id ? '#fff' : '#475569', border: activeModel.id === model.id ? '2px solid #557a8c' : '2px solid #e2e8f0', boxShadow: activeModel.id === model.id ? '0 10px 25px rgba(85,122,140,0.3)' : '0 4px 10px rgba(0,0,0,0.05)' }}>
            <Cuboid size={20} /> {model.name}
          </button>
        ))}
      </div>
    </div>
  );
}