import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, CheckCircle2, AlertCircle, Sparkles, Ruler, RefreshCw, Shirt, Video, X, Zap, Download } from 'lucide-react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@400;500;700&display=swap');

  .vfr-container {
    min-height: 100vh;
    background-color: #F4F6FA;
    padding: 1rem;
    color: #1a1a1a;
    font-family: 'DM Sans', sans-serif;
  }
  @media (min-width: 768px) {
    .vfr-container { padding: 2rem; }
  }

  .vfr-header {
    max-width: 72rem;
    margin: 0 auto 3rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1.5rem;
  }
  @media (min-width: 768px) {
    .vfr-header { flex-direction: row; align-items: center; }
  }

  .vfr-h1 {
    font-family: 'Syne', sans-serif;
    font-size: 2.25rem;
    font-weight: 800;
    letter-spacing: -0.025em;
    color: #1a1a1a;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .vfr-header-p {
    color: #64748b;
    margin-top: 0.5rem;
    font-size: 1.125rem;
  }

  .vfr-size-selector { display: flex; gap: 0.5rem; }
  .vfr-size-btn {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-weight: 600;
    transition: all 0.2s ease;
    background-color: #fff;
    color: #475569;
    border: 1px solid #e2e8f0;
    cursor: pointer;
  }
  .vfr-size-btn:hover { border-color: #557a8c; }
  .vfr-size-btn.active {
    background-color: #557a8c;
    color: #fff;
    box-shadow: 0 10px 15px -3px rgba(85, 122, 140, 0.3), 0 4px 6px -4px rgba(85, 122, 140, 0.3);
    transform: scale(1.05);
    border-color: #557a8c;
  }

  .vfr-main-grid {
    max-width: 72rem;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  @media (min-width: 1024px) {
    .vfr-main-grid { grid-template-columns: repeat(3, 1fr); }
  }

  .vfr-input-col {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  @media (min-width: 1024px) {
    .vfr-input-col { grid-column: span 1 / span 1; }
  }

  .vfr-card {
    background-color: #fff;
    padding: 1.5rem;
    border-radius: 1.5rem;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    border: 1px solid #e2e8f0;
  }

  .vfr-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .vfr-card-title {
    font-size: 1.125rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .vfr-dropzone {
    position: relative;
    aspect-ratio: 3 / 4;
    border-radius: 1rem;
    background-color: #F8F9FC;
    border: 2px dashed #cbd5e1;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.2s ease;
  }
  .vfr-dropzone:hover { border-color: rgba(85, 122, 140, 0.5); }
  .vfr-dropzone-square { aspect-ratio: 1 / 1; }

  .vfr-camera-view { position: relative; width: 100%; height: 100%; background-color: #000; }
  .vfr-video { width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1); }
  .vfr-canvas { display: none; }
  .vfr-capture-btn {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    background-color: #fff;
    border-radius: 9999px;
    padding: 1rem;
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
    transition: transform 0.2s;
    border: none;
    cursor: pointer;
  }
  .vfr-capture-btn:hover { transform: translateX(-50%) scale(1.1); }
  .vfr-capture-btn-inner { width: 1rem; height: 1rem; background-color: #557a8c; border-radius: 9999px; }
  .vfr-close-camera-btn {
    position: absolute; top: 0.5rem; right: 0.5rem; padding: 0.5rem; background-color: rgba(0,0,0,0.5);
    color: #fff; border-radius: 9999px; border: none; cursor: pointer;
  }
  .vfr-close-camera-btn:hover { background-color: rgba(0,0,0,0.7); }

  .vfr-img-preview { width: 100%; height: 100%; object-fit: cover; }
  .vfr-img-overlay {
    position: absolute; inset: 0; background-color: rgba(0,0,0,0.4); opacity: 0;
    transition: opacity 0.2s; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  }
  .vfr-dropzone:hover .vfr-img-overlay { opacity: 1; }
  .vfr-refresh-btn {
    padding: 0.5rem; background-color: #fff; color: #ef4444; border-radius: 9999px;
    border: none; cursor: pointer; transition: background-color 0.2s;
  }
  .vfr-refresh-btn:hover { background-color: #fef2f2; }

  .vfr-upload-placeholder { text-align: center; padding: 1.5rem; }
  .vfr-upload-icon-wrap {
    width: 4rem; height: 4rem; background-color: #fff; border-radius: 9999px;
    display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); color: #557a8c;
  }
  .vfr-upload-text { font-size: 0.875rem; font-weight: 600; color: #475569; }
  .vfr-upload-subtext { font-size: 0.75rem; color: #94a3b8; margin-top: 0.25rem; }
  .vfr-or-divider { margin-top: 1rem; font-size: 0.75rem; color: #94a3b8; }
  .vfr-open-camera-link {
    margin-top: 0.75rem; font-size: 0.875rem; font-weight: 600; color: #557a8c;
    background: none; border: none; cursor: pointer;
  }
  .vfr-open-camera-link:hover { text-decoration: underline; }

  .vfr-cloth-img { width: 100%; height: 100%; object-fit: contain; padding: 1rem; }
  .vfr-upload-placeholder-sm { display: flex; flex-direction: column; align-items: center; }
  .vfr-upload-placeholder-sm span { font-size: 0.875rem; color: #64748b; }

  .vfr-generate-btn {
    width: 100%; padding: 1rem 0; border-radius: 1rem; font-weight: 700; font-size: 1.125rem;
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    transition: all 0.2s; border: none; cursor: pointer;
  }
  .vfr-generate-btn:disabled { background-color: #e2e8f0; color: #94a3b8; cursor: not-allowed; }
  .vfr-generate-btn:not(:disabled) {
    background-image: linear-gradient(to right, #557a8c, #7090a0);
    color: #fff;
    box-shadow: 0 20px 25px -5px rgba(85, 122, 140, 0.3), 0 8px 10px -6px rgba(85, 122, 140, 0.3);
  }
  .vfr-generate-btn:not(:disabled):hover { transform: translateY(-2px); }

  .vfr-results-col { display: flex; flex-direction: column; gap: 1.5rem; }
  @media (min-width: 1024px) { .vfr-results-col { grid-column: span 2 / span 2; } }

  .vfr-preview-card {
    background-color: #fff; min-height: 600px; border-radius: 1.5rem;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); border: 1px solid #e2e8f0;
    overflow: hidden; display: flex; flex-direction: column;
  }
  .vfr-preview-header {
    padding: 1.5rem; border-bottom: 1px solid #f1f5f9; display: flex;
    justify-content: space-between; align-items: center; background-color: #FAFAFA;
  }
  .vfr-preview-title { font-size: 1.25rem; font-weight: 700; color: #1e293b; }
  .vfr-fit-badge {
    padding: 0.375rem 1rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 700;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .vfr-fit-badge.perfect { background-color: #dcfce7; color: #16a34a; }
  .vfr-fit-badge.tight { background-color: #fef3c7; color: #d97706; }
  .vfr-fit-badge.loose { background-color: #dbeafe; color: #2563eb; }

  .vfr-preview-body {
    flex: 1 1 0%; padding: 2rem; display: flex; align-items: center; justify-content: center;
    background-image: linear-gradient(to bottom right, #f8fafc, #ffffff);
    position: relative;
  }

  .vfr-spinner-container { text-align: center; }
  .vfr-spinner { position: relative; width: 6rem; height: 6rem; margin: 0 auto 1rem; }
  .vfr-spinner-track { position: absolute; inset: 0; border: 4px solid rgba(85, 122, 140, 0.3); border-radius: 50%; }
  .vfr-spinner-thumb {
    position: absolute; inset: 0; border: 4px solid #557a8c; border-radius: 50%;
    border-top-color: transparent; animation: vfr-spin 1s linear infinite;
  }
  .vfr-spinner-text { color: #64748b; font-weight: 500; animation: vfr-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
  .vfr-spinner-subtext { font-size: 0.75rem; color: #94a3b8; margin-top: 0.5rem; }

  .vfr-generated-img-wrap { position: relative; max-width: 28rem; width: 100%; }
  .vfr-download-btn {
    position: absolute; top: 1rem; right: 1rem; z-index: 10;
    padding: 0.5rem; background-color: rgba(255,255,255,0.9); backdrop-filter: blur(8px);
    border-radius: 9999px; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    border: none; cursor: pointer; transition: background-color 0.2s;
  }
  .vfr-download-btn:hover { background-color: #fff; }
  .vfr-generated-img {
    width: 100%; border-radius: 1rem;
    box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
    border: 8px solid #fff;
  }
  .vfr-match-score-bar {
    position: absolute; bottom: -1.5rem; left: 1.5rem; right: 1.5rem;
    background-color: #fff; padding: 1rem; border-radius: 0.75rem;
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
    border: 1px solid #f1f5f9; display: flex; align-items: center; gap: 1rem;
  }
  .vfr-progress-container { flex: 1 1 0%; height: 0.5rem; background-color: #f1f5f9; border-radius: 9999px; overflow: hidden; }
  .vfr-progress-fill { height: 100%; background-color: #557a8c; transition: width 1s ease; }
  .vfr-match-score-text { font-size: 0.875rem; font-weight: 700; color: #334155; }

  .vfr-results-placeholder { text-align: center; max-width: 20rem; }
  .vfr-results-placeholder-icon {
    width: 5rem; height: 5rem; background-color: #f1f5f9; border-radius: 9999px;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1rem; color: #cbd5e1;
  }
  .vfr-results-placeholder-text { color: #94a3b8; font-weight: 500; }

  .vfr-error-msg {
    position: absolute; bottom: 2rem; left: 2rem; right: 2rem;
    background-color: #fef2f2; color: #dc2626; padding: 1rem; border-radius: 0.75rem;
    border: 1px solid #fee2e2; display: flex; align-items: center; gap: 0.75rem;
  }
  .vfr-error-msg p { font-size: 0.875rem; font-weight: 500; margin: 0; }

  .vfr-analysis-footer { padding: 1.5rem; background-color: #1a1a1a; color: #fff; }
  .vfr-analysis-title { font-weight: 700; display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
  .vfr-analysis-text { color: #cbd5e1; font-size: 0.875rem; line-height: 1.625; margin: 0; }

  @keyframes vfr-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes vfr-pulse { 50% { opacity: .5; } }
`;

// ── Point this at your Spring Boot server ────────────────────────
const BACKEND_URL = "http://localhost:8080/api/v1/tryon"; //Make sure this is the correct URL

export default function VirtualFittingRoom() {
  const [userImage, setUserImage]       = useState(null);
  const [clothImage, setClothImage]     = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError]               = useState(null);
  
  // Camera state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleImageUpload = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setter(event.target.result);
        if (setter === setUserImage) setIsCameraOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    setError(null);
    setIsCameraOpen(true);
    setUserImage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError("Could not access camera. Please check permissions.");
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Match canvas size to video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      // Flip horizontally for mirror effect
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const dataUrl = canvas.toDataURL('image/jpeg');
      setUserImage(dataUrl);
      setIsCameraOpen(false);
      stopCamera();
    }
  };

  const runVirtualFitting = async () => {
    if (!userImage || !clothImage) {
      setError("Please provide both your photo and the clothing item.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setAnalysisResult(null);
    setGeneratedImage(null);

    try {
      const response = await fetch(`${BACKEND_URL}/fit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userImageBase64:  userImage,
          clothImageBase64: clothImage,
          selectedSize:     selectedSize,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data.message && data.message.startsWith("Error:")) {
        setError(data.message);
        return;
      }

      setAnalysisResult({
        match:  data.fitMatch,
        reason: data.fitReason,
        score:  data.fitScore,
      });

      if (data.generatedImageBase64) {
        setGeneratedImage(data.generatedImageBase64);
      }

    } catch (err) {
      console.error(err);
      setError("Could not connect to server. Is Spring Boot running on port 8080?");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="vfr-container">
        <header className="vfr-header">
          <div>
            <h1 className="vfr-h1">
              <Sparkles className="text-[#557a8c]" size={32} /> QuickArt Virtusl Mirror
            </h1>
            <p className="vfr-header-p">Experience clothes on you instantly with our Gen-AI engine.</p>
          </div>
          <div className="vfr-size-selector">
            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`vfr-size-btn ${selectedSize === size ? 'active' : ''}`}
              >
                {size}
              </button>
            ))}
          </div>
        </header>

        <main className="vfr-main-grid">
          {/* ── Inputs ────────────────────────────────────── */}
          <div className="vfr-input-col">
            <div className="vfr-card">
              <div className="vfr-card-header">
                <h2 className="vfr-card-title">
                  <Camera size={20} style={{ color: '#557a8c' }} /> Your Photo
                </h2>
                {!userImage && !isCameraOpen && (
                  <div className="flex gap-2">
                    <button onClick={startCamera} className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full font-semibold transition-colors flex items-center gap-1">
                      <Video size={12}/> Camera
                    </button>
                  </div>
                )}
              </div>
              
              <div className="vfr-dropzone">
                {isCameraOpen ? (
                  <div className="vfr-camera-view">
                    <video ref={videoRef} autoPlay playsInline className="vfr-video" />
                    <canvas ref={canvasRef} className="vfr-canvas" />
                    <button onClick={capturePhoto} className="vfr-capture-btn">
                      <div className="vfr-capture-btn-inner"></div>
                    </button>
                    <button onClick={() => {setIsCameraOpen(false); stopCamera();}} className="vfr-close-camera-btn">
                      <X size={16} />
                    </button>
                  </div>
                ) : userImage ? (
                  <>
                    <img src={userImage} className="vfr-img-preview" alt="User" />
                    <div className="vfr-img-overlay">
                      <button onClick={() => setUserImage(null)} className="vfr-refresh-btn">
                        <RefreshCw size={20} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="vfr-upload-placeholder">
                    <label style={{ cursor: 'pointer', display: 'block' }}>
                      <div className="vfr-upload-icon-wrap">
                        <Upload size={24} />
                      </div>
                      <span className="vfr-upload-text">Upload Image</span>
                      <p className="vfr-upload-subtext">JPG, PNG up to 5MB</p>
                      <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleImageUpload(e, setUserImage)} />
                    </label>
                    <div className="vfr-or-divider">OR</div>
                    <button onClick={startCamera} className="vfr-open-camera-link">
                      Open Live Camera
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="vfr-card">
              <h2 className="vfr-card-title" style={{ marginBottom: '1rem' }}>
                <Shirt size={20} style={{ color: '#557a8c' }} /> The Cloth
              </h2>
              <div className="vfr-dropzone vfr-dropzone-square">
                {clothImage ? (
                  <>
                    <img src={clothImage} className="vfr-cloth-img" alt="Cloth" />
                    <div className="vfr-img-overlay">
                      <button onClick={() => setClothImage(null)} className="vfr-refresh-btn">
                        <RefreshCw size={20} />
                      </button>
                    </div>
                  </>
                ) : (
                  <label className="vfr-upload-placeholder-sm" style={{ cursor: 'pointer' }}>
                    <Upload style={{ color: '#cbd5e1', marginBottom: '0.5rem' }} />
                    <span>Upload Clothing Item</span>
                    <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleImageUpload(e, setClothImage)} />
                  </label>
                )}
              </div>
            </div>

            <button
              onClick={runVirtualFitting}
              disabled={!userImage || !clothImage || isProcessing}
              className="vfr-generate-btn"
            >
              {isProcessing ? (
                <><RefreshCw style={{ animation: 'vfr-spin 1s linear infinite' }} /> Tailoring your look...</>
              ) : (
                <><Zap size={20} fill="currentColor" /> Generate Try-On</>
              )}
            </button>
          </div>

          {/* ── Results ───────────────────────────────────── */}
          <div className="vfr-results-col">
            <div className="vfr-preview-card">
              <div className="vfr-preview-header">
                <h2 className="vfr-preview-title">Preview Room</h2>
                {analysisResult && (
                  <div className={`vfr-fit-badge ${
                    analysisResult.match === 'Perfect' ? 'perfect' :
                    analysisResult.match === 'Tight'   ? 'tight'   : 'loose'
                  }`}>
                    {analysisResult.match === 'Perfect' ? <CheckCircle2 size={16} /> : <Ruler size={16} />}
                    Fit: {analysisResult.match}
                  </div>
                )}
              </div>

              <div className="vfr-preview-body">
                {isProcessing ? (
                  <div className="vfr-spinner-container">
                    <div className="vfr-spinner">
                      <div className="vfr-spinner-track"></div>
                      <div className="vfr-spinner-thumb"></div>
                    </div>
                    <p className="vfr-spinner-text">Running AI diffusion model...</p>
                    <p className="vfr-spinner-subtext">This may take 10-15 seconds</p>
                  </div>
                ) : generatedImage ? (
                  <div className="vfr-generated-img-wrap">
                    <div className="vfr-download-btn">
                       <button title="Download" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                         <Download size={20} style={{ color: '#334155' }}/>
                       </button>
                    </div>
                    <img src={generatedImage} className="vfr-generated-img" alt="Result" />
                    
                    <div className="vfr-match-score-bar">
                      <div className="vfr-progress-container">
                        <div
                          className="vfr-progress-fill"
                          style={{ width: `${analysisResult?.score || 0}%` }}
                        ></div>
                      </div>
                      <span className="vfr-match-score-text">{analysisResult?.score}% Match</span>
                    </div>
                  </div>
                ) : (
                  <div className="vfr-results-placeholder">
                    <div className="vfr-results-placeholder-icon">
                      <Ruler size={40} />
                    </div>
                    <h3 className="vfr-results-placeholder-text">Upload your details to start the virtual trial</h3>
                  </div>
                )}

                {error && (
                  <div className="vfr-error-msg">
                    <AlertCircle size={20} />
                    <p>{error}</p>
                  </div>
                )}
              </div>

              {analysisResult && (
                <div className="vfr-analysis-footer">
                  <h4 className="vfr-analysis-title">
                    <Sparkles size={16} style={{ color: '#557a8c' }} /> Fit Analysis
                  </h4>
                  <p className="vfr-analysis-text">{analysisResult.reason}</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}