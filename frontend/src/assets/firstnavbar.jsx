import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FirstNavbar.css";
import { useAuth } from "../AuthContext";
import { useCart } from "../pages/CartContext";
import { Globe, ChevronDown, ShoppingCart, User, Mic } from "lucide-react";
import VoiceAssistant from "../VoiceAssistant";

function Navbar() {
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [language, setLanguage] = useState("English");
  const [showVoice, setShowVoice] = useState(false);

  const handleVoiceSearch = (query) => {
    navigate(`/?search=${encodeURIComponent(query)}`);
    setShowVoice(false);
  };

  return (
    <nav className="first-navbar">
      <div className="navbar-left" onClick={() => navigate('/quickart')}>
        <div className="logo-container">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">
            <span className="logo-quick">QUICK</span>
            <span
              className="logo-cart"
              onClick={(e) => { e.stopPropagation(); navigate('/cart'); }}
            >
              🛒
            </span>
            <span className="logo-art">ART</span>
          </span>
        </div>
        <div className="logo-underline"></div>
        <p className="logo-tagline">SMART. FAST. RELIABLE</p>
      </div>

      <div className="navbar-right" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>

        {/* Language / Country selector */}
        <div className="nav-item" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px', background: '#f3f4f6', padding: '8px 16px', borderRadius: '30px' }}>
          <Globe size={16} color="#555" />
          <select className="nav-line-2" style={{ background: 'transparent', border: 'none', outline: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#333' }}>
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
            <option value="my">🇲🇾 MY</option>
            <option value="th">🇹🇭 TH</option>
            <option value="id">🇮🇩 ID</option>
            <option value="ph">🇵🇭 PH</option>
            <option value="vn">🇻🇳 VN</option>
            <option value="bd">🇧🇩 BD</option>
            <option value="pk">🇵🇰 PK</option>
            <option value="np">🇳🇵 NP</option>
            <option value="br">🇧🇷 BR</option>
            <option value="mx">🇲🇽 MX</option>
            <option value="za">🇿🇦 ZA</option>
            <option value="ng">🇳🇬 NG</option>
            <option value="ke">🇰🇪 KE</option>
            <option value="eg">🇪🇬 EG</option>
            <option value="ru">🇷🇺 RU</option>
            <option value="kr">🇰🇷 KR</option>
            <option value="it">🇮🇹 IT</option>
            <option value="es">🇪🇸 ES</option>
            <option value="nl">🇳🇱 NL</option>
            <option value="se">🇸🇪 SE</option>
            <option value="no">🇳🇴 NO</option>
            <option value="ch">🇨🇭 CH</option>
            <option value="nz">🇳🇿 NZ</option>
          </select>

          <div style={{ width: '1px', height: '16px', background: '#ddd', margin: '0 5px' }}></div>

          <select
            className="nav-line-2"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#333' }}
          >
            <option value="English">English</option>
            <option value="Sinhala">Sinhala</option>
            <option value="Tamil">Tamil</option>
          </select>
          <ChevronDown size={14} color="#777" />
        </div>

        {/* ── CHANGE 1: Voice Assistant mic button ── */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowVoice(v => !v)}
            style={{
              background: showVoice ? '#557a8c' : '#f3f4f6',
              border: 'none',
              borderRadius: '50%',
              width: 38,
              height: 38,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            title="Voice Assistant"
          >
            <Mic size={18} color={showVoice ? '#fff' : '#555'} />
          </button>

          {/* ── CHANGE 2: Voice panel dropdown ── */}
          {showVoice && (
            <div style={{ position: 'absolute', top: 48, right: 0, zIndex: 1000 }}>
              <VoiceAssistant
                onSearch={handleVoiceSearch}
                onClose={() => setShowVoice(false)}
              />
            </div>
          )}
        </div>

        {/* Cart */}
        <div
          className="nav-item"
          onClick={() => navigate('/cart')}
          style={{ cursor: 'pointer', position: 'relative', flexDirection: 'row', alignItems: 'center' }}
        >
          <ShoppingCart size={24} color="#333" strokeWidth={2} />
          {cartCount > 0 && (
            <span style={{
              position: 'absolute', top: -5, right: -10,
              background: '#557a8c', color: 'white',
              borderRadius: '50%', minWidth: '18px', height: '18px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '10px', fontWeight: 'bold', border: '2px solid white'
            }}>
              {cartCount}
            </span>
          )}
        </div>

        {/* User / logout */}
        {user ? (
          <div
            className="nav-item"
            onClick={logout}
            style={{ cursor: 'pointer', flexDirection: 'row', alignItems: 'center', gap: '8px' }}
          >
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: '#1a1a1a', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 'bold'
            }}>
              {user.name.charAt(0)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#333' }}>
                {user.name.split(' ')[0]}
              </span>
              <span style={{ fontSize: '10px', color: '#888' }}>Sign Out</span>
            </div>
          </div>
        ) : (
          <div
            className="nav-item"
            onClick={() => navigate('/login')}
            style={{ cursor: 'pointer', flexDirection: 'row', alignItems: 'center', gap: '6px' }}
          >
            <User size={20} color="#333" />
            <span className="nav-line-2" style={{ fontSize: '14px' }}>Sign in</span>
          </div>
        )}

        <button
          className="create-account-btn"
          onClick={() => navigate('/register')}
          style={{ boxShadow: '0 4px 14px rgba(0,0,0,0.1)', background: "#557a8c", color: "#fff", border: "none" }}
        >
          Create account
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
