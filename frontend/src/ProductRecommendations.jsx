import React, { useState, useEffect } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { useAuth } from "./AuthContext";


const ProductRecommendations = ({ products = [], viewHistory = [], cartItems = [], onAddToCart }) => {
  const { user } = useAuth();
  const [recommended, setRecommended]   = useState([]);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");

  const fetchRecommendations = async () => {
    if (!products.length) return;
    setLoading(true);
    setError("");

    const viewedNames = viewHistory
      .slice(-10)
      .map((id) => products.find((p) => p.id === id || p.id === String(id))?.name)
      .filter(Boolean);

    const cartNames = cartItems.map((i) => i.name).filter(Boolean);

    const catalogSummary = products
      .slice(0, 40) 
      .map((p) => `ID:${p.id} | ${p.name} | ${p.category} | LKR ${p.price}`)
      .join("\n");

    const prompt = `You are a product recommendation engine for QuickArt, a Sri Lankan e-commerce platform.

User profile:
- Recently viewed: ${viewedNames.length ? viewedNames.join(", ") : "nothing yet"}
- Cart contains: ${cartNames.length ? cartNames.join(", ") : "empty"}
- Logged in: ${user ? "yes" : "no"}

Product catalog (ID | Name | Category | Price):
${catalogSummary}

Return ONLY a JSON array of exactly 4 product IDs to recommend, based on the user's interests.
If the user has no history, recommend top-rated or diverse products.
Respond with ONLY valid JSON like: ["1","2","3","4"]
Do not include any explanation.`;

    try {
      const res  = await fetch("http://localhost:8080/api/v1/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      const text = data.response || data.text || "[]";

    
      const match = text.match(/\[[\s\S]*?\]/);
      if (!match) throw new Error("Invalid response format");

      const ids = JSON.parse(match[0]);
      const picks = ids
        .map((id) => products.find((p) => String(p.id) === String(id)))
        .filter(Boolean)
        .slice(0, 4);

      setRecommended(picks);
    } catch (err) {
    
      const shuffled = [...products].sort(() => Math.random() - 0.5);
      setRecommended(shuffled.slice(0, 4));
      setError("Using curated picks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [products.length]);

  if (!recommended.length && !loading) return null;

  return (
    <section style={styles.section}>
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <Sparkles size={18} color="#557a8c" />
          <h2 style={styles.title}>AI Picks For You</h2>
          {error && <span style={styles.errorBadge}>Curated</span>}
        </div>
        <button
          style={styles.refreshBtn}
          onClick={fetchRecommendations}
          disabled={loading}
          title="Refresh recommendations"
        >
          <RefreshCw size={14} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
          {loading ? "Thinking…" : "Refresh"}
        </button>
      </div>

      <div style={styles.grid}>
        {loading
          ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
          : recommended.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
      `}</style>
    </section>
  );
};

const ProductCard = ({ product, onAddToCart }) => {
  const [added, setAdded] = useState(false);
  const img = product.imgs?.[0] || product.imageUrls?.[0] || "";

  const handleAdd = () => {
    if (onAddToCart) onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={styles.card}>
      {product.badge && <span style={styles.badge}>{product.badge}</span>}
      <div style={styles.imgWrap}>
        {img
          ? <img src={img} alt={product.name} style={styles.img} />
          : <div style={styles.imgPlaceholder}>{product.emoji || "🛍️"}</div>
        }
      </div>
      <div style={styles.cardBody}>
        <p style={styles.cardCategory}>{product.category}</p>
        <p style={styles.cardName}>{product.name}</p>
        <div style={styles.priceRow}>
          <span style={styles.price}>LKR {product.price?.toLocaleString()}</span>
          {product.orig && (
            <span style={styles.origPrice}>LKR {product.orig?.toLocaleString()}</span>
          )}
        </div>
        <button style={{ ...styles.addBtn, background: added ? "#22c55e" : "#557a8c" }} onClick={handleAdd}>
          {added ? "Added ✓" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div style={{ ...styles.card, animation: "pulse 1.5s ease-in-out infinite" }}>
    <div style={{ ...styles.imgWrap, background: "#e2e8f0" }} />
    <div style={{ padding: "12px 16px" }}>
      <div style={{ height: 10, background: "#e2e8f0", borderRadius: 4, marginBottom: 8, width: "60%" }} />
      <div style={{ height: 14, background: "#e2e8f0", borderRadius: 4, marginBottom: 8 }} />
      <div style={{ height: 10, background: "#e2e8f0", borderRadius: 4, width: "40%" }} />
    </div>
  </div>
);

const styles = {
  section: {
    padding: "2rem 0",
    fontFamily: "'DM Sans', sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.25rem",
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: "#1a1a1a",
    margin: 0,
  },
  errorBadge: {
    fontSize: 10,
    background: "#fef3c7",
    color: "#92400e",
    padding: "2px 6px",
    borderRadius: 20,
    fontWeight: 600,
  },
  refreshBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "none",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    padding: "6px 12px",
    fontSize: 13,
    color: "#64748b",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "1rem",
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    border: "1px solid #f1f5f9",
    overflow: "hidden",
    position: "relative",
    transition: "box-shadow 0.2s",
  },
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    background: "#557a8c",
    color: "#fff",
    fontSize: 10,
    fontWeight: 700,
    padding: "2px 8px",
    borderRadius: 20,
    zIndex: 1,
  },
  imgWrap: {
    height: 160,
    background: "#f8fafc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  imgPlaceholder: {
    fontSize: 48,
  },
  cardBody: {
    padding: "12px 16px 16px",
  },
  cardCategory: {
    fontSize: 11,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    margin: "0 0 4px",
    fontWeight: 600,
  },
  cardName: {
    fontSize: 14,
    fontWeight: 600,
    color: "#1a1a1a",
    margin: "0 0 8px",
    lineHeight: 1.4,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  priceRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  price: {
    fontSize: 15,
    fontWeight: 700,
    color: "#557a8c",
  },
  origPrice: {
    fontSize: 12,
    color: "#94a3b8",
    textDecoration: "line-through",
  },
  addBtn: {
    width: "100%",
    padding: "8px 0",
    borderRadius: 8,
    border: "none",
    color: "#fff",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.2s",
    fontFamily: "inherit",
  },
};

export default ProductRecommendations;
