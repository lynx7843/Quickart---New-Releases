import { useState } from "react";
import "./FirstNavbar.css";

function Navbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleGifClick = () => {
    setShowMobileMenu(!showMobileMenu);
  };
  return (
    <nav className="first-navbar">
      <div className="navbar-left">
        <div className="logo-container">
          <span className="logo-icon">⚡</span>

          <span className="logo-text">
            <span className="logo-quick">QUICK</span>
            <span className="logo-cart">🛒</span>
            <span className="logo-art">ART</span>
          </span>
        </div>

        <div className="logo-underline"></div>
        <p className="logo-tagline">SMART. FAST. RELIABLE</p>
      </div>

      <div className="navbar-center">
        <div onClick={handleGifClick} style={{ cursor: "pointer", fontSize: "24px", fontWeight: "bold" }}>
          ⚡ QuickCart
        </div>
        {showMobileMenu && (
          <div className="mobile-menu-popup">
            <div className="mobile-menu-item">🏠 Home</div>
            <div className="mobile-menu-item">🔍 Search</div>
            <div className="mobile-menu-item">❤️ Favorites</div>
            <div className="mobile-menu-item">📦 Orders</div>
            <div className="mobile-menu-item">👤 Account</div>
            <div className="mobile-menu-item">⚙️ Settings</div>
          </div>
        )}
      </div>

      <div className="navbar-right">
        <div className="nav-item">
          <span className="nav-line-1">🌍 Select Country</span>
          <select className="nav-line-2">
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
            <option value="br">🇧🇷 BR</option>
            <option value="mx">🇲🇽 MX</option>
            <option value="za">🇿🇦 ZA</option>
            <option value="ru">🇷🇺 RU</option>
            <option value="kr">🇰🇷 KR</option>
            <option value="it">🇮🇹 IT</option>
            <option value="es">🇪🇸 ES</option>
            <option value="nl">🇳🇱 NL</option>
            <option value="se">🇸🇪 SE</option>
            <option value="no">🇳🇴 NO</option>
            <option value="dk">🇩🇰 DK</option>
            <option value="fi">🇫🇮 FI</option>
            <option value="pl">🇵🇱 PL</option>
            <option value="tr">🇹🇷 TR</option>
            <option value="ar">🇦🇷 AR</option>
            <option value="cl">🇨🇱 CL</option>
            <option value="co">🇨🇴 CO</option>
            <option value="pe">🇵🇪 PE</option>
            <option value="ve">🇻🇪 VE</option>
            <option value="eg">🇪🇬 EG</option>
            <option value="ng">🇳🇬 NG</option>
            <option value="ke">🇰🇪 KE</option>
            <option value="gh">🇬🇭 GH</option>
            <option value="th">🇹🇭 TH</option>
            <option value="my">🇲🇾 MY</option>
            <option value="sg">🇸🇬 SG</option>
            <option value="ph">🇵🇭 PH</option>
            <option value="id">🇮🇩 ID</option>
            <option value="vn">🇻🇳 VN</option>
            <option value="pk">🇵🇰 PK</option>
            <option value="bd">🇧🇩 BD</option>
            <option value="np">🇳🇵 NP</option>
            <option value="af">🇦🇫 AF</option>
            <option value="ir">🇮🇷 IR</option>
            <option value="iq">🇮🇶 IQ</option>
            <option value="sa">🇸🇦 SA</option>
            <option value="ae">🇦🇪 AE</option>
            <option value="il">🇮🇱 IL</option>
            <option value="jo">🇯🇴 JO</option>
            <option value="lb">🇱🇧 LB</option>
            <option value="sy">🇸🇾 SY</option>
            <option value="ye">🇾🇪 YE</option>
            <option value="om">🇴🇲 OM</option>
            <option value="kw">🇰🇼 KW</option>
            <option value="qa">🇶🇦 QA</option>
            <option value="bh">🇧🇭 BH</option>
            <option value="cy">🇨🇾 CY</option>
            <option value="gr">🇬🇷 GR</option>
            <option value="pt">🇵🇹 PT</option>
            <option value="cz">🇨🇿 CZ</option>
            <option value="hu">🇭🇺 HU</option>
            <option value="ro">🇷🇴 RO</option>
            <option value="bg">🇧🇬 BG</option>
            <option value="hr">🇭🇷 HR</option>
            <option value="si">🇸🇮 SI</option>
            <option value="sk">🇸🇰 SK</option>
            <option value="ee">🇪🇪 EE</option>
            <option value="lv">🇱🇻 LV</option>
            <option value="lt">🇱🇹 LT</option>
            <option value="mt">🇲🇹 MT</option>
            <option value="is">🇮🇸 IS</option>
            <option value="ie">🇮🇪 IE</option>
            <option value="ch">🇨🇭 CH</option>
            <option value="at">🇦🇹 AT</option>
            <option value="be">🇧🇪 BE</option>
            <option value="lu">🇱🇺 LU</option>
            <option value="mc">🇲🇨 MC</option>
            <option value="ad">🇦🇩 AD</option>
            <option value="sm">🇸🇲 SM</option>
            <option value="va">🇻🇦 VA</option>
            <option value="li">🇱🇮 LI</option>
            <option value="nz">🇳🇿 NZ</option>
            <option value="fj">🇫🇯 FJ</option>
            <option value="ws">🇼🇸 WS</option>
            <option value="to">🇹🇴 TO</option>
            <option value="sb">🇸🇧 SB</option>
            <option value="vu">🇻🇺 VU</option>
            <option value="pg">🇵🇬 PG</option>
            <option value="tv">🇹🇻 TV</option>
            <option value="nr">🇳🇷 NR</option>
            <option value="ki">🇰🇮 KI</option>
            <option value="mh">🇲🇭 MH</option>
            <option value="pw">🇵🇼 PW</option>
            <option value="fm">🇫🇲 FM</option>
            <option value="as">🇦🇸 AS</option>
            <option value="gu">🇬🇺 GU</option>
            <option value="mp">🇲🇵 MP</option>
            <option value="pr">🇵🇷 PR</option>
            <option value="vi">🇻🇮 VI</option>
            <option value="um">🇺🇲 UM</option>
            <option value="gl">🇬🇱 GL</option>
            <option value="fo">🇫🇴 FO</option>
            <option value="ax">🇦🇽 AX</option>
            <option value="sj">🇸🇯 SJ</option>
            <option value="bq">🇧🇶 BQ</option>
            <option value="cw">🇨🇼 CW</option>
            <option value="sx">🇸🇽 SX</option>
            <option value="aw">🇦🇼 AW</option>
            <option value="tt">🇹🇹 TT</option>
            <option value="jm">🇯🇲 JM</option>
            <option value="bs">🇧🇸 BS</option>
            <option value="bb">🇧🇧 BB</option>
            <option value="gd">🇬🇩 GD</option>
            <option value="vc">🇻🇨 VC</option>
            <option value="lc">🇱🇨 LC</option>
            <option value="dm">🇩🇲 DM</option>
            <option value="ag">🇦🇬 AG</option>
            <option value="kn">🇰🇳 KN</option>
            <option value="gy">🇬🇾 GY</option>
            <option value="sr">🇸🇷 SR</option>
            <option value="gf">🇬🇫 GF</option>
            <option value="mq">🇲🇶 MQ</option>
            <option value="gp">🇬🇵 GP</option>
            <option value="bl">🇧🇱 BL</option>
            <option value="mf">🇲🇫 MF</option>
            <option value="pm">🇵🇲 PM</option>
            <option value="re">🇷🇪 RE</option>
            <option value="yt">🇾🇹 YT</option>
            <option value="sc">🇸🇨 SC</option>
            <option value="mu">🇲🇺 MU</option>
            <option value="km">🇰🇲 KM</option>
            <option value="mg">🇲🇬 MG</option>
            <option value="mz">🇲🇿 MZ</option>
            <option value="mw">🇲🇼 MW</option>
            <option value="zm">🇿🇲 ZM</option>
            <option value="zw">🇿🇼 ZW</option>
            <option value="bw">🇧🇼 BW</option>
            <option value="sz">🇸🇿 SZ</option>
            <option value="ls">🇱🇸 LS</option>
            <option value="na">🇳🇦 NA</option>
            <option value="bj">🇧🇯 BJ</option>
            <option value="bf">🇧🇫 BF</option>
            <option value="cv">🇨🇻 CV</option>
            <option value="gm">🇬🇲 GM</option>
            <option value="gn">🇬🇳 GN</option>
            <option value="gw">🇬🇼 GW</option>
            <option value="lr">🇱🇷 LR</option>
            <option value="ml">🇲🇱 ML</option>
            <option value="mr">🇲🇷 MR</option>
            <option value="ne">🇳🇪 NE</option>
            <option value="sn">🇸🇳 SN</option>
            <option value="sl">🇸🇱 SL</option>
            <option value="tg">🇹🇬 TG</option>
            <option value="ci">🇨🇮 CI</option>
            <option value="gh">🇬🇭 GH</option>
            <option value="tn">🇹🇳 TN</option>
            <option value="ly">🇱🇾 LY</option>
            <option value="dz">🇩🇿 DZ</option>
            <option value="ma">🇲🇦 MA</option>
            <option value="eh">🇪🇭 EH</option>
            <option value="td">🇹🇩 TD</option>
            <option value="cm">🇨🇲 CM</option>
            <option value="cg">🇨🇬 CG</option>
            <option value="gq">🇬🇶 GQ</option>
            <option value="ga">🇬🇦 GA</option>
            <option value="cf">🇨🇫 CF</option>
            <option value="st">🇸🇹 ST</option>
            <option value="ao">🇦🇴 AO</option>
            <option value="cd">🇨🇩 CD</option>
            <option value="rw">🇷🇼 RW</option>
            <option value="bi">🇧🇮 BI</option>
            <option value="ug">🇺🇬 UG</option>
            <option value="tz">🇹🇿 TZ</option>
            <option value="mz">🇲🇿 MZ</option>
            <option value="dj">🇩🇯 DJ</option>
            <option value="er">🇪🇷 ER</option>
            <option value="ss">🇸🇸 SS</option>
            <option value="et">🇪🇹 ET</option>
            <option value="so">🇸🇴 SO</option>
            <option value="sd">🇸🇩 SD</option>
            <option value="ug">🇺🇬 UG</option>
            <option value="ke">🇰🇪 KE</option>
            <option value="tz">🇹🇿 TZ</option>
            <option value="mw">🇲🇼 MW</option>
            <option value="zm">🇿🇲 ZM</option>
            <option value="zw">🇿🇼 ZW</option>
            <option value="bw">🇧🇼 BW</option>
            <option value="sz">🇸🇿 SZ</option>
            <option value="ls">🇱🇸 LS</option>
            <option value="na">🇳🇦 NA</option>
            <option value="bj">🇧🇯 BJ</option>
            <option value="bf">🇧🇫 BF</option>
            <option value="cv">🇨🇻 CV</option>
            <option value="gm">🇬🇲 GM</option>
            <option value="gn">🇬🇳 GN</option>
            <option value="gw">🇬🇼 GW</option>
            <option value="lr">🇱🇷 LR</option>
            <option value="ml">🇲🇱 ML</option>
            <option value="mr">🇲🇷 MR</option>
            <option value="ne">🇳🇪 NE</option>
            <option value="sn">🇸🇳 SN</option>
            <option value="sl">🇸🇱 SL</option>
            <option value="tg">🇹🇬 TG</option>
            <option value="ci">🇨🇮 CI</option>
            <option value="gh">🇬🇭 GH</option>
            <option value="tn">🇹🇳 TN</option>
            <option value="ly">🇱🇾 LY</option>
            <option value="dz">🇩🇿 DZ</option>
            <option value="ma">🇲🇦 MA</option>
            <option value="eh">🇪🇭 EH</option>
            <option value="td">🇹🇩 TD</option>
            <option value="cm">🇨🇲 CM</option>
            <option value="cg">🇨🇬 CG</option>
            <option value="gq">🇬🇶 GQ</option>
            <option value="ga">🇬🇦 GA</option>
            <option value="cf">🇨🇫 CF</option>
            <option value="st">🇸🇹 ST</option>
            <option value="ao">🇦🇴 AO</option>
            <option value="cd">🇨🇩 CD</option>
            <option value="rw">🇷🇼 RW</option>
            <option value="bi">🇧🇮 BI</option>
            <option value="ug">🇺🇬 UG</option>
            <option value="tz">🇹🇿 TZ</option>
            <option value="mz">🇲🇿 MZ</option>
            <option value="dj">🇩🇯 DJ</option>
            <option value="er">🇪🇷 ER</option>
            <option value="ss">🇸🇸 SS</option>
            <option value="et">🇪🇹 ET</option>
            <option value="so">🇸🇴 SO</option>
            <option value="sd">🇸🇩 SD</option>
          </select>
        </div>

        <div className="nav-item">
          <span className="nav-line-2">English - LKR</span>
        </div>

        <div className="nav-item">
          <span className="nav-line-2 cart-icon">🛒</span>
        </div>

        <div className="nav-item">
          <span className="nav-line-2">Sign in</span>
        </div>

        <button className="create-account-btn">
          Create account
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
