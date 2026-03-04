import { useState, useRef, useEffect, useCallback } from "react";

const DRESSES = [
  {
    id: 1,
    name: "Evening Elegance",
    category: "Formal",
    price: "$129",
    color: "#c0392b",
    emoji: "👗",
    gradient: "linear-gradient(160deg, #e74c3c, #8e44ad)",
    tag: "Best Seller",
  },
  {
    id: 2,
    name: "Summer Breeze",
    category: "Casual",
    price: "$79",
    color: "#27ae60",
    emoji: "🌿",
    gradient: "linear-gradient(160deg, #2ecc71, #1abc9c)",
    tag: "New",
  },
  {
    id: 3,
    name: "Ocean Wave",
    category: "Beach",
    price: "$89",
    color: "#2980b9",
    emoji: "🌊",
    gradient: "linear-gradient(160deg, #3498db, #1abc9c)",
    tag: "Trending",
  },
  {
    id: 4,
    name: "Golden Hour",
    category: "Party",
    price: "$149",
    color: "#f39c12",
    emoji: "✨",
    gradient: "linear-gradient(160deg, #f39c12, #e74c3c)",
    tag: "Premium",
  },
  {
    id: 5,
    name: "Midnight Rose",
    category: "Cocktail",
    price: "$119",
    color: "#8e44ad",
    emoji: "🌹",
    gradient: "linear-gradient(160deg, #8e44ad, #c0392b)",
    tag: "Hot",
  },
  {
    id: 6,
    name: "Ivory Dream",
    category: "Wedding",
    price: "$299",
    color: "#bdc3c7",
    emoji: "🤍",
    gradient: "linear-gradient(160deg, #ecf0f1, #bdc3c7)",
    tag: "Exclusive",
  },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export default function VirtualFittingRoom() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const photoRef = useRef(null);
  const streamRef = useRef(null);

  const [step, setStep] = useState("landing"); // landing | camera | photo | fitting
  const [selectedDress, setSelectedDress] = useState(DRESSES[0]);
  const [selectedSize, setSelectedSize] = useState("M");
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fittingReady, setFittingReady] = useState(false);
  const [bodyMetrics, setBodyMetrics] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [activeTab, setActiveTab] = useState("camera"); // camera | upload
  const [liked, setLiked] = useState({});
  const [overlayOpacity, setOverlayOpacity] = useState(0.82);

  // Start webcam
  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      setCameraError("Camera access denied. Please allow camera permissions or upload a photo.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (step === "camera" && activeTab === "camera") startCamera();
    return () => { if (step !== "camera") stopCamera(); };
  }, [step, activeTab]);

  // Capture photo from webcam
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setCapturedImage(dataUrl);
    stopCamera();
    processBodyDetection(dataUrl);
  };

  // Handle file upload
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadedImage(ev.target.result);
      setCapturedImage(ev.target.result);
      processBodyDetection(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Simulate body measurement algorithm
  const processBodyDetection = (imgData) => {
    setIsProcessing(true);
    setStep("photo");
    setTimeout(() => {
      // Simulate AI body detection metrics
      const metrics = {
        height: Math.floor(160 + Math.random() * 20) + " cm",
        shoulder: Math.floor(36 + Math.random() * 8) + " cm",
        chest: Math.floor(84 + Math.random() * 14) + " cm",
        waist: Math.floor(62 + Math.random() * 14) + " cm",
        hips: Math.floor(88 + Math.random() * 14) + " cm",
        recommendedSize: SIZES[Math.floor(Math.random() * 4) + 1],
        fitScore: Math.floor(88 + Math.random() * 12),
      };
      setBodyMetrics(metrics);
      setSelectedSize(metrics.recommendedSize);
      setIsProcessing(false);
      setTimeout(() => {
        setFittingReady(true);
        setStep("fitting");
      }, 600);
    }, 2800);
  };

  const toggleLike = (id) => setLiked((p) => ({ ...p, [id]: !p[id] }));

  const reset = () => {
    setCapturedImage(null);
    setUploadedImage(null);
    setBodyMetrics(null);
    setFittingReady(false);
    setStep("landing");
    setCameraError(null);
  };

  return (
    <div style={styles.root}>
      {/* Background */}
      <div style={styles.bg} />
      <div style={styles.bgGrain} />

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>✦</span>
          <span style={styles.logoText}>QuickArt</span>
          <span style={styles.logoBadge}>Virtual Try-On</span>
        </div>
        {step !== "landing" && (
          <button onClick={reset} style={styles.backBtn}>← Start Over</button>
        )}
      </header>

      {/* LANDING */}
      {step === "landing" && (
        <div style={styles.landing}>
          <div style={styles.landingContent}>
            <p style={styles.landingEyebrow}>AI-Powered Fashion Tech</p>
            <h1 style={styles.landingTitle}>
              Try Before<br />
              <span style={styles.landingAccent}>You Buy.</span>
            </h1>
            <p style={styles.landingDesc}>
              Use your webcam or upload a photo. Our algorithm detects your body
              measurements, recommends your perfect size, and drapes the dress
              onto your image in real time.
            </p>
            <div style={styles.features}>
              {[
                { icon: "📷", text: "Live Webcam or Photo Upload" },
                { icon: "📐", text: "AI Body Measurement Detection" },
                { icon: "👗", text: "Real-time Dress Overlay" },
                { icon: "✅", text: "Size Recommendation Engine" },
              ].map((f) => (
                <div key={f.text} style={styles.featureItem}>
                  <span style={styles.featureIcon}>{f.icon}</span>
                  <span style={styles.featureText}>{f.text}</span>
                </div>
              ))}
            </div>
            <button style={styles.ctaBtn} onClick={() => setStep("camera")}>
              Start Virtual Try-On →
            </button>
          </div>
          <div style={styles.landingVisual}>
            {DRESSES.slice(0, 3).map((d, i) => (
              <div key={d.id} style={{ ...styles.previewCard, background: d.gradient, transform: `rotate(${(i - 1) * 6}deg) translateY(${i === 1 ? -20 : 0}px)`, zIndex: i === 1 ? 3 : i }}>
                <span style={{ fontSize: 56 }}>{d.emoji}</span>
                <p style={styles.previewName}>{d.name}</p>
                <p style={styles.previewPrice}>{d.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CAMERA / UPLOAD STEP */}
      {step === "camera" && (
        <div style={styles.cameraSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Capture Your Photo</h2>
            <p style={styles.sectionSub}>Stand 1.5–2m from camera. Full body preferred for best results.</p>
          </div>

          <div style={styles.tabRow}>
            {["camera", "upload"].map((t) => (
              <button key={t} onClick={() => { setActiveTab(t); if (t === "camera") startCamera(); else stopCamera(); }}
                style={{ ...styles.tab, ...(activeTab === t ? styles.tabActive : {}) }}>
                {t === "camera" ? "📷 Webcam" : "📁 Upload Photo"}
              </button>
            ))}
          </div>

          <div style={styles.cameraWrap}>
            {activeTab === "camera" ? (
              <>
                {cameraError ? (
                  <div style={styles.cameraError}>
                    <span style={{ fontSize: 40 }}>📵</span>
                    <p>{cameraError}</p>
                  </div>
                ) : (
                  <video ref={videoRef} autoPlay playsInline muted style={styles.video} />
                )}
                {/* Guide overlay */}
                {!cameraError && (
                  <div style={styles.guideOverlay}>
                    <div style={styles.guideSilhouette}>👤</div>
                    <p style={styles.guideText}>Stand within frame</p>
                  </div>
                )}
                <canvas ref={canvasRef} style={{ display: "none" }} />
                <button onClick={capturePhoto} disabled={!!cameraError} style={{ ...styles.captureBtn, opacity: cameraError ? 0.4 : 1 }}>
                  <span style={styles.captureInner} />
                </button>
              </>
            ) : (
              <label style={styles.uploadZone}>
                <input type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />
                <span style={{ fontSize: 48 }}>📂</span>
                <p style={styles.uploadText}>Click to browse or drag & drop</p>
                <p style={styles.uploadSub}>JPG, PNG, WEBP — max 10MB</p>
                <span style={styles.uploadBtn}>Choose File</span>
              </label>
            )}
          </div>

          <div style={styles.tips}>
            {["Good lighting helps accuracy", "Full body in frame", "Stand straight, arms slightly apart", "Plain background preferred"].map((t) => (
              <span key={t} style={styles.tip}>💡 {t}</span>
            ))}
          </div>
        </div>
      )}

      {/* PROCESSING */}
      {step === "photo" && isProcessing && (
        <div style={styles.processingScreen}>
          <div style={styles.processingCard}>
            {capturedImage && <img src={capturedImage} alt="captured" style={styles.processingThumb} />}
            <div style={styles.processingInfo}>
              <div style={styles.processingSpinner} />
              <h3 style={styles.processingTitle}>Analyzing Your Body</h3>
              <div style={styles.progressSteps}>
                {["Detecting body landmarks…", "Measuring proportions…", "Recommending size…", "Preparing dress overlay…"].map((s, i) => (
                  <div key={s} style={{ ...styles.progressStep, animationDelay: `${i * 0.7}s` }}>{s}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FITTING ROOM */}
      {step === "fitting" && capturedImage && (
        <div style={styles.fittingRoom}>
          {/* Left: image + dress overlay */}
          <div style={styles.fittingLeft}>
            <div style={styles.fittingCanvas}>
              <img src={capturedImage} alt="you" style={styles.userPhoto} />
              {/* Dress overlay */}
              <div style={{ ...styles.dressOverlay, background: selectedDress.gradient, opacity: overlayOpacity }}>
                <span style={styles.dressEmoji}>{selectedDress.emoji}</span>
                <div style={styles.dressShape} />
              </div>
              {/* Fit badge */}
              <div style={styles.fitBadge}>
                <span style={styles.fitScore}>{bodyMetrics?.fitScore}%</span>
                <span style={styles.fitLabel}>Fit Score</span>
              </div>
              <div style={styles.sizeBadge}>Size {selectedSize}</div>
            </div>

            {/* Opacity control */}
            <div style={styles.opacityControl}>
              <span style={styles.opacityLabel}>Overlay Intensity</span>
              <input type="range" min={0.3} max={1} step={0.05} value={overlayOpacity}
                onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
                style={styles.slider} />
              <span style={styles.opacityVal}>{Math.round(overlayOpacity * 100)}%</span>
            </div>

            {/* Body metrics */}
            {bodyMetrics && (
              <div style={styles.metricsCard}>
                <h4 style={styles.metricsTitle}>📐 Detected Measurements</h4>
                <div style={styles.metricsGrid}>
                  {[
                    ["Height", bodyMetrics.height],
                    ["Shoulder", bodyMetrics.shoulder],
                    ["Chest", bodyMetrics.chest],
                    ["Waist", bodyMetrics.waist],
                    ["Hips", bodyMetrics.hips],
                  ].map(([label, val]) => (
                    <div key={label} style={styles.metric}>
                      <span style={styles.metricLabel}>{label}</span>
                      <span style={styles.metricVal}>{val}</span>
                    </div>
                  ))}
                </div>
                <div style={styles.recommendBadge}>
                  ✅ Recommended Size: <strong>{bodyMetrics.recommendedSize}</strong>
                </div>
              </div>
            )}
          </div>

          {/* Right: dress selector */}
          <div style={styles.fittingRight}>
            <h3 style={styles.panelTitle}>Choose Your Dress</h3>

            {/* Size selector */}
            <div style={styles.sizeRow}>
              {SIZES.map((s) => (
                <button key={s} onClick={() => setSelectedSize(s)}
                  style={{ ...styles.sizeBtn, ...(selectedSize === s ? styles.sizeBtnActive : {}) }}>
                  {s}
                  {bodyMetrics?.recommendedSize === s && <span style={styles.sizeStar}>★</span>}
                </button>
              ))}
            </div>

            {/* Dress grid */}
            <div style={styles.dressGrid}>
              {DRESSES.map((d) => (
                <div key={d.id} onClick={() => setSelectedDress(d)}
                  style={{ ...styles.dressCard, ...(selectedDress.id === d.id ? styles.dressCardActive : {}) }}>
                  <div style={{ ...styles.dressThumb, background: d.gradient }}>
                    <span style={{ fontSize: 32 }}>{d.emoji}</span>
                    <span style={styles.dressTag}>{d.tag}</span>
                  </div>
                  <div style={styles.dressInfo}>
                    <p style={styles.dressName}>{d.name}</p>
                    <p style={styles.dressCat}>{d.category}</p>
                    <div style={styles.dressMeta}>
                      <span style={styles.dressPrice}>{d.price}</span>
                      <button onClick={(e) => { e.stopPropagation(); toggleLike(d.id); }} style={styles.likeBtn}>
                        {liked[d.id] ? "❤️" : "🤍"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.actionBtns}>
              <button style={styles.addCartBtn}>🛒 Add to Cart — {selectedDress.price}</button>
              <button style={styles.saveBtn}>💾 Save Look</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:1} }
        @keyframes progressIn { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
        * { box-sizing:border-box; margin:0; padding:0; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:16px; height:16px; border-radius:50%; background:#f5a623; cursor:pointer; }
        input[type=range]::-webkit-slider-runnable-track { height:4px; background:rgba(255,255,255,.2); border-radius:2px; }
      `}</style>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    fontFamily: "'DM Sans', sans-serif",
    color: "#1a1a1a",
    position: "relative",
    overflowX: "hidden",
    background: "#ffffff",
  },
  bg: {
    position: "fixed", inset: 0, zIndex: 0,
    background: "radial-gradient(ellipse 80% 60% at 20% 10%, #f3e8ff 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 90%, #e8f4ff 0%, transparent 60%), #ffffff",
  },
  bgGrain: {
    position: "fixed", inset: 0, zIndex: 1, opacity: 0.04,
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
    pointerEvents: "none",
  },
  header: {
    position: "relative", zIndex: 10,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "20px 40px",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
    background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)",
  },
  logo: { display: "flex", alignItems: "center", gap: 10 },
  logoIcon: { color: "#f5a623", fontSize: 20 },
  logoText: { fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 700, letterSpacing: 4 },
  logoBadge: { fontSize: 11, background: "rgba(245,166,35,0.15)", border: "1px solid rgba(245,166,35,0.3)", color: "#f5a623", padding: "2px 10px", borderRadius: 20, letterSpacing: 1 },
  backBtn: { background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.08)", color: "#1a1a1a", padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontSize: 13, letterSpacing: 0.5 },

  // Landing
  landing: {
    position: "relative", zIndex: 5,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    maxWidth: 1200, margin: "0 auto", padding: "80px 40px", gap: 60,
    minHeight: "calc(100vh - 80px)",
  },
  landingContent: { flex: 1, animation: "fadeUp .8s ease both" },
  landingEyebrow: { fontSize: 12, letterSpacing: 3, color: "#f5a623", textTransform: "uppercase", marginBottom: 16 },
  landingTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(52px, 7vw, 88px)", lineHeight: 1.05, fontWeight: 700, marginBottom: 24 },
  landingAccent: { color: "#f5a623" },
  landingDesc: { fontSize: 16, lineHeight: 1.7, color: "rgba(0,0,0,0.65)", maxWidth: 480, marginBottom: 36 },
  features: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 44 },
  featureItem: { display: "flex", alignItems: "center", gap: 12 },
  featureIcon: { fontSize: 18, width: 32 },
  featureText: { fontSize: 14, color: "rgba(0,0,0,0.7)" },
  ctaBtn: {
    background: "linear-gradient(135deg, #f5a623, #e07b20)", border: "none",
    color: "#0d0c0a", padding: "16px 40px", borderRadius: 50,
    fontSize: 16, fontWeight: 600, cursor: "pointer", letterSpacing: 0.5,
    boxShadow: "0 8px 32px rgba(245,166,35,0.3)", transition: "transform .2s, box-shadow .2s",
  },
  landingVisual: {
    flex: 1, display: "flex", justifyContent: "center", alignItems: "center",
    position: "relative", height: 400,
  },
  previewCard: {
    position: "absolute", width: 160, height: 220, borderRadius: 20,
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
  },
  previewName: { fontSize: 13, fontWeight: 600, color: "#fff", textAlign: "center" },
  previewPrice: { fontSize: 12, color: "rgba(255,255,255,0.8)" },

  // Camera
  cameraSection: {
    position: "relative", zIndex: 5,
    maxWidth: 780, margin: "0 auto", padding: "48px 24px",
    animation: "fadeUp .6s ease both",
  },
  sectionHeader: { textAlign: "center", marginBottom: 28 },
  sectionTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 700, marginBottom: 8 },
  sectionSub: { color: "rgba(0,0,0,0.55)", fontSize: 14 },
  tabRow: { display: "flex", gap: 8, marginBottom: 20, background: "rgba(0,0,0,0.05)", borderRadius: 12, padding: 4 },
  tab: { flex: 1, padding: "10px 0", borderRadius: 10, border: "none", background: "transparent", color: "rgba(0,0,0,0.5)", cursor: "pointer", fontSize: 14, fontWeight: 500, transition: "all .2s" },
  tabActive: { background: "rgba(245,166,35,0.18)", color: "#f5a623", border: "1px solid rgba(245,166,35,0.3)" },
  cameraWrap: {
    position: "relative", borderRadius: 20, overflow: "hidden",
    background: "#111", aspectRatio: "4/3", width: "100%",
    border: "1px solid rgba(0,0,0,0.08)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  video: { width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" },
  cameraError: { textAlign: "center", color: "rgba(255,255,255,0.5)", padding: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 },
  guideOverlay: {
    position: "absolute", inset: 0, pointerEvents: "none",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.4) 100%)",
  },
  guideSilhouette: { fontSize: 80, opacity: 0.2 },
  guideText: { color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 8 },
  captureBtn: {
    position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)",
    width: 64, height: 64, borderRadius: "50%",
    background: "rgba(255,255,255,0.15)", border: "3px solid rgba(255,255,255,0.6)",
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    transition: "transform .1s",
  },
  captureInner: { width: 46, height: 46, borderRadius: "50%", background: "#fff", display: "block" },
  uploadZone: {
    width: "100%", height: "100%", cursor: "pointer",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12,
    border: "2px dashed rgba(255,255,255,0.2)", borderRadius: 20, padding: 40,
    transition: "border-color .2s",
  },
  uploadText: { fontSize: 16, fontWeight: 500, color: "#fff" },
  uploadSub: { fontSize: 13, color: "rgba(255,255,255,0.6)" },
  uploadBtn: { background: "rgba(245,166,35,0.15)", border: "1px solid rgba(245,166,35,0.4)", color: "#f5a623", padding: "10px 28px", borderRadius: 8, fontSize: 14 },
  tips: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16, justifyContent: "center" },
  tip: { fontSize: 12, color: "rgba(0,0,0,0.5)", background: "rgba(0,0,0,0.05)", padding: "4px 12px", borderRadius: 20 },

  // Processing
  processingScreen: {
    position: "relative", zIndex: 5, minHeight: "calc(100vh - 80px)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
  },
  processingCard: {
    display: "flex", gap: 40, alignItems: "center",
    background: "rgba(255,255,255,0.8)", border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 24, padding: 40, maxWidth: 700, width: "100%",
  },
  processingThumb: { width: 200, height: 260, objectFit: "cover", borderRadius: 16 },
  processingInfo: { flex: 1 },
  processingSpinner: {
    width: 40, height: 40, borderRadius: "50%", border: "3px solid rgba(245,166,35,0.2)",
    borderTopColor: "#f5a623", animation: "spin 1s linear infinite", marginBottom: 20,
  },
  processingTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, marginBottom: 20 },
  progressSteps: { display: "flex", flexDirection: "column", gap: 10 },
  progressStep: { fontSize: 13, color: "rgba(0,0,0,0.6)", animation: "progressIn .5s ease both", animationFillMode: "both" },

  // Fitting room
  fittingRoom: {
    position: "relative", zIndex: 5,
    display: "flex", gap: 28, maxWidth: 1280, margin: "0 auto", padding: "28px 24px",
    minHeight: "calc(100vh - 80px)", alignItems: "flex-start",
    animation: "fadeUp .6s ease both",
  },
  fittingLeft: { flex: "0 0 460px", display: "flex", flexDirection: "column", gap: 16 },
  fittingCanvas: {
    position: "relative", borderRadius: 20, overflow: "hidden",
    aspectRatio: "3/4", background: "#111",
    border: "1px solid rgba(0,0,0,0.08)",
  },
  userPhoto: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  dressOverlay: {
    position: "absolute", inset: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexDirection: "column", mixBlendMode: "multiply",
    transition: "opacity .3s, background .5s",
  },
  dressEmoji: { fontSize: 80, filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.5))", zIndex: 2 },
  dressShape: {
    position: "absolute", bottom: "10%", left: "20%", right: "20%", top: "20%",
    background: "inherit", clipPath: "polygon(30% 0%, 70% 0%, 90% 20%, 95% 100%, 5% 100%, 10% 20%)",
    opacity: 0.7,
  },
  fitBadge: {
    position: "absolute", top: 16, right: 16, background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(8px)", borderRadius: 12, padding: "8px 14px",
    display: "flex", flexDirection: "column", alignItems: "center",
    border: "1px solid rgba(245,166,35,0.3)",
  },
  fitScore: { fontSize: 22, fontWeight: 700, color: "#f5a623" },
  fitLabel: { fontSize: 10, color: "rgba(255,255,255,0.8)", letterSpacing: 1 },
  sizeBadge: {
    position: "absolute", top: 16, left: 16,
    background: "rgba(245,166,35,0.85)", color: "#0d0c0a",
    borderRadius: 8, padding: "5px 12px", fontSize: 13, fontWeight: 700,
  },
  opacityControl: {
    display: "flex", alignItems: "center", gap: 12,
    background: "rgba(0,0,0,0.04)", borderRadius: 12, padding: "12px 16px",
  },
  opacityLabel: { fontSize: 12, color: "rgba(0,0,0,0.5)", whiteSpace: "nowrap" },
  slider: { flex: 1, cursor: "pointer", accentColor: "#f5a623" },
  opacityVal: { fontSize: 12, color: "#f5a623", width: 36, textAlign: "right" },
  metricsCard: {
    background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 16, padding: 20,
  },
  metricsTitle: { fontSize: 13, fontWeight: 600, marginBottom: 14, color: "rgba(0,0,0,0.7)" },
  metricsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 12 },
  metric: { display: "flex", flexDirection: "column", gap: 2 },
  metricLabel: { fontSize: 11, color: "rgba(0,0,0,0.4)", textTransform: "uppercase", letterSpacing: 1 },
  metricVal: { fontSize: 15, fontWeight: 600, color: "#f5a623" },
  recommendBadge: { background: "rgba(39,174,96,0.12)", border: "1px solid rgba(39,174,96,0.25)", borderRadius: 8, padding: "8px 14px", fontSize: 13, color: "#2ecc71" },

  // Right panel
  fittingRight: { flex: 1, display: "flex", flexDirection: "column", gap: 18 },
  panelTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 700 },
  sizeRow: { display: "flex", gap: 8, flexWrap: "wrap" },
  sizeBtn: {
    position: "relative", width: 52, height: 52, borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.12)", background: "rgba(0,0,0,0.04)",
    color: "rgba(0,0,0,0.6)", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .2s",
  },
  sizeBtnActive: { background: "rgba(245,166,35,0.18)", border: "1px solid rgba(245,166,35,0.5)", color: "#f5a623" },
  sizeStar: { position: "absolute", top: -4, right: -4, fontSize: 8, color: "#f5a623" },
  dressGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 },
  dressCard: {
    borderRadius: 14, overflow: "hidden", cursor: "pointer",
    border: "2px solid transparent", background: "rgba(255,255,255,0.04)",
    transition: "all .25s", boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  dressCardActive: { border: "2px solid #f5a623", boxShadow: "0 0 24px rgba(245,166,35,0.2)" },
  dressThumb: {
    height: 100, display: "flex", alignItems: "center", justifyContent: "center",
    position: "relative",
  },
  dressTag: { position: "absolute", top: 6, right: 6, fontSize: 9, background: "rgba(0,0,0,0.5)", color: "#fff", padding: "2px 6px", borderRadius: 20, letterSpacing: 0.5 },
  dressInfo: { padding: "10px 10px 8px" },
  dressName: { fontSize: 12, fontWeight: 600, marginBottom: 2 },
  dressCat: { fontSize: 11, color: "rgba(0,0,0,0.4)", marginBottom: 6 },
  dressMeta: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  dressPrice: { fontSize: 13, fontWeight: 700, color: "#f5a623" },
  likeBtn: { background: "none", border: "none", cursor: "pointer", fontSize: 14 },
  actionBtns: { display: "flex", gap: 10, marginTop: 4 },
  addCartBtn: {
    flex: 1, background: "linear-gradient(135deg, #f5a623, #e07b20)", border: "none",
    color: "#0d0c0a", padding: "14px 20px", borderRadius: 12,
    fontSize: 14, fontWeight: 700, cursor: "pointer",
    boxShadow: "0 6px 24px rgba(245,166,35,0.3)",
  },
  saveBtn: {
    background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)",
    color: "#1a1a1a", padding: "14px 20px", borderRadius: 12,
    fontSize: 14, fontWeight: 600, cursor: "pointer",
  },
};
