import React, { useState } from 'react';
import { Camera, Upload, CheckCircle2, AlertCircle, Sparkles, Ruler, RefreshCw, Shirt } from 'lucide-react';

// ── Point this at your Spring Boot server ────────────────────────
const BACKEND_URL = "http://localhost:8080/api/v1/tryon";

export default function App() {
  const [userImage, setUserImage]       = useState(null);
  const [clothImage, setClothImage]     = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError]               = useState(null);

  const handleImageUpload = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setter(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const runVirtualFitting = async () => {
    if (!userImage || !clothImage) {
      setError("Please upload both your photo and the clothing item.");
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
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-900 font-sans">
      <header className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-indigo-900 flex items-center gap-2">
            <Sparkles className="text-indigo-600" /> AI Mirror
          </h1>
          <p className="text-slate-500 mt-1">Virtual Try-On &amp; Intelligent Size Matching</p>
        </div>
        <div className="flex gap-2">
          {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedSize === size
                  ? 'bg-indigo-600 text-white shadow-lg scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Inputs ────────────────────────────────────── */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Camera size={20} className="text-indigo-600" /> Step 1: Your Photo
            </h2>
            <div className="relative aspect-[3/4] rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 overflow-hidden flex items-center justify-center">
              {userImage ? (
                <>
                  <img src={userImage} className="w-full h-full object-cover" alt="User" />
                  <button onClick={() => setUserImage(null)} className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white text-red-500">
                    <RefreshCw size={16} />
                  </button>
                </>
              ) : (
                <label className="cursor-pointer flex flex-col items-center">
                  <Upload className="text-slate-400 mb-2" />
                  <span className="text-sm text-slate-500">Upload Frontal Photo</span>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, setUserImage)} />
                </label>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Shirt size={20} className="text-indigo-600" /> Step 2: The Cloth
            </h2>
            <div className="relative aspect-square rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 overflow-hidden flex items-center justify-center">
              {clothImage ? (
                <>
                  <img src={clothImage} className="w-full h-full object-contain p-4" alt="Cloth" />
                  <button onClick={() => setClothImage(null)} className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white text-red-500">
                    <RefreshCw size={16} />
                  </button>
                </>
              ) : (
                <label className="cursor-pointer flex flex-col items-center">
                  <Upload className="text-slate-400 mb-2" />
                  <span className="text-sm text-slate-500">Upload Clothing Item</span>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, setClothImage)} />
                </label>
              )}
            </div>
          </div>

          <button
            onClick={runVirtualFitting}
            disabled={!userImage || !clothImage || isProcessing}
            className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
              isProcessing
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-200'
            }`}
          >
            {isProcessing ? (
              <><RefreshCw className="animate-spin" /> Tailoring your look...</>
            ) : (
              <><Sparkles /> Visualize Fitting</>
            )}
          </button>
        </div>

        {/* ── Results ───────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white min-h-[600px] rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800">Preview Room</h2>
              {analysisResult && (
                <div className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 ${
                  analysisResult.match === 'Perfect' ? 'bg-emerald-100 text-emerald-700' :
                  analysisResult.match === 'Tight'   ? 'bg-amber-100 text-amber-700'   : 'bg-blue-100 text-blue-700'
                }`}>
                  {analysisResult.match === 'Perfect' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  Fit: {analysisResult.match}
                </div>
              )}
            </div>

            <div className="flex-1 p-8 flex items-center justify-center bg-gradient-to-br from-slate-50 to-white relative">
              {isProcessing ? (
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                  </div>
                  <p className="text-slate-500 animate-pulse">Scanning dimensions &amp; rendering textures...</p>
                </div>
              ) : generatedImage ? (
                <div className="relative max-w-md w-full">
                  <img src={generatedImage} className="w-full rounded-2xl shadow-2xl border-4 border-white" alt="Result" />
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-2xl shadow-lg border border-slate-100 text-center w-[90%]">
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">AI Match Score</p>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 transition-all duration-1000"
                        style={{ width: `${analysisResult?.score || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center max-w-xs">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <Ruler size={40} />
                  </div>
                  <h3 className="text-slate-400 font-medium">Upload your details to start the virtual trial</h3>
                </div>
              )}

              {error && (
                <div className="absolute bottom-8 left-8 right-8 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3">
                  <AlertCircle size={20} />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}
            </div>

            {analysisResult && (
              <div className="p-6 bg-indigo-900 text-white">
                <h4 className="font-bold flex items-center gap-2 mb-2">
                  <Sparkles size={16} /> Fit Analysis
                </h4>
                <p className="text-indigo-100 text-sm leading-relaxed">{analysisResult.reason}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}