import { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, Volume2, VolumeX, X } from "lucide-react";


export function readAloud(text) {
  if (!text || typeof text !== "string") return;

  window.speechSynthesis.cancel();
  setTimeout(() => {
    const u    = new SpeechSynthesisUtterance(text.slice(0, 300));
    u.lang     = "en-US";
    u.rate     = 0.9;
    u.volume   = 1;
    u.onerror  = (e) => console.error("readAloud TTS error:", e.error);
    window.speechSynthesis.speak(u);
  }, 100);
}


const VoiceAssistant = ({ onSearch, onClose }) => {
  const [status, setStatus]         = useState("idle");
  const [transcript, setTranscript] = useState("");
  const [response, setResponse]     = useState("");
  const [speaking, setSpeaking]     = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [debugLog, setDebugLog]     = useState([]);
  const [micError, setMicError]     = useState("");
  const [micPermission, setMicPermission] = useState("unknown"); // unknown | granted | denied

  const recRef        = useRef(null);
  const listeningRef  = useRef(false);
  const transcriptRef = useRef("");

  const log = useCallback((msg) => {
    console.log("[Voice]", msg);
    setDebugLog(prev => [...prev.slice(-5), msg]);
  }, []);

  const SpeechRecognitionAPI =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const isSupported = !!SpeechRecognitionAPI;

  // ── Check mic permission on mount ────────────────────────────────────
  useEffect(() => {
    if (!navigator.permissions) return;
    navigator.permissions.query({ name: "microphone" }).then(result => {
      setMicPermission(result.state); // granted | denied | prompt
      result.onchange = () => setMicPermission(result.state);
    }).catch(() => {});
  }, []);

  // ── TTS ──────────────────────────────────────────────────────────────
  const speak = useCallback((text) => {
    if (!ttsEnabled || !text) { setStatus("idle"); return; }
    window.speechSynthesis.cancel();
    setTimeout(() => {
      const u   = new SpeechSynthesisUtterance(text.slice(0, 500));
      u.lang    = "en-US";
      u.rate    = 0.9;
      u.volume  = 1;
      u.onstart = () => { setSpeaking(true);  setStatus("speaking"); };
      u.onend   = () => { setSpeaking(false); setStatus("idle"); };
      u.onerror = (e) => {
        log("TTS error: " + e.error);
        setSpeaking(false);
        setStatus("idle");
      };
      window.speechSynthesis.speak(u);
    }, 100);
  }, [ttsEnabled, log]);

  // ── Test TTS button ───────────────────────────────────────────────────
  const testTTS = () => {
    speak("Hello! Voice assistant is working correctly.");
  };

  // ── Process command ───────────────────────────────────────────────────
  const processCommand = useCallback(async (text) => {
    log("Processing: " + text);
    setStatus("thinking");

    // Search command
    if (/^(search for|find|show me|look for)\s+/i.test(text)) {
      const query = text.replace(/^(search for|find|show me|look for)\s+/i, "").trim();
      log("Search: " + query);
      if (onSearch) onSearch(query);
      const reply = `Searching for ${query}`;
      setResponse(reply);
      speak(reply);
      return;
    }

    // Ask Gemini
    try {
      log("Calling Gemini...");
      const res = await fetch("http://localhost:8080/api/v1/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data  = await res.json();
      const reply = data.response || data.text || "No response from AI.";
      log("Reply: " + reply.slice(0, 60));
      setResponse(reply);
      speak(reply);
    } catch (err) {
      log("Error: " + err.message);
      const msg = "Could not reach the backend. Make sure Spring Boot is running on port 8080.";
      setResponse(msg);
      speak(msg);
    }
  }, [onSearch, speak, log]);

 
  const requestMicPermission = async () => {
    try {
      log("Requesting mic permission...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop()); 
      setMicPermission("granted");
      setMicError("");
      log("Mic permission granted");
    } catch (err) {
      log("Mic permission denied: " + err.message);
      setMicPermission("denied");
      setMicError("Microphone access denied. Click the 🔒 lock icon in the browser address bar → allow microphone → refresh the page.");
    }
  };


  const startListening = useCallback(async () => {
    if (!isSupported) {
      setMicError("Not supported. Please use Google Chrome or Microsoft Edge.");
      return;
    }
    if (listeningRef.current) return;


    if (micPermission !== "granted") {
      await requestMicPermission();
      if (micPermission === "denied") return;
    }

    setMicError("");
    setTranscript("");
    setResponse("");
    transcriptRef.current = "";
    log("Starting recognition...");

    const rec           = new SpeechRecognitionAPI();
    rec.lang            = "en-US";
    rec.interimResults  = true;
    rec.continuous      = false;
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      log("Mic is active — speak now");
      listeningRef.current = true;
      setStatus("listening");
    };

    rec.onresult = (e) => {
      const text = Array.from(e.results)
        .map(r => r[0].transcript)
        .join(" ")
        .trim();
      log("Heard: " + text);
      setTranscript(text);
      transcriptRef.current = text;
    };

    rec.onend = () => {
      log("Mic ended, transcript: '" + transcriptRef.current + "'");
      listeningRef.current = false;
      const final = transcriptRef.current.trim();
      if (final) {
        processCommand(final);
      } else {
        log("No speech detected");
        setStatus("idle");
        setMicError("No speech detected. Try speaking louder or closer to your microphone.");
      }
    };

    rec.onerror = (e) => {
      log("Mic error: " + e.error);
      listeningRef.current = false;
      setStatus("idle");
      const msgs = {
        "not-allowed":    "Microphone blocked. Click 🔒 in address bar → allow microphone → refresh.",
        "no-speech":      "No speech detected. Speak louder or closer to the mic.",
        "network":        "Network error with speech service.",
        "audio-capture":  "No microphone found. Plug in a microphone.",
        "aborted":        "Mic was stopped.",
        "service-not-allowed": "Speech service not allowed. Try running on localhost.",
      };
      setMicError(msgs[e.error] || "Mic error: " + e.error + ". Try refreshing the page.");
    };

    recRef.current = rec;
    try {
      rec.start();
      log("rec.start() OK");
    } catch (e) {
      log("rec.start() failed: " + e.message);
      setMicError("Could not start mic: " + e.message + ". Try refreshing the page.");
      listeningRef.current = false;
      setStatus("idle");
    }
  }, [isSupported, micPermission, processCommand, log]);

 
  const stopListening = useCallback(() => {
    if (recRef.current && listeningRef.current) {
      recRef.current.stop();
      log("Stopped manually");
    }
    listeningRef.current = false;
    setStatus("idle");
  }, [log]);

  const toggleListening = () => {
    if (listeningRef.current) stopListening();
    else startListening();
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setStatus("idle");
  };

  useEffect(() => {
    return () => {
      if (recRef.current) try { recRef.current.abort(); } catch (_) {}
      window.speechSynthesis.cancel();
    };
  }, []);

  const isListening = status === "listening";
  const isDisabled  = status === "thinking" || status === "speaking";

  const statusLabel = {
    idle:      "Tap mic and speak",
    listening: "Listening… speak now",
    thinking:  "Thinking…",
    speaking:  "Speaking…",
  }[status] || "Tap mic and speak";

 
  if (!isSupported) {
    return (
      <div style={s.container}>
        <div style={s.header}>
          <span style={s.title}>Voice Assistant</span>
          <button style={s.iconBtn} onClick={onClose}><X size={16}/></button>
        </div>
        <div style={s.errorBox}>
          ⚠️ Speech recognition is not supported.<br/>
          Please use <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong>.
        </div>
      </div>
    );
  }

  return (
    <div style={s.container}>
      {/* Header */}
      <div style={s.header}>
        <span style={s.title}>Voice Assistant</span>
        <div style={{ display:"flex", gap:8 }}>
          <button
            style={{ ...s.iconBtn, color: ttsEnabled ? "#557a8c" : "#999" }}
            onClick={() => { setTtsEnabled(v => !v); if (speaking) stopSpeaking(); }}
            title={ttsEnabled ? "Mute voice" : "Unmute voice"}
          >
            {ttsEnabled ? <Volume2 size={16}/> : <VolumeX size={16}/>}
          </button>
          <button style={s.iconBtn} onClick={onClose}><X size={16}/></button>
        </div>
      </div>

      {/* Mic permission warning */}
      {micPermission === "denied" && (
        <div style={s.errorBox}>
          🔒 Microphone is blocked.<br/>
          Click the lock icon 🔒 in your browser address bar → allow microphone → refresh the page.
        </div>
      )}

      {/* Mic button */}
      <div style={s.micArea}>
        <button
          style={{
            ...s.micBtn,
            background: isListening ? "#ef4444" : isDisabled ? "#94a3b8" : "#557a8c",
            transform:  isListening ? "scale(1.1)" : "scale(1)",
            cursor:     isDisabled ? "not-allowed" : "pointer",
          }}
          onClick={toggleListening}
          disabled={isDisabled}
        >
          {isListening ? <MicOff size={28} color="#fff"/> : <Mic size={28} color="#fff"/>}
        </button>
        {isListening && (
          <>
            <div style={{ ...s.ring, animationDelay:"0s" }}/>
            <div style={{ ...s.ring, animationDelay:"0.4s" }}/>
          </>
        )}
      </div>

      <p style={s.statusLabel}>{statusLabel}</p>

      {/* Test TTS button */}
      <button onClick={testTTS} style={s.testBtn}>
        🔊 Test voice output
      </button>

      {/* Mic error */}
      {micError && <div style={s.errorBox}>⚠️ {micError}</div>}

      {/* Transcript */}
      {transcript && (
        <div style={s.bubble}>
          <span style={s.label}>You said:</span>
          <p style={s.bubbleText}>{transcript}</p>
        </div>
      )}

      {/* Response */}
      {response && (
        <div style={{ ...s.bubble, background:"#f0f7fa" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={s.label}>Assistant:</span>
            {speaking && <button style={s.iconBtn} onClick={stopSpeaking}>Stop</button>}
          </div>
          <p style={s.bubbleText}>{response}</p>
        </div>
      )}

      {/* Debug log */}
      {debugLog.length > 0 && (
        <div style={s.debugBox}>
          <div style={{ fontSize:10, color:"#94a3b8", marginBottom:3, fontWeight:600 }}>DEBUG</div>
          {debugLog.map((l, i) => (
            <div key={i} style={{ fontSize:10, color:"#64748b" }}>→ {l}</div>
          ))}
        </div>
      )}

      {/* Hints */}
      <div style={s.hint}>
        <p style={s.hintTitle}>Try saying:</p>
        <p style={s.hintCmd}>"Search for men's shirts"</p>
        <p style={s.hintCmd}>"What are the top deals?"</p>
        <p style={s.hintCmd}>"Find laptops"</p>
      </div>

      <style>{`
        @keyframes ping {
          0%   { transform:scale(1);   opacity:0.5; }
          100% { transform:scale(2.4); opacity:0; }
        }
      `}</style>
    </div>
  );
};

const s = {
  container:   { background:"#fff", borderRadius:16, boxShadow:"0 8px 32px rgba(0,0,0,0.14)", padding:"20px", width:320, fontFamily:"'DM Sans',sans-serif" },
  header:      { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 },
  title:       { fontSize:16, fontWeight:700, color:"#1a1a1a" },
  iconBtn:     { background:"none", border:"none", cursor:"pointer", color:"#64748b", display:"flex", alignItems:"center", padding:4, borderRadius:6, fontFamily:"inherit", fontSize:12 },
  micArea:     { display:"flex", justifyContent:"center", alignItems:"center", position:"relative", height:96, marginBottom:8 },
  micBtn:      { width:72, height:72, borderRadius:"50%", border:"none", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s", zIndex:2, position:"relative" },
  ring:        { position:"absolute", width:72, height:72, borderRadius:"50%", border:"2px solid #ef4444", animation:"ping 1.4s ease-out infinite", opacity:0, zIndex:1 },
  statusLabel: { textAlign:"center", color:"#64748b", fontSize:13, marginBottom:8 },
  testBtn:     { display:"block", width:"100%", background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:8, padding:"6px 0", fontSize:12, color:"#64748b", cursor:"pointer", marginBottom:10, fontFamily:"inherit" },
  errorBox:    { background:"#fef2f2", border:"1px solid #fecaca", borderRadius:8, padding:"8px 12px", fontSize:12, color:"#dc2626", marginBottom:10, lineHeight:1.7 },
  bubble:      { background:"#f8fafc", borderRadius:10, padding:"10px 14px", marginBottom:10 },
  label:       { fontSize:11, fontWeight:700, color:"#557a8c", textTransform:"uppercase", letterSpacing:"0.05em" },
  bubbleText:  { fontSize:13, color:"#1a1a1a", margin:"4px 0 0", lineHeight:1.5 },
  debugBox:    { background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:8, padding:"6px 10px", marginBottom:8 },
  hint:        { borderTop:"1px solid #f1f5f9", paddingTop:10, marginTop:4 },
  hintTitle:   { fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", margin:"0 0 5px" },
  hintCmd:     { fontSize:12, color:"#64748b", margin:"2px 0", fontStyle:"italic" },
};

export default VoiceAssistant;