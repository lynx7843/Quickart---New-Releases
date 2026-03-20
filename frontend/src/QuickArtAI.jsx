import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,400&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .qa-root {
    font-family: 'DM Sans', sans-serif;
    background: #F4F6FA;
    min-height: calc(100vh - 120px);
    display: flex;
    color: #1a1a1a;
  }

  /* SIDEBAR */
  .qa-sidebar {
    position: sticky;
    top: 0;
    height: 100vh;
    width: 64px;
    background: #ffffff;
    border-right: 1px solid #F0F0F0;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;
    gap: 6px;
    z-index: 200;
    box-shadow: 2px 0 16px rgba(0,0,0,0.05);
    flex-shrink: 0;
  }

  .qa-logo {
    width: 38px; height: 38px;
    background: #557a8c;
    border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    color: #fff;
    font-size: 13px;
    margin-bottom: 14px;
    box-shadow: 0 4px 14px rgba(85, 122, 140, 0.35);
  }

  .qa-divider {
    width: 3px; height: 28px;
    background: linear-gradient(180deg, #557a8c, #7090a0);
    border-radius: 2px;
    margin: 6px 0;
  }

  .qa-nav-btn {
    width: 42px; height: 42px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 11px;
    border: none;
    background: transparent;
    cursor: pointer;
    color: #557a8c;
    transition: all 0.2s ease;
    position: relative;
  }
  .qa-nav-btn:hover { background: #eef1f8; color: #557a8c; }
  .qa-nav-btn.active { color: #557a8c; background: #eef1f8; }
  .qa-nav-btn svg { width: 19px; height: 19px; }

  /* MAIN */
  .qa-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: #F4F6FA;
  }

  /* HERO */
  .qa-hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 64px 40px 32px;
    position: relative;
    overflow: hidden;
    background: #F4F6FA;
  }

  .qa-blobs {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }

  .qa-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(72px);
  }
  .qa-blob-1 {
    width: 480px; height: 380px;
    background: radial-gradient(circle, rgba(85, 122, 140, 0.3), rgba(85, 122, 140, 0.2));
    top: -120px; right: -60px;
    animation: drift1 9s ease-in-out infinite;
  }
  .qa-blob-2 {
    width: 380px; height: 320px;
    background: radial-gradient(circle, rgba(85, 122, 140, 0.25), rgba(85, 122, 140, 0.15));
    bottom: -60px; left: -40px;
    animation: drift2 11s ease-in-out infinite;
  }
  .qa-blob-3 {
    width: 280px; height: 280px;
    background: radial-gradient(circle, rgba(137, 162, 179, 0.3), rgba(85, 122, 140, 0.1));
    top: 35%; left: 25%;
    animation: drift3 13s ease-in-out infinite;
  }

  @keyframes drift1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-28px,18px) scale(1.06)} }
  @keyframes drift2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(18px,-28px) scale(1.09)} }
  @keyframes drift3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-12px,12px) scale(0.94)} }

  .qa-hero-content {
    position: relative;
    z-index: 1;
    text-align: center;
    width: 100%;
    max-width: 840px;
  }

  .qa-badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: rgba(85, 122, 140, 0.09);
    border: 1px solid rgba(85, 122, 140, 0.18);
    border-radius: 100px;
    padding: 6px 14px;
    font-size: 12px;
    font-weight: 500;
    color: #557a8c;
    margin-bottom: 22px;
    animation: fadeUp 0.5s ease both;
  }

  .qa-badge-dot {
    width: 6px; height: 6px;
    background: #557a8c;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.45;transform:scale(1.5)} }

  .qa-h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(26px, 3.8vw, 50px);
    font-weight: 800;
    line-height: 1.1;
    color: #1a1a1a;
    margin-bottom: 12px;
    animation: fadeUp 0.5s 0.08s ease both;
  }

  .qa-h1-accent {
    background: linear-gradient(135deg, #557a8c 0%, #7090a0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .qa-sub {
    color: #557a8c;
    font-size: 15px;
    margin-bottom: 36px;
    animation: fadeUp 0.5s 0.16s ease both;
  }

  @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }

  /* SEARCH */
  .qa-search-wrap {
    background: #ffffff;
    border: 1.5px solid #F0F0F0;
    border-radius: 20px;
    padding: 18px 20px 14px;
    box-shadow: 0 6px 32px rgba(0,0,0,0.04);
    margin-bottom: 22px;
    animation: fadeUp 0.5s 0.22s ease both;
    transition: box-shadow 0.3s, border-color 0.3s;
    text-align: left;
  }
  .qa-search-wrap.focused {
    border-color: #557a8c;
    box-shadow: 0 10px 44px rgba(85, 122, 140, 0.14), 0 0 0 3px rgba(85, 122, 140, 0.1);
  }

  .qa-textarea {
    width: 100%;
    border: none;
    outline: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    color: #1a1a1a;
    resize: none;
    background: transparent;
    min-height: 54px;
    line-height: 1.6;
  }
  .qa-textarea::placeholder { color: #aaa; }

  .qa-search-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
  }

  .qa-search-left { display: flex; gap: 6px; align-items: center; }

  .qa-icon-btn {
    width: 34px; height: 34px;
    border: 1px solid #F0F0F0;
    border-radius: 10px;
    background: transparent;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #557a8c;
    transition: all 0.2s;
  }
  .qa-icon-btn:hover { background: #eef1f8; color: #557a8c; border-color: #557a8c; }
  .qa-icon-btn svg { width: 15px; height: 15px; }

  .qa-hint { font-size: 12px; color: #aaa; }

  .qa-send {
    width: 40px; height: 40px;
    background: #1a1a1a;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.22s;
    flex-shrink: 0;
  }
  .qa-send:hover { background: #557a8c; transform: scale(1.06); }
  .qa-send svg { width: 17px; height: 17px; stroke: #fff; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

  /* CHIPS */
  .qa-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 9px;
    justify-content: center;
    animation: fadeUp 0.5s 0.3s ease both;
  }

  .qa-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #ffffff;
    border: 1px solid #F0F0F0;
    border-radius: 100px;
    padding: 8px 15px;
    font-size: 13px;
    color: #333;
    cursor: pointer;
    transition: all 0.22s ease;
    white-space: nowrap;
    font-family: 'DM Sans', sans-serif;
  }
  .qa-chip:hover {
    border-color: #557a8c;
    color: #557a8c;
    background: #fff;
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.07);
  }

  /* FEATURES */
  .qa-features {
    padding: 16px 40px 48px;
  }

  .qa-section-label {
    text-align: center;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #557a8c;
    margin-bottom: 16px;
  }

  .qa-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    max-width: 840px;
    margin: 0 auto;
    animation: fadeUp 0.5s 0.38s ease both;
  }

  .qa-card {
    background: #ffffff;
    border: 1px solid #F0F0F0;
    border-radius: 18px;
    padding: 22px;
    cursor: pointer;
    transition: all 0.28s ease;
    position: relative;
    overflow: hidden;
  }
  .qa-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(85, 122, 140, 0.06), transparent 60%);
    opacity: 0;
    transition: opacity 0.3s;
    border-radius: inherit;
  }
  .qa-card:hover {
    border-color: #557a8c;
    transform: translateY(-4px);
    box-shadow: 0 14px 44px rgba(0,0,0,0.08);
  }
  .qa-card:hover::after { opacity: 1; }

  .qa-card-icon {
    width: 46px; height: 46px;
    background: #F4F6FA;
    border-radius: 13px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    margin-bottom: 13px;
    transition: transform 0.3s;
    position: relative; z-index: 1;
  }
  .qa-card:hover .qa-card-icon { transform: scale(1.12) rotate(-4deg); }

  .qa-card-title {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 14px;
    margin-bottom: 7px;
    position: relative; z-index: 1;
  }

  .qa-card-desc {
    font-size: 12.5px;
    color: #557a8c;
    line-height: 1.55;
    position: relative; z-index: 1;
  }

  .qa-card-tag {
    display: inline-block;
    margin-top: 11px;
    font-size: 11px;
    color: #557a8c;
    font-weight: 500;
    background: rgba(85, 122, 140, 0.08);
    padding: 3px 9px;
    border-radius: 100px;
    position: relative; z-index: 1;
  }

  /* RECENT */
  .qa-recent {
    max-width: 840px;
    margin: 0 auto 56px;
    padding: 0 40px;
    animation: fadeUp 0.5s 0.46s ease both;
  }

  .qa-recent-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: #557a8c;
    margin-bottom: 11px;
  }

  .qa-recent-list { display: flex; flex-direction: column; gap: 7px; }

  .qa-recent-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 11px 15px;
    background: #ffffff;
    border: 1px solid #F0F0F0;
    border-radius: 12px;
    cursor: pointer;
    font-size: 13px;
    color: #555;
    transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .qa-recent-item:hover { border-color: #557a8c; color: #1a1a1a; background: #fff; }
  .qa-recent-item svg { width: 14px; height: 14px; flex-shrink: 0; stroke: currentColor; fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }

  @media (max-width: 720px) {
    .qa-grid { grid-template-columns: 1fr 1fr; }
    .qa-hero { padding: 44px 20px 24px; }
    .qa-features, .qa-recent { padding-left: 20px; padding-right: 20px; }
    .qa-h1 { font-size: 26px; }
  }
  @media (max-width: 480px) {
    .qa-grid { grid-template-columns: 1fr; }
    .qa-chips { gap: 7px; }
  }

  /* CHAT INTERFACE */
  .qa-chat-layout { flex: 1; display: flex; flex-direction: column; height: 100vh; overflow: hidden; position: relative; }
  .qa-chat-messages { flex: 1; overflow-y: auto; padding: 20px 40px; display: flex; flex-direction: column; gap: 24px; scroll-behavior: smooth; }
  .qa-message-row { display: flex; gap: 16px; max-width: 800px; margin: 0 auto; width: 100%; animation: fadeUp 0.3s ease both; }
  .qa-message-row.user { justify-content: flex-end; }
  .qa-avatar { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; font-family: 'Syne', sans-serif; font-weight: 700; }
  .qa-avatar.ai { background: #557a8c; color: white; }
  .qa-avatar.user { background: #333; color: white; order: 2; }
  .qa-message-bubble { background: white; padding: 16px 20px; border-radius: 16px; font-size: 15px; line-height: 1.6; color: #1a1a1a; box-shadow: 0 2px 8px rgba(0,0,0,0.04); border: 1px solid #f0f0f0; max-width: 80%; white-space: pre-wrap; }
  .qa-message-row.user .qa-message-bubble { background: #557a8c; color: white; border-color: #557a8c; border-bottom-right-radius: 4px; }
  .qa-message-row.ai .qa-message-bubble { border-bottom-left-radius: 4px; }
  .qa-chat-input-container { padding: 20px 40px; background: linear-gradient(to top, #F4F6FA 80%, rgba(244,246,250,0)); position: sticky; bottom: 0; z-index: 10; }
  .qa-typing-dot { width: 6px; height: 6px; background: #ccc; border-radius: 50%; animation: pulse 1s infinite; }
`;

const NavIcon = ({ active, title, children, onClick }) => (
  <button
    className={`qa-nav-btn${active ? " active" : ""}`}
    title={title}
    onClick={onClick}
    aria-label={title}
  >
    {children}
  </button>
);

const featureCards = [
  { icon: "🪞", title: "AR Fit-in-Room", desc: "Virtually place furniture, art & decor inside your real space using your camera. See it before you buy it.", tag: "Augmented Reality" },
  { icon: "🧊", title: "3D Model Studio", desc: "Generate photorealistic 3D product models from text or images. Rotate, inspect & embed into listings.", tag: "AI Generation" },
  { icon: "🌐", title: "Build Your Webpage", desc: "Create a stunning storefront page inside QuickArt — no code needed. AI designs layouts for your brand.", tag: "No Code Builder" },
  { icon: "🔥", title: "Manufacturer Match", desc: "Discover verified manufacturers aligned to your specs, budget & timeline using AI sourcing intelligence.", tag: "Smart Sourcing" },
  { icon: "📊", title: "Market Intelligence", desc: "Evaluate bestsellers, uncover emerging trends & assess market potential with AI-powered analysis.", tag: "Analytics" },
  { icon: "✨", title: "AI Product Design", desc: "Co-create product concepts with generative AI. Iterate on visuals, specs & variants in real time.", tag: "Design AI" },
];

const chips = [
  { label: "Verified manufacturer search", icon: "🔥" },
  { label: "Design with AI", icon: "✨" },
  { label: "Product search", icon: null },
  { label: "Analyze bestsellers", icon: null },
  { label: "AR Fit-in-Room", icon: "🪄" },
  { label: "3D Model Gen", icon: "🧊" },
  { label: "Build my webpage", icon: "🌐" },
  { label: "Discover trends", icon: null },
];

const recentSearches = [
  "AR preview for minimalist ceramic vase collection",
  "Generate 3D model — handmade wooden chair",
  "Build storefront page for QuickArt home decor shop",
];

const navItems = [
  { id: "chat", title: "AI Chat", icon: <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
  { id: "search", title: "Search", icon: <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
  { id: "history", title: "History", icon: <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/></svg> },
  { id: "3d", title: "3D Models", icon: <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg> },
  { id: "pages", title: "My Pages", icon: <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg> },
];

export default function QuickArtAI() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [activeNav, setActiveNav] = useState("chat");
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [messages, loading]);

  const handleChip = (label) => {
    setPrompt(label);
    setFocused(true);
  };

  const handleRecent = (text) => {
    setPrompt(text);
    setFocused(true);
  };

  const handleSend = async () => {
    if (!prompt.trim()) return;
    
    const userMsg = { role: "user", content: prompt };
    setMessages(prev => [...prev, userMsg]);
    setPrompt("");
    setLoading(true);

    try {
        const response = await fetch('http://localhost:8080/api/ai/chat', { //Make sure this is the correct URL
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: userMsg.content })
        });
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        
        let replyText = "I'm sorry, I couldn't process that.";
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            replyText = data.reply || data.message || JSON.stringify(data);
        } else {
            replyText = await response.text();
        }

        const aiMsg = { role: "ai", content: replyText };
        setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
        console.error("Error communicating with AI assistant:", error);
        setMessages(prev => [...prev, { role: "ai", content: `Connection error: ${error.message}. Please check if the backend is running on port 8080 and CORS is enabled.` }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="qa-root">
        {/* SIDEBAR */}
        <nav className="qa-sidebar">
          <div className="qa-logo">QA</div>
          <div className="qa-divider" />
          {navItems.map(n => (
            <NavIcon
              key={n.id}
              active={activeNav === n.id}
              title={n.title}
              onClick={() => setActiveNav(n.id)}
            >
              {n.icon}
            </NavIcon>
          ))}
        </nav>

        {/* MAIN */}
        <main className="qa-main">
          
          {messages.length === 0 ? (
            <>
            {/* HERO */}
            <section className="qa-hero">
            <div className="qa-blobs">
              <div className="qa-blob qa-blob-1" />
              <div className="qa-blob qa-blob-2" />
              <div className="qa-blob qa-blob-3" />
            </div>

            <div className="qa-hero-content">
              {/* Badge */}
              <div className="qa-badge">
                <div className="qa-badge-dot" />
                QuickArt AI — Powered by Advanced Vision + Language Models
              </div>

              {/* Original Heading for empty state */}
              <h1 className="qa-h1">
                All tasks in one ask,{" "}
                <span className="qa-h1-accent">smart sourcing with AI</span>
              </h1>
              <p className="qa-sub">Design, discover & build your store experience — in seconds.</p>

              {/* Search Box */}
              <div className={`qa-search-wrap${focused ? " focused" : ""}`}>
                <textarea
                  className="qa-textarea"
                  rows={2}
                  placeholder="Describe your needs — find products, design pages, try AR fit, create 3D models..."
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onKeyDown={handleKeyDown}
                />
                <div className="qa-search-row">
                  <div className="qa-search-left">
                    <button className="qa-icon-btn" title="Attach file" aria-label="Attach file">
                      <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                      </svg>
                    </button>
                    <button className="qa-icon-btn" title="Upload image" aria-label="Upload image">
                      <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </button>
                    <button className="qa-icon-btn" title="Voice input" aria-label="Voice input">
                      <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                        <line x1="12" y1="19" x2="12" y2="23"/>
                        <line x1="8" y1="23" x2="16" y2="23"/>
                      </svg>
                    </button>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span className="qa-hint">Enter to send</span>
                    <button
                      className="qa-send"
                      onClick={handleSend}
                      aria-label="Send"
                      style={loading ? { background: "#557a8c", opacity: 0.8, pointerEvents: "none" } : {}}
                    >
                      <svg viewBox="0 0 24 24">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Chips */}
              <div className="qa-chips">
                {chips.map((c) => (
                  <button key={c.label} className="qa-chip" onClick={() => handleChip(c.label)}>
                    {c.icon && <span>{c.icon}</span>}
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* FEATURE CARDS */}
          <section className="qa-features">
            <p className="qa-section-label">QuickArt Unique Features</p>
            <div className="qa-grid">
              {featureCards.map((card) => (
                <div key={card.title} className="qa-card" onClick={() => {
                  if (card.title === "AR Fit-in-Room") {
                    navigate("/ar-viewer");
                  }
                }}>
                  <div className="qa-card-icon">{card.icon}</div>
                  <div className="qa-card-title">{card.title}</div>
                  <div className="qa-card-desc">{card.desc}</div>
                  <span className="qa-card-tag">{card.tag}</span>
                </div>
              ))}
            </div>
          </section>

          {/* RECENT SEARCHES */}
          <div className="qa-recent">
            <div className="qa-recent-label">Recent searches</div>
            <div className="qa-recent-list">
              {recentSearches.map((item) => (
                <button key={item} className="qa-recent-item" onClick={() => handleRecent(item)}>
                  <svg viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  {item}
                </button>
              ))}
            </div>
          </div>
            </>
          ) : (
            /* CHAT INTERFACE */
            <div className="qa-chat-layout">
              <div className="qa-chat-messages">
                <div style={{ textAlign: "center", marginBottom: 20, opacity: 0.5, fontSize: 13 }}>
                  AI Assistant connected • {new Date().toLocaleDateString()}
                </div>
                {messages.map((msg, i) => (
                  <div key={i} className={`qa-message-row ${msg.role}`}>
                    <div className={`qa-avatar ${msg.role}`}>{msg.role === 'ai' ? 'AI' : 'U'}</div>
                    <div className="qa-message-bubble">{msg.content}</div>
                  </div>
                ))}
                {loading && (
                  <div className="qa-message-row ai">
                    <div className="qa-avatar ai">AI</div>
                    <div className="qa-message-bubble" style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <div className="qa-typing-dot" style={{ animationDelay: '0s' }}/>
                      <div className="qa-typing-dot" style={{ animationDelay: '0.2s' }}/>
                      <div className="qa-typing-dot" style={{ animationDelay: '0.4s' }}/>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="qa-chat-input-container">
                <div className={`qa-search-wrap${focused ? " focused" : ""}`} style={{ marginBottom: 0 }}>
                  <textarea
                    className="qa-textarea"
                    rows={1}
                    placeholder="Ask a follow up..."
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                  <div className="qa-search-row">
                    <div className="qa-search-left">
                      {/* Icons can be reused here if needed */}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <button className="qa-send" onClick={handleSend} disabled={loading} style={loading ? { background: "#ccc" } : {}}><svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
