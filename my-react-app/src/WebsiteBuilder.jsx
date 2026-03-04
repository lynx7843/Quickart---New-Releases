import { useState, useRef, useCallback, useEffect } from "react";

// ─── Color Picker Component ───────────────────────────────────────────────────
function ColorPicker({ value, onChange, label }) {
  const [open, setOpen] = useState(false);
  const presets = [
    "#0ea5e9","#8b5cf6","#ec4899","#f97316","#22c55e",
    "#eab308","#ef4444","#14b8a6","#6366f1","#f43f5e",
    "#ffffff","#e2e8f0","#94a3b8","#475569","#1e293b","#000000",
  ];
  return (
    <div style={{ position: "relative", userSelect: "none" }}>
      {label && <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>}
      <div onClick={() => setOpen(!open)} style={{
        width: 32, height: 32, borderRadius: 8, background: value,
        border: "2px solid #334155", cursor: "pointer", boxShadow: "0 0 0 1px rgba(255,255,255,0.1)"
      }} />
      {open && (
        <div style={{
          position: "absolute", top: 40, left: 0, zIndex: 1000,
          background: "#0f172a", border: "1px solid #334155", borderRadius: 12,
          padding: 12, boxShadow: "0 20px 60px rgba(0,0,0,0.8)", width: 180
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginBottom: 10 }}>
            {presets.map(c => (
              <div key={c} onClick={() => { onChange(c); setOpen(false); }} style={{
                width: 32, height: 32, borderRadius: 6, background: c, cursor: "pointer",
                border: value === c ? "2px solid #0ea5e9" : "2px solid transparent",
                transition: "transform 0.1s", boxShadow: "0 2px 8px rgba(0,0,0,0.4)"
              }} onMouseEnter={e => e.target.style.transform = "scale(1.2)"}
                onMouseLeave={e => e.target.style.transform = "scale(1)"} />
            ))}
          </div>
          <input type="color" value={value} onChange={e => onChange(e.target.value)}
            style={{ width: "100%", height: 32, border: "none", borderRadius: 6, cursor: "pointer", background: "none" }} />
          <input value={value} onChange={e => onChange(e.target.value)}
            style={{ width: "100%", marginTop: 6, padding: "4px 8px", borderRadius: 6,
              background: "#1e293b", border: "1px solid #334155", color: "#e2e8f0", fontSize: 12 }} />
        </div>
      )}
    </div>
  );
}

// ─── Widget Templates ─────────────────────────────────────────────────────────
const WIDGET_TEMPLATES = [
  { type: "heading", label: "Heading", icon: "H1", defaultProps: { text: "Amazing Headline", fontSize: 36, color: "#ffffff", fontWeight: "800", textAlign: "center", fontFamily: "Georgia" } },
  { type: "text", label: "Paragraph", icon: "¶", defaultProps: { text: "Click to edit this paragraph. Add your content here and make it shine.", fontSize: 16, color: "#94a3b8", textAlign: "left", fontFamily: "sans-serif" } },
  { type: "button", label: "Button", icon: "▶", defaultProps: { text: "Click Me", bgColor: "#0ea5e9", color: "#ffffff", fontSize: 16, borderRadius: 8, paddingX: 24, paddingY: 12 } },
  { type: "image", label: "Image", icon: "🖼", defaultProps: { src: "https://picsum.photos/600/300?random=1", alt: "Image", width: 100, borderRadius: 8, objectFit: "cover" } },
  { type: "divider", label: "Divider", icon: "─", defaultProps: { color: "#334155", thickness: 2, margin: 16 } },
  { type: "spacer", label: "Spacer", icon: "↕", defaultProps: { height: 40 } },
  { type: "card", label: "Card", icon: "▬", defaultProps: { bgColor: "#1e293b", borderRadius: 12, padding: 24, borderColor: "#334155", text: "Card content goes here", title: "Card Title" } },
  { type: "hero", label: "Hero", icon: "★", defaultProps: { title: "Welcome to My Site", subtitle: "Build amazing things", bgColor: "#0f172a", textColor: "#ffffff", padding: 60 } },
  { type: "video", label: "Video", icon: "▶", defaultProps: { src: "https://www.w3schools.com/html/mov_bbb.mp4", width: 100, borderRadius: 8 } },
  { type: "columns", label: "2 Columns", icon: "⊞", defaultProps: { gap: 16, col1: "Column 1 content", col2: "Column 2 content", bgColor: "transparent" } },
];

// ─── Widget Renderer ──────────────────────────────────────────────────────────
function WidgetPreview({ widget }) {
  const p = widget.props;
  switch (widget.type) {
    case "heading":
      return <div style={{ fontSize: p.fontSize, color: p.color, fontWeight: p.fontWeight, textAlign: p.textAlign, fontFamily: p.fontFamily, lineHeight: 1.2 }}>{p.text}</div>;
    case "text":
      return <p style={{ fontSize: p.fontSize, color: p.color, textAlign: p.textAlign, fontFamily: p.fontFamily, margin: 0, lineHeight: 1.6 }}>{p.text}</p>;
    case "button":
      return <button style={{ background: p.bgColor, color: p.color, fontSize: p.fontSize, borderRadius: p.borderRadius, padding: `${p.paddingY}px ${p.paddingX}px`, border: "none", cursor: "pointer", fontWeight: 700 }}>{p.text}</button>;
    case "image":
      return <img src={p.src} alt={p.alt} style={{ width: `${p.width}%`, borderRadius: p.borderRadius, objectFit: p.objectFit, display: "block" }} />;
    case "divider":
      return <hr style={{ border: "none", borderTop: `${p.thickness}px solid ${p.color}`, margin: `${p.margin}px 0` }} />;
    case "spacer":
      return <div style={{ height: p.height }} />;
    case "card":
      return <div style={{ background: p.bgColor, borderRadius: p.borderRadius, padding: p.padding, border: `1px solid ${p.borderColor}` }}>
        <div style={{ fontWeight: 700, fontSize: 18, color: "#e2e8f0", marginBottom: 8 }}>{p.title}</div>
        <div style={{ color: "#94a3b8", fontSize: 14 }}>{p.text}</div>
      </div>;
    case "hero":
      return <div style={{ background: p.bgColor, padding: `${p.padding}px 24px`, textAlign: "center", borderRadius: 12 }}>
        <div style={{ fontSize: 42, fontWeight: 900, color: p.textColor, lineHeight: 1.1 }}>{p.title}</div>
        <div style={{ fontSize: 20, color: "#94a3b8", marginTop: 12 }}>{p.subtitle}</div>
      </div>;
    case "video":
      return <video src={p.src} controls style={{ width: `${p.width}%`, borderRadius: p.borderRadius, display: "block" }} />;
    case "columns":
      return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: p.gap, background: p.bgColor }}>
        <div style={{ padding: 16, background: "#1e293b", borderRadius: 8, color: "#94a3b8", fontSize: 14 }}>{p.col1}</div>
        <div style={{ padding: 16, background: "#1e293b", borderRadius: 8, color: "#94a3b8", fontSize: 14 }}>{p.col2}</div>
      </div>;
    default:
      return <div style={{ color: "#94a3b8" }}>Unknown widget</div>;
  }
}

// ─── Property Editor ──────────────────────────────────────────────────────────
function PropEditor({ widget, onUpdate }) {
  if (!widget) return (
    <div style={{ padding: 24, textAlign: "center", color: "#475569" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
      <div style={{ fontSize: 14 }}>Select a widget to edit its properties</div>
    </div>
  );
  const p = widget.props;
  const update = (key, val) => onUpdate({ ...widget, props: { ...p, [key]: val } });

  const Field = ({ label, children }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
  const Input = ({ k, type = "text", min, max }) => (
    <input type={type} value={p[k]} min={min} max={max}
      onChange={e => update(k, type === "number" ? Number(e.target.value) : e.target.value)}
      style={{ width: "100%", padding: "6px 10px", background: "#0f172a", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0", fontSize: 13, boxSizing: "border-box" }} />
  );
  const Slider = ({ k, min, max }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <input type="range" min={min} max={max} value={p[k]} onChange={e => update(k, Number(e.target.value))}
        style={{ flex: 1 }} />
      <span style={{ color: "#e2e8f0", fontSize: 12, minWidth: 30 }}>{p[k]}</span>
    </div>
  );
  const Select = ({ k, options }) => (
    <select value={p[k]} onChange={e => update(k, e.target.value)}
      style={{ width: "100%", padding: "6px 10px", background: "#0f172a", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0", fontSize: 13 }}>
      {options.map(o => <option key={o.v || o} value={o.v || o}>{o.l || o}</option>)}
    </select>
  );

  return (
    <div style={{ padding: "16px 12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, padding: "8px 10px", background: "#1e293b", borderRadius: 10 }}>
        <span style={{ fontSize: 20 }}>{WIDGET_TEMPLATES.find(w => w.type === widget.type)?.icon}</span>
        <span style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 14 }}>{widget.type.charAt(0).toUpperCase() + widget.type.slice(1)}</span>
      </div>

      {(widget.type === "heading" || widget.type === "text") && <>
        <Field label="Text"><Input k="text" /></Field>
        <Field label="Font Size"><Slider k="fontSize" min={8} max={96} /></Field>
        <Field label="Text Color"><ColorPicker value={p.color} onChange={v => update("color", v)} /></Field>
        <Field label="Align"><Select k="textAlign" options={["left","center","right","justify"]} /></Field>
        {widget.type === "heading" && <Field label="Font Weight"><Select k="fontWeight" options={["400","600","700","800","900"]} /></Field>}
        <Field label="Font"><Select k="fontFamily" options={["Georgia","serif","sans-serif","monospace","cursive"]} /></Field>
      </>}

      {widget.type === "button" && <>
        <Field label="Text"><Input k="text" /></Field>
        <Field label="Background"><ColorPicker value={p.bgColor} onChange={v => update("bgColor", v)} /></Field>
        <Field label="Text Color"><ColorPicker value={p.color} onChange={v => update("color", v)} /></Field>
        <Field label="Font Size"><Slider k="fontSize" min={10} max={32} /></Field>
        <Field label="Border Radius"><Slider k="borderRadius" min={0} max={40} /></Field>
        <Field label="Padding X"><Slider k="paddingX" min={4} max={60} /></Field>
        <Field label="Padding Y"><Slider k="paddingY" min={4} max={40} /></Field>
      </>}

      {widget.type === "image" && <>
        <Field label="URL"><Input k="src" /></Field>
        <Field label="Width %"><Slider k="width" min={10} max={100} /></Field>
        <Field label="Border Radius"><Slider k="borderRadius" min={0} max={40} /></Field>
        <Field label="Object Fit"><Select k="objectFit" options={["cover","contain","fill","none"]} /></Field>
      </>}

      {widget.type === "divider" && <>
        <Field label="Color"><ColorPicker value={p.color} onChange={v => update("color", v)} /></Field>
        <Field label="Thickness"><Slider k="thickness" min={1} max={10} /></Field>
        <Field label="Margin"><Slider k="margin" min={0} max={60} /></Field>
      </>}

      {widget.type === "spacer" && <Field label="Height"><Slider k="height" min={8} max={200} /></Field>}

      {widget.type === "card" && <>
        <Field label="Title"><Input k="title" /></Field>
        <Field label="Text"><Input k="text" /></Field>
        <Field label="Background"><ColorPicker value={p.bgColor} onChange={v => update("bgColor", v)} /></Field>
        <Field label="Border Color"><ColorPicker value={p.borderColor} onChange={v => update("borderColor", v)} /></Field>
        <Field label="Border Radius"><Slider k="borderRadius" min={0} max={30} /></Field>
        <Field label="Padding"><Slider k="padding" min={8} max={60} /></Field>
      </>}

      {widget.type === "hero" && <>
        <Field label="Title"><Input k="title" /></Field>
        <Field label="Subtitle"><Input k="subtitle" /></Field>
        <Field label="Background"><ColorPicker value={p.bgColor} onChange={v => update("bgColor", v)} /></Field>
        <Field label="Text Color"><ColorPicker value={p.textColor} onChange={v => update("textColor", v)} /></Field>
        <Field label="Padding"><Slider k="padding" min={20} max={120} /></Field>
      </>}

      {widget.type === "columns" && <>
        <Field label="Column 1"><Input k="col1" /></Field>
        <Field label="Column 2"><Input k="col2" /></Field>
        <Field label="Gap"><Slider k="gap" min={0} max={40} /></Field>
      </>}

      {widget.type === "video" && <>
        <Field label="Video URL"><Input k="src" /></Field>
        <Field label="Width %"><Slider k="width" min={10} max={100} /></Field>
        <Field label="Border Radius"><Slider k="borderRadius" min={0} max={30} /></Field>
      </>}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
let idCounter = 100;
const uid = () => `w${++idCounter}`;

const PAGES = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export default function WebsiteBuilder() {
  const [pages, setPages] = useState({
    home: [
      { id: uid(), type: "hero", props: { ...WIDGET_TEMPLATES.find(w=>w.type==="hero").defaultProps } },
      { id: uid(), type: "text", props: { ...WIDGET_TEMPLATES.find(w=>w.type==="text").defaultProps } },
    ],
    about: [],
    contact: [],
  });
  const [activePage, setActivePage] = useState("home");
  const [selected, setSelected] = useState(null);
  const [draggingTemplate, setDraggingTemplate] = useState(null);
  const [draggingWidget, setDraggingWidget] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [preview, setPreview] = useState(false);
  const [sideTab, setSideTab] = useState("widgets"); // widgets | pages
  const [canvasStyle, setCanvasStyle] = useState({ bgColor: "#0f172a", maxWidth: 900 });
  const [history, setHistory] = useState([]);
  const [showColorPanel, setShowColorPanel] = useState(false);

  const widgets = pages[activePage] || [];
  const setWidgets = useCallback((fn) => {
    setPages(prev => {
      const next = typeof fn === "function" ? fn(prev[activePage]) : fn;
      return { ...prev, [activePage]: next };
    });
  }, [activePage]);

  const pushHistory = useCallback(() => {
    setHistory(h => [...h.slice(-20), JSON.stringify(pages)]);
  }, [pages]);

  const undo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setPages(JSON.parse(last));
    setHistory(h => h.slice(0, -1));
    setSelected(null);
  };

  // Canvas drag-over for new widgets from toolbox
  const handleCanvasDragOver = (e, idx) => {
    e.preventDefault();
    setDragOver(idx);
  };

  const handleCanvasDrop = (e, idx) => {
    e.preventDefault();
    if (draggingTemplate) {
      pushHistory();
      const tpl = WIDGET_TEMPLATES.find(w => w.type === draggingTemplate);
      const newW = { id: uid(), type: tpl.type, props: { ...tpl.defaultProps } };
      setWidgets(ws => {
        const copy = [...ws];
        copy.splice(idx, 0, newW);
        return copy;
      });
      setSelected(newW.id);
    } else if (draggingWidget) {
      pushHistory();
      setWidgets(ws => {
        const copy = ws.filter(w => w.id !== draggingWidget);
        const item = ws.find(w => w.id === draggingWidget);
        const insertAt = Math.min(idx, copy.length);
        copy.splice(insertAt, 0, item);
        return copy;
      });
    }
    setDraggingTemplate(null);
    setDraggingWidget(null);
    setDragOver(null);
  };

  const deleteWidget = (id) => {
    pushHistory();
    setWidgets(ws => ws.filter(w => w.id !== id));
    setSelected(null);
  };

  const duplicateWidget = (id) => {
    pushHistory();
    setWidgets(ws => {
      const idx = ws.findIndex(w => w.id === id);
      const copy = { ...ws[idx], id: uid(), props: { ...ws[idx].props } };
      const next = [...ws];
      next.splice(idx + 1, 0, copy);
      return next;
    });
  };

  const updateWidget = (updated) => {
    setWidgets(ws => ws.map(w => w.id === updated.id ? updated : w));
  };

  const selectedWidget = widgets.find(w => w.id === selected);

  const addPage = () => {
    const name = prompt("Page name:");
    if (!name) return;
    const id = name.toLowerCase().replace(/\s+/g, "-");
    setPages(p => ({ ...p, [id]: [] }));
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#020617", fontFamily: "'DM Sans', system-ui, sans-serif", overflow: "hidden", color: "#e2e8f0" }}>
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0f172a; } ::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
        input[type=range] { -webkit-appearance: none; height: 4px; background: #334155; border-radius: 2px; outline: none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; background: #0ea5e9; border-radius: 50%; cursor: pointer; }
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700;800&display=swap');
        .widget-hover:hover .widget-controls { opacity: 1 !important; }
        .tool-item:hover { background: #1e293b !important; transform: translateY(-2px); }
        .page-tab:hover { background: #1e293b !important; }
        .btn:hover { filter: brightness(1.15); }
      `}</style>

      {/* ─── LEFT SIDEBAR ─── */}
      {!preview && (
        <div style={{ width: 220, background: "#0a0f1e", borderRight: "1px solid #1e293b", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          {/* Logo */}
          <div style={{ padding: "16px 14px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#0ea5e9,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900 }}>W</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 13, color: "#f1f5f9" }}>WebCraft</div>
              <div style={{ fontSize: 10, color: "#475569" }}>Builder Pro</div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #1e293b" }}>
            {["widgets","pages"].map(tab => (
              <div key={tab} onClick={() => setSideTab(tab)} style={{
                flex: 1, textAlign: "center", padding: "10px 0", fontSize: 11,
                fontWeight: sideTab === tab ? 700 : 400,
                color: sideTab === tab ? "#0ea5e9" : "#64748b",
                borderBottom: sideTab === tab ? "2px solid #0ea5e9" : "2px solid transparent",
                cursor: "pointer", transition: "all 0.2s", textTransform: "uppercase", letterSpacing: 0.5
              }}>{tab}</div>
            ))}
          </div>

          {/* Widgets Toolbox */}
          {sideTab === "widgets" && (
            <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
              <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, paddingLeft: 4 }}>Drag to Canvas</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {WIDGET_TEMPLATES.map(tpl => (
                  <div key={tpl.type} className="tool-item"
                    draggable onDragStart={() => setDraggingTemplate(tpl.type)} onDragEnd={() => setDraggingTemplate(null)}
                    style={{
                      padding: "10px 8px", background: "#0f172a", borderRadius: 10,
                      border: "1px solid #1e293b", cursor: "grab", textAlign: "center",
                      transition: "all 0.2s"
                    }}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{tpl.icon}</div>
                    <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>{tpl.label}</div>
                  </div>
                ))}
              </div>

              {/* Canvas BG */}
              <div style={{ marginTop: 16, borderTop: "1px solid #1e293b", paddingTop: 12 }}>
                <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Canvas</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <ColorPicker value={canvasStyle.bgColor} onChange={v => setCanvasStyle(s => ({ ...s, bgColor: v }))} label="BG Color" />
                </div>
                <div style={{ fontSize: 10, color: "#64748b", marginBottom: 4 }}>Max Width: {canvasStyle.maxWidth}px</div>
                <input type="range" min={400} max={1400} value={canvasStyle.maxWidth}
                  onChange={e => setCanvasStyle(s => ({ ...s, maxWidth: Number(e.target.value) }))} style={{ width: "100%" }} />
              </div>
            </div>
          )}

          {/* Pages */}
          {sideTab === "pages" && (
            <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
              <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, paddingLeft: 4 }}>Pages</div>
              {Object.keys(pages).map(pid => (
                <div key={pid} className="page-tab" onClick={() => { setActivePage(pid); setSelected(null); }}
                  style={{
                    padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                    background: activePage === pid ? "#1e40af" : "transparent",
                    border: `1px solid ${activePage === pid ? "#3b82f6" : "transparent"}`,
                    marginBottom: 4, transition: "all 0.2s",
                    display: "flex", alignItems: "center", gap: 8
                  }}>
                  <span style={{ fontSize: 14 }}>📄</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{pid.charAt(0).toUpperCase() + pid.slice(1)}</div>
                    <div style={{ fontSize: 10, color: "#64748b" }}>{pages[pid].length} widgets</div>
                  </div>
                </div>
              ))}
              <div onClick={addPage} style={{
                marginTop: 6, padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                border: "1px dashed #334155", textAlign: "center", color: "#475569", fontSize: 12,
                transition: "all 0.2s"
              }} className="page-tab">+ Add Page</div>
            </div>
          )}
        </div>
      )}

      {/* ─── CENTER CANVAS ─── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Toolbar */}
        <div style={{
          height: 52, background: "#0a0f1e", borderBottom: "1px solid #1e293b",
          display: "flex", alignItems: "center", gap: 8, padding: "0 16px"
        }}>
          {/* Page Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginRight: "auto" }}>
            <span style={{ color: "#64748b", fontSize: 12 }}>📄</span>
            <span style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 13 }}>{activePage.charAt(0).toUpperCase() + activePage.slice(1)}</span>
            <span style={{ color: "#475569", fontSize: 12 }}>• {widgets.length} widgets</span>
          </div>

          {/* Action Buttons */}
          {[
            { icon: "↩", label: "Undo", action: undo, color: "#64748b" },
            { icon: "🗑", label: "Clear", action: () => { pushHistory(); setWidgets([]); setSelected(null); }, color: "#64748b" },
          ].map(b => (
            <button key={b.label} onClick={b.action} className="btn" style={{
              background: "#0f172a", border: "1px solid #1e293b", color: b.color,
              padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 4
            }}>{b.icon} {b.label}</button>
          ))}

          <div style={{ width: 1, height: 24, background: "#1e293b" }} />

          <button onClick={() => setPreview(!preview)} className="btn" style={{
            background: preview ? "#0ea5e9" : "#0f172a",
            border: `1px solid ${preview ? "#0ea5e9" : "#1e293b"}`,
            color: preview ? "#fff" : "#94a3b8",
            padding: "6px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13
          }}>{preview ? "✏ Edit" : "👁 Preview"}</button>

          <button className="btn" style={{
            background: "linear-gradient(135deg,#0ea5e9,#6366f1)",
            border: "none", color: "#fff", padding: "6px 18px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13
          }}>🚀 Publish</button>
        </div>

        {/* Canvas Area */}
        <div style={{ flex: 1, overflow: "auto", background: preview ? canvasStyle.bgColor : "#080d1a", padding: preview ? 0 : 24 }}>
          {!preview && (
            // Drop zone at top
            <div
              onDragOver={e => handleCanvasDragOver(e, 0)}
              onDrop={e => handleCanvasDrop(e, 0)}
              style={{ height: dragOver === 0 ? 48 : 8, background: dragOver === 0 ? "rgba(14,165,233,0.15)" : "transparent",
                border: dragOver === 0 ? "2px dashed #0ea5e9" : "2px dashed transparent",
                borderRadius: 8, transition: "all 0.2s", marginBottom: 4 }}
            />
          )}

          <div style={{
            maxWidth: canvasStyle.maxWidth, margin: "0 auto",
            background: canvasStyle.bgColor, borderRadius: preview ? 0 : 16,
            minHeight: 400, position: "relative",
            boxShadow: preview ? "none" : "0 0 0 1px #1e293b, 0 24px 80px rgba(0,0,0,0.6)"
          }}>
            {widgets.length === 0 && !preview && (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                minHeight: 300, color: "#334155"
              }}
                onDragOver={e => handleCanvasDragOver(e, 0)}
                onDrop={e => handleCanvasDrop(e, 0)}>
                <div style={{ fontSize: 64 }}>🏗</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginTop: 12, color: "#475569" }}>Drop widgets here</div>
                <div style={{ fontSize: 13, color: "#334155", marginTop: 4 }}>Drag from the left panel to start building</div>
              </div>
            )}

            {widgets.map((w, idx) => (
              <div key={w.id}>
                <div
                  className="widget-hover"
                  draggable={!preview}
                  onDragStart={() => { setDraggingWidget(w.id); setDraggingTemplate(null); }}
                  onDragEnd={() => { setDraggingWidget(null); setDragOver(null); }}
                  onClick={() => !preview && setSelected(w.id === selected ? null : w.id)}
                  style={{
                    position: "relative", padding: 12, cursor: preview ? "default" : "pointer",
                    outline: !preview && selected === w.id ? "2px solid #0ea5e9" : "2px solid transparent",
                    outlineOffset: 2, borderRadius: 8, transition: "outline 0.15s",
                    opacity: draggingWidget === w.id ? 0.4 : 1
                  }}>
                  <WidgetPreview widget={w} />
                  {/* Widget Controls */}
                  {!preview && (
                    <div className="widget-controls" style={{
                      position: "absolute", top: -14, right: 6, opacity: 0, transition: "opacity 0.2s",
                      display: "flex", gap: 4
                    }}>
                      {[
                        { icon: "⎘", title: "Duplicate", action: () => duplicateWidget(w.id), color: "#0ea5e9" },
                        { icon: "✕", title: "Delete", action: () => deleteWidget(w.id), color: "#ef4444" },
                      ].map(btn => (
                        <button key={btn.title} title={btn.title} onClick={e => { e.stopPropagation(); btn.action(); }}
                          style={{ width: 24, height: 24, borderRadius: 6, background: "#0f172a", border: `1px solid ${btn.color}`,
                            color: btn.color, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {btn.icon}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Drop zone between widgets */}
                {!preview && (
                  <div
                    onDragOver={e => handleCanvasDragOver(e, idx + 1)}
                    onDrop={e => handleCanvasDrop(e, idx + 1)}
                    style={{
                      height: dragOver === idx + 1 ? 48 : 4,
                      background: dragOver === idx + 1 ? "rgba(14,165,233,0.15)" : "transparent",
                      border: dragOver === idx + 1 ? "2px dashed #0ea5e9" : "2px dashed transparent",
                      borderRadius: 8, transition: "all 0.2s", margin: "2px 0"
                    }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── RIGHT SIDEBAR: Properties ─── */}
      {!preview && (
        <div style={{ width: 240, background: "#0a0f1e", borderLeft: "1px solid #1e293b", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "14px 12px", borderBottom: "1px solid #1e293b", fontWeight: 800, fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 }}>
            Properties
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            <PropEditor widget={selectedWidget} onUpdate={w => { pushHistory(); updateWidget(w); }} />
          </div>

          {/* Widget Order */}
          {widgets.length > 0 && (
            <div style={{ borderTop: "1px solid #1e293b", padding: 10 }}>
              <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Layers</div>
              <div style={{ maxHeight: 140, overflowY: "auto" }}>
                {widgets.map((w, idx) => (
                  <div key={w.id} onClick={() => setSelected(w.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 6, padding: "5px 8px",
                      borderRadius: 8, cursor: "pointer", marginBottom: 2,
                      background: selected === w.id ? "#1e293b" : "transparent",
                      border: `1px solid ${selected === w.id ? "#334155" : "transparent"}`
                    }}>
                    <span style={{ fontSize: 12 }}>{WIDGET_TEMPLATES.find(t => t.type === w.type)?.icon}</span>
                    <span style={{ fontSize: 11, color: "#94a3b8", flex: 1 }}>{w.type}</span>
                    <span style={{ fontSize: 10, color: "#475569" }}>{idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}