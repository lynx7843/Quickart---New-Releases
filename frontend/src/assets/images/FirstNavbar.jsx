import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useCart } from "../pages/CartContext";
import { useState, useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --bg-dark: #0a0a0f;
    --surface: #12121a;
    --surface-2: #1a1a26;
    --border: rgba(255,255,255,0.07);
    --accent: #ff5c1a;
    --accent-glow: rgba(255,92,26,0.25);
    --accent-2: #ffb347;
    --text-primary: #f0eee8;
    --text-muted: #888899;
    --white: #ffffff;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .qnav {
    font-family: 'DM Sans', sans-serif;
    position: sticky;
    top: 0;
    z-index: 1000;
    background: rgba(10, 10, 15, 0.92);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border-bottom: 1px solid var(--border);
    padding: 0 32px;
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }

  /* Subtle top accent line */
  .qnav::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, var(--accent) 40%, var(--accent-2) 60%, transparent 100%);
  }

  /* ── LOGO ── */
  .qnav-logo {
    display: flex;
    flex-direction: column;
    cursor: pointer;
    user-select: none;
    flex-shrink: 0;
    gap: 1px;
  }

  .qnav-logo-row {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .qnav-bolt {
    font-size: 18px;
    filter: drop-shadow(0 0 6px var(--accent));
    animation: boltPulse 2.4s ease-in-out infinite;
  }

  @keyframes boltPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.7; transform: scale(0.9); }
  }

  .qnav-wordmark {
    display: flex;
    align-items: center;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 20px;
    letter-spacing: 0.08em;
    line-height: 1;
  }

  .qnav-quick { color: var(--text-primary); }

  .qnav-cart-icon-logo {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    font-size: 13px;
    background: var(--accent);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    top: -1px;
    box-shadow: 0 2px 10px var(--accent-glow);
  }

  .qnav-cart-icon-logo:hover {
    transform: scale(1.12);
    box-shadow: 0 4px 18px var(--accent-glow);
  }

  .qnav-art {
    color: var(--accent);
    text-shadow: 0 0 20px var(--accent-glow);
  }

  .qnav-tagline {
    font-size: 8px;
    letter-spacing: 0.22em;
    color: var(--text-muted);
    font-weight: 500;
    text-transform: uppercase;
    padding-left: 28px;
    margin-top: 1px;
  }

  /* ── RIGHT CLUSTER ── */
  .qnav-right {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  /* ── COUNTRY PILL ── */
  .qnav-country {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    border: 1px solid var(--border);
    border-radius: 30px;
    background: var(--surface);
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
  }

  .qnav-country:hover {
    border-color: rgba(255,255,255,0.18);
    background: var(--surface-2);
  }

  .qnav-country-label {
    font-size: 11px;
    color: var(--text-muted);
    font-weight: 500;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }

  .qnav-select {
    background: transparent;
    border: none;
    outline: none;
    color: var(--text-primary);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    max-width: 80px;
  }

  .qnav-select option {
    background: #1a1a26;
    color: var(--text-primary);
  }

  /* ── CURRENCY PILL ── */
  .qnav-currency {
    padding: 6px 12px;
    border: 1px solid var(--border);
    border-radius: 30px;
    background: var(--surface);
    font-size: 12px;
    font-weight: 500;
    color: var(--text-muted);
    letter-spacing: 0.04em;
    white-space: nowrap;
  }

  /* ── DIVIDER ── */
  .qnav-divider {
    width: 1px;
    height: 28px;
    background: var(--border);
    margin: 0 4px;
  }

  /* ── CART BUTTON ── */
  .qnav-cart-btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    border: 1px solid var(--border);
    background: var(--surface);
    cursor: pointer;
    font-size: 17px;
    transition: all 0.2s ease;
    color: var(--text-primary);
  }

  .qnav-cart-btn:hover {
    border-color: var(--accent);
    background: var(--surface-2);
    box-shadow: 0 0 16px var(--accent-glow);
    transform: translateY(-1px);
  }

  .qnav-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    min-width: 17px;
    height: 17px;
    padding: 0 4px;
    background: var(--accent);
    color: white;
    border-radius: 20px;
    font-size: 9px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--bg-dark);
    animation: badgePop 0.3s cubic-bezier(.175,.885,.32,1.275);
    font-family: 'Syne', sans-serif;
  }

  @keyframes badgePop {
    from { transform: scale(0); }
    to   { transform: scale(1); }
  }

  /* ── SIGN IN BUTTON ── */
  .qnav-signin {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    cursor: pointer;
    padding: 6px 12px;
    border-radius: 10px;
    transition: background 0.2s;
    border: 1px solid transparent;
  }

  .qnav-signin:hover {
    background: var(--surface);
    border-color: var(--border);
  }

  .qnav-signin-greeting {
    font-size: 10px;
    color: var(--text-muted);
    font-weight: 400;
    letter-spacing: 0.04em;
    white-space: nowrap;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .qnav-signin-action {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
  }

  .qnav-signin-action svg {
    opacity: 0.5;
    transition: opacity 0.2s, transform 0.2s;
  }

  .qnav-signin:hover .qnav-signin-action svg {
    opacity: 1;
    transform: translateX(2px);
  }

  /* ── CREATE ACCOUNT BUTTON ── */
  .qnav-register {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 10px 20px;
    background: var(--accent);
    color: white;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.05em;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.22s ease;
    white-space: nowrap;
    box-shadow: 0 4px 16px var(--accent-glow);
    position: relative;
    overflow: hidden;
  }

  .qnav-register::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
    border-radius: inherit;
  }

  .qnav-register:hover {
    background: #ff6e34;
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(255,92,26,0.45);
  }

  .qnav-register:active {
    transform: translateY(0);
  }

  .qnav-register svg {
    transition: transform 0.2s;
  }

  .qnav-register:hover svg {
    transform: translateX(2px);
  }

  /* ── MOBILE ── */
  @media (max-width: 768px) {
    .qnav { padding: 0 16px; height: 60px; }
    .qnav-country, .qnav-currency, .qnav-divider { display: none; }
    .qnav-tagline { display: none; }
    .qnav-register { padding: 9px 14px; font-size: 12px; }
  }
`;

export default function Navbar() {
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{styles}</style>
      <nav
        className="qnav"
        style={scrolled ? { boxShadow: "0 8px 40px rgba(0,0,0,0.5)" } : {}}
      >
        {/* ── LOGO ── */}
        <div className="qnav-logo" onClick={() => navigate("/quickart")}>
          <div className="qnav-logo-row">
            <span className="qnav-bolt">⚡</span>
            <span className="qnav-wordmark">
              <span className="qnav-quick">QUICK</span>
              <span
                className="qnav-cart-icon-logo"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/cart");
                }}
              >
                🛒
              </span>
              <span className="qnav-art">ART</span>
            </span>
          </div>
          <p className="qnav-tagline">SMART · FAST · RELIABLE</p>
        </div>

        {/* ── RIGHT ── */}
        <div className="qnav-right">

          {/* Country selector */}
          <div className="qnav-country">
            <span className="qnav-country-label">🌍</span>
            <select className="qnav-select" defaultValue="lk">
              <option value="lk">🇱🇰 LK</option>
              <option value="us">🇺🇸 US</option>
              <option value="uk">🇬🇧 UK</option>
              <option value="ca">🇨🇦 CA</option>
              <option value="au">🇦🇺 AU</option>
              <option value="de">🇩🇪 DE</option>
              <option value="fr">🇫🇷 FR</option>
              <option value="jp">🇯🇵 JP</option>
              <option value="cn">🇨🇳 CN</option>
              <option value="in">🇮🇳 IN</option>
              <option value="sg">🇸🇬 SG</option>
              <option value="ae">🇦🇪 AE</option>
              <option value="sa">🇸🇦 SA</option>
              <option value="br">🇧🇷 BR</option>
              <option value="mx">🇲🇽 MX</option>
              <option value="za">🇿🇦 ZA</option>
              <option value="ng">🇳🇬 NG</option>
              <option value="ke">🇰🇪 KE</option>
            </select>
          </div>

          {/* Currency */}
          <div className="qnav-currency">EN · LKR</div>

          <div className="qnav-divider" />

          {/* Cart */}
          <div
            className="qnav-cart-btn"
            onClick={() => navigate("/cart")}
            title="View Cart"
          >
            🛒
            {cartCount > 0 && (
              <span key={cartCount} className="qnav-badge">
                {cartCount}
              </span>
            )}
          </div>

          <div className="qnav-divider" />

          {/* Sign in / Welcome */}
          {user ? (
            <div className="qnav-signin" onClick={logout}>
              <span className="qnav-signin-greeting">Welcome back,</span>
              <span className="qnav-signin-action">
                {user.name.split(" ")[0]}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
          ) : (
            <div className="qnav-signin" onClick={() => navigate("/login")}>
              <span className="qnav-signin-greeting">Have an account?</span>
              <span className="qnav-signin-action">
                Sign in
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
          )}

          {/* Create account */}
          <button
            className="qnav-register"
            onClick={() => navigate("/register")}
          >
            Create Account
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2.5 6.5h8M6.5 2.5l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </nav>
    </>
  );
}
