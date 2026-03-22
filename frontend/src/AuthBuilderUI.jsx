import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #f8f8f8;
    --surface: #ffffff;
    --surface2: #f2f2f5;
    --surface3: #ebebef;
    --border: #e2e2e9;
    --primary: #6366f1;
    --primary-light: #818cf8;
    --primary-dark: #4f46e5;
    --text: #18181f;
    --text-muted: #6b6b8a;
    --text-dim: #a0a0b8;
    --success: #10b981;
    --error: #f43f5e;
    --gradient: linear-gradient(135deg, #6366f1, #a78bfa, #06b6d4);
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
    --shadow-md: 0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04);
    --shadow-lg: 0 12px 40px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.04);
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; overflow-x: hidden; }
  .app { min-height: 100vh; position: relative; }
  .app::before {
    content: ''; position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image:
      radial-gradient(circle at 15% 15%, rgba(99,102,241,0.06) 0%, transparent 50%),
      radial-gradient(circle at 85% 85%, rgba(6,182,212,0.04) 0%, transparent 50%);
  }

  /* NAV */
  .nav {
    position: sticky; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 40px; height: 64px;
    background: rgba(248,248,248,0.88); backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border); box-shadow: var(--shadow-sm);
  }
  .logo {
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 21px; letter-spacing: -0.5px;
    background: var(--gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; cursor: pointer;
  }
  .nav-links { display: flex; gap: 8px; align-items: center; }
  .nav-btn { padding: 8px 18px; border-radius: 8px; border: none; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
  .nav-btn-ghost { background: transparent; color: var(--text-muted); }
  .nav-btn-ghost:hover { color: var(--text); background: var(--surface2); }
  .nav-btn-outline { background: transparent; color: var(--text); border: 1px solid var(--border); }
  .nav-btn-outline:hover { border-color: var(--primary); color: var(--primary); }
  .nav-btn-solid { background: #250902; color: white; box-shadow: 0 2px 8px rgba(37,9,2,0.3); }
  .nav-btn-solid:hover { background: #3e180b; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(37,9,2,0.4); }

  /* PAGE */
  .page { min-height: calc(100vh - 120px); display: flex; align-items: center; justify-content: center; padding: 40px 20px; position: relative; z-index: 1; }

  /* AUTH CARD */
  .auth-card {
    width: 100%; max-width: 440px; background: var(--surface); border: 1px solid var(--border);
    border-radius: 24px; padding: 44px; box-shadow: var(--shadow-lg);
    animation: fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

  .auth-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.2);
    border-radius: 100px; padding: 5px 14px; margin-bottom: 22px;
    font-size: 12px; color: var(--primary); font-weight: 600; letter-spacing: 0.4px;
  }
  .auth-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 28px; line-height: 1.15; letter-spacing: -0.5px; margin-bottom: 8px; color: var(--text); }
  .auth-subtitle { font-size: 14px; color: var(--text-muted); margin-bottom: 30px; line-height: 1.5; }
  .auth-subtitle a { color: var(--primary); text-decoration: none; font-weight: 600; }
  .auth-subtitle a:hover { text-decoration: underline; }

  .social-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 22px; }
  .social-btn {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 11px; border-radius: 10px; background: var(--surface2); border: 1px solid var(--border);
    color: var(--text); font-size: 13px; font-weight: 500; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.2s;
  }
  .social-btn:hover { border-color: #c7c7d9; background: #ebebf2; transform: translateY(-1px); box-shadow: var(--shadow-sm); }

  .divider { display: flex; align-items: center; gap: 12px; margin-bottom: 22px; font-size: 12px; color: var(--text-dim); }
  .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  .form-group { margin-bottom: 14px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  label { display: block; font-size: 13px; font-weight: 600; color: var(--text-muted); margin-bottom: 6px; }

  .input-wrap { position: relative; }
  .input-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); font-size: 14px; color: var(--text-dim); pointer-events: none; transition: color 0.2s; }
  .input-wrap:focus-within .input-icon { color: var(--primary); }

  input[type="text"], input[type="email"], input[type="password"] {
    width: 100%; padding: 11px 14px 11px 38px;
    background: var(--surface2); border: 1.5px solid var(--border); border-radius: 10px;
    color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: all 0.2s;
  }
  input:focus { border-color: var(--primary); background: white; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
  input::placeholder { color: var(--text-dim); }

  .input-toggle { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-dim); cursor: pointer; font-size: 14px; padding: 0; }
  .input-toggle:hover { color: var(--text-muted); }

  .form-footer { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .check-label { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-muted); cursor: pointer; }
  .custom-check { width: 16px; height: 16px; border-radius: 4px; border: 1.5px solid var(--border); background: var(--surface2); display: flex; align-items: center; justify-content: center; transition: all 0.15s; flex-shrink: 0; }
  .custom-check.checked { background: var(--primary); border-color: var(--primary); }
  .custom-check.checked::after { content: '✓'; color: white; font-size: 10px; }
  .forgot-link { font-size: 13px; color: var(--primary); text-decoration: none; font-weight: 500; }
  .forgot-link:hover { text-decoration: underline; }

  .strength-bar { display: flex; gap: 4px; margin-top: 6px; }
  .strength-seg { flex: 1; height: 3px; border-radius: 2px; background: var(--surface3); transition: background 0.3s; }

  .btn-primary {
    width: 100%; padding: 13px; background: var(--gradient); border: none; border-radius: 10px;
    color: white; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px;
    cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 16px rgba(99,102,241,0.35);
  }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(99,102,241,0.45); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  /* BUILDER */
  .builder-page { min-height: calc(100vh - 120px); padding-top: 0; position: relative; z-index: 1; }
  .builder-header { text-align: center; padding: 48px 20px 32px; animation: fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) both; }

  .step-tracker { display: flex; align-items: flex-start; justify-content: center; margin-bottom: 32px; }
  .step-item { display: flex; flex-direction: column; align-items: center; gap: 6px; }
  .step-dot {
    width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; font-family: 'Syne', sans-serif; transition: all 0.3s;
    border: 2px solid var(--border); background: var(--surface); color: var(--text-dim); box-shadow: var(--shadow-sm);
  }
  .step-dot.active { border-color: var(--primary); color: var(--primary); background: rgba(99,102,241,0.06); box-shadow: 0 0 0 4px rgba(99,102,241,0.1); }
  .step-dot.done { border-color: var(--success); background: var(--success); color: white; }
  .step-label { font-size: 11px; color: var(--text-dim); white-space: nowrap; font-weight: 600; }
  .step-line { width: 70px; height: 2px; background: var(--border); margin-bottom: 22px; flex-shrink: 0; border-radius: 2px; }
  .step-line.done { background: var(--success); }

  .builder-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: clamp(26px,4.5vw,42px); letter-spacing: -1px; line-height: 1.1; margin-bottom: 10px; color: var(--text); }
  .gradient-text { background: var(--gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .builder-subtitle { color: var(--text-muted); font-size: 15px; max-width: 460px; margin: 0 auto; line-height: 1.6; }

  .builder-main { max-width: 920px; margin: 0 auto; padding: 0 20px 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 18px; animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
  .builder-card { background: var(--surface); border: 1px solid var(--border); border-radius: 18px; padding: 26px; box-shadow: var(--shadow-sm); transition: box-shadow 0.2s, border-color 0.2s; }
  .builder-card:hover { box-shadow: var(--shadow-md); border-color: #d0d0e0; }
  .builder-card-full { grid-column: 1 / -1; }

  .bc-label { font-size: 10px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: var(--text-dim); margin-bottom: 10px; }
  .bc-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; color: var(--text); margin-bottom: 5px; }
  .bc-desc { font-size: 13px; color: var(--text-muted); margin-bottom: 18px; line-height: 1.5; }

  .subdomain-input-wrap { display: flex; align-items: center; background: var(--surface2); border: 1.5px solid var(--border); border-radius: 10px; overflow: hidden; transition: all 0.2s; }
  .subdomain-input-wrap:focus-within { border-color: var(--primary); background: white; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
  .subdomain-prefix, .subdomain-suffix { padding: 11px 11px; color: var(--text-dim); font-size: 12px; white-space: nowrap; background: var(--surface3); font-weight: 500; }
  .subdomain-prefix { border-right: 1.5px solid var(--border); }
  .subdomain-suffix { border-left: 1.5px solid var(--border); }
  .subdomain-input { flex: 1; padding: 11px 10px; background: transparent; border: none !important; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; box-shadow: none !important; }

  .availability { margin-top: 7px; font-size: 12px; display: flex; align-items: center; gap: 5px; font-weight: 600; }
  .availability.avail { color: var(--success); }
  .availability.taken { color: var(--error); }

  .template-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }
  .template-item { border-radius: 10px; overflow: hidden; cursor: pointer; border: 2px solid var(--border); transition: all 0.2s; aspect-ratio: 4/3; position: relative; }
  .template-item:hover { border-color: var(--primary-light); transform: translateY(-2px); box-shadow: var(--shadow-md); }
  .template-item.selected { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }
  .template-item.selected::after { content: '✓'; position: absolute; top: 6px; right: 6px; width: 17px; height: 17px; border-radius: 50%; background: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 9px; color: white; font-weight: 700; }
  .template-preview { width: 100%; height: 100%; display: flex; flex-direction: column; gap: 4px; padding: 7px; }
  .tprev-bar { height: 3px; border-radius: 2px; }
  .tprev-hero { flex: 1; border-radius: 4px; display: flex; align-items: center; justify-content: center; }
  .tprev-row { display: flex; gap: 3px; height: 18px; }
  .tprev-col { flex: 1; border-radius: 2px; }
  .template-name { position: absolute; bottom: 5px; left: 7px; font-size: 9px; font-weight: 700; color: white; text-shadow: 0 1px 4px rgba(0,0,0,0.6); }

  .color-swatches { display: flex; gap: 8px; flex-wrap: wrap; }
  .swatch { width: 30px; height: 30px; border-radius: 8px; cursor: pointer; border: 2px solid transparent; transition: all 0.15s; }
  .swatch:hover { transform: scale(1.15); }
  .swatch.selected { border-color: var(--primary); box-shadow: 0 0 0 2px white, 0 0 0 4px var(--primary); }

  .preview-pane { border-radius: 12px; overflow: hidden; border: 1px solid var(--border); background: var(--surface2); height: 190px; box-shadow: var(--shadow-sm); }
  .preview-toolbar { height: 32px; background: var(--surface3); border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 12px; gap: 5px; }
  .tb-dot { width: 9px; height: 9px; border-radius: 50%; }
  .tb-url { flex: 1; background: var(--surface2); border-radius: 4px; border: 1px solid var(--border); padding: 2px 10px; font-size: 10px; color: var(--text-dim); margin: 0 10px; }
  .preview-body { padding: 12px; height: calc(100% - 32px); display: flex; flex-direction: column; gap: 7px; }
  .prev-headline { height: 13px; border-radius: 4px; width: 60%; }
  .prev-sub { height: 9px; border-radius: 3px; width: 40%; opacity: 0.5; }
  .prev-cta { height: 24px; border-radius: 6px; width: 95px; }
  .prev-img { flex: 1; border-radius: 8px; min-height: 48px; }

  .plan-cards { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; }
  .plan-card { border-radius: 14px; padding: 20px; border: 1.5px solid var(--border); background: var(--surface2); cursor: pointer; transition: all 0.2s; position: relative; }
  .plan-card:hover { border-color: rgba(99,102,241,0.4); background: white; box-shadow: var(--shadow-md); }
  .plan-card.selected { border-color: var(--primary); background: white; box-shadow: 0 0 0 3px rgba(99,102,241,0.12), var(--shadow-md); }
  .plan-card.popular::before { content: 'Popular'; position: absolute; top: -11px; left: 50%; transform: translateX(-50%); background: var(--gradient); color: white; font-size: 10px; font-weight: 700; padding: 3px 12px; border-radius: 100px; white-space: nowrap; }
  .plan-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; margin-bottom: 4px; color: var(--text); }
  .plan-price { font-size: 20px; font-weight: 800; color: var(--primary-dark); margin-bottom: 14px; font-family: 'Syne', sans-serif; }
  .plan-price span { font-size: 12px; color: var(--text-muted); font-weight: 400; }
  .plan-features { list-style: none; display: flex; flex-direction: column; gap: 5px; }
  .plan-features li { font-size: 12px; color: var(--text-muted); display: flex; align-items: center; gap: 5px; }
  .plan-features li::before { content: '✦'; color: var(--primary); font-size: 8px; flex-shrink: 0; }

  .builder-cta { grid-column: 1 / -1; display: flex; align-items: center; justify-content: space-between; background: linear-gradient(135deg,rgba(99,102,241,0.06),rgba(167,139,250,0.04)); border: 1px solid rgba(99,102,241,0.18); border-radius: 16px; padding: 24px 28px; box-shadow: var(--shadow-sm); }
  .cta-text h3 { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 17px; margin-bottom: 3px; color: var(--text); }
  .cta-text p { font-size: 13px; color: var(--text-muted); }

  .btn-launch { padding: 12px 26px; background: var(--gradient); border: none; border-radius: 10px; color: white; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.2s; white-space: nowrap; box-shadow: 0 4px 14px rgba(99,102,241,0.3); }
  .btn-launch:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(99,102,241,0.4); }
  .btn-launch:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  /* PAYMENT */
  .payment-page { min-height: 100vh; padding: 84px 20px 50px; position: relative; z-index: 1; display: flex; align-items: flex-start; justify-content: center; }
  .payment-container { width: 100%; max-width: 900px; padding-top: 16px; }
  .payment-header { margin-bottom: 28px; animation: fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both; }
  .payment-header h2 { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 26px; color: var(--text); margin-bottom: 4px; letter-spacing: -0.5px; }
  .payment-header p { color: var(--text-muted); font-size: 14px; }

  .payment-grid { display: grid; grid-template-columns: 1fr 370px; gap: 22px; animation: fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) 0.05s both; }

  .pay-card { background: var(--surface); border: 1px solid var(--border); border-radius: 18px; padding: 26px; box-shadow: var(--shadow-sm); margin-bottom: 18px; }
  .pay-card:last-child { margin-bottom: 0; }
  .pay-section-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; color: var(--text); margin-bottom: 18px; display: flex; align-items: center; gap: 8px; }
  .pay-section-title span { background: var(--primary); color: white; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }

  .pay-methods { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
  .pay-method-btn { flex: 1; min-width: 80px; padding: 12px 8px; border-radius: 12px; border: 1.5px solid var(--border); background: var(--surface2); cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; align-items: center; gap: 5px; font-size: 11px; font-weight: 600; color: var(--text-muted); font-family: 'DM Sans', sans-serif; }
  .pay-method-btn:hover { border-color: var(--primary-light); color: var(--primary); background: white; }
  .pay-method-btn.active { border-color: var(--primary); background: rgba(99,102,241,0.05); color: var(--primary); box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
  .pay-method-icon { font-size: 20px; }

  .card-input-group { margin-bottom: 14px; }
  .card-input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .card-number-wrap { position: relative; }
  .card-chip { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); display: flex; gap: 3px; }
  .chip-card { width: 26px; height: 16px; border-radius: 3px; }

  .bank-details { background: var(--surface2); border: 1px solid var(--border); border-radius: 12px; padding: 18px; }
  .bank-row { display: flex; justify-content: space-between; align-items: center; padding: 9px 0; border-bottom: 1px solid var(--border); }
  .bank-row:last-child { border-bottom: none; }
  .bank-row-label { font-size: 11px; color: var(--text-dim); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
  .bank-row-value { font-size: 13px; font-weight: 600; color: var(--text); font-family: 'Syne', sans-serif; }
  .copy-btn { padding: 3px 9px; border-radius: 6px; border: 1px solid var(--border); background: var(--surface); font-size: 11px; cursor: pointer; color: var(--primary); font-weight: 600; transition: all 0.15s; }
  .copy-btn:hover { background: var(--primary); color: white; border-color: var(--primary); }

  .wallet-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .wallet-option { border-radius: 12px; border: 1.5px solid var(--border); background: var(--surface2); padding: 13px; text-align: center; cursor: pointer; transition: all 0.2s; }
  .wallet-option:hover { border-color: var(--primary-light); background: white; transform: translateY(-1px); box-shadow: var(--shadow-sm); }
  .wallet-option.active { border-color: var(--primary); background: rgba(99,102,241,0.05); }
  .wallet-emoji { font-size: 24px; margin-bottom: 5px; }
  .wallet-name { font-size: 12px; font-weight: 700; color: var(--text); font-family: 'Syne', sans-serif; }
  .wallet-desc { font-size: 10px; color: var(--text-muted); margin-top: 2px; }

  .phone-input-row { display: flex; gap: 8px; margin-top: 14px; align-items: flex-end; }
  .phone-code { padding: 11px 12px; background: var(--surface2); border: 1.5px solid var(--border); border-radius: 10px; font-size: 14px; color: var(--text); font-weight: 600; white-space: nowrap; }

  .order-summary { position: sticky; top: 80px; }
  .summary-plan-badge { background: linear-gradient(135deg,rgba(99,102,241,0.07),rgba(167,139,250,0.05)); border: 1px solid rgba(99,102,241,0.15); border-radius: 12px; padding: 15px; margin-bottom: 18px; }
  .summary-plan-name { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 16px; color: var(--text); }
  .summary-plan-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

  .summary-line { display: flex; justify-content: space-between; align-items: center; padding: 9px 0; font-size: 14px; }
  .summary-line:not(:last-child) { border-bottom: 1px solid var(--border); }
  .summary-line .lbl { color: var(--text-muted); }
  .summary-line .val { font-weight: 600; color: var(--text); font-family: 'Syne', sans-serif; }
  .summary-line.discount .val { color: var(--success); }
  .summary-line.total .lbl { font-weight: 700; color: var(--text); font-size: 15px; }
  .summary-line.total .val { font-size: 20px; color: var(--primary-dark); }
  .summary-divider { height: 1px; background: var(--border); margin: 6px 0; }

  .pay-now-btn { width: 100%; padding: 14px; background: var(--gradient); border: none; border-radius: 12px; color: white; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 16px; cursor: pointer; transition: all 0.2s; margin-top: 18px; box-shadow: 0 6px 20px rgba(99,102,241,0.35); display: flex; align-items: center; justify-content: center; gap: 8px; }
  .pay-now-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(99,102,241,0.45); }
  .pay-now-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .secure-badges { display: flex; justify-content: center; gap: 14px; margin-top: 14px; flex-wrap: wrap; }
  .secure-badge { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--text-dim); font-weight: 500; }

  .toast { position: fixed; bottom: 26px; right: 26px; z-index: 200; background: white; border: 1px solid rgba(16,185,129,0.3); border-radius: 14px; padding: 14px 18px; display: flex; align-items: center; gap: 12px; font-size: 14px; box-shadow: var(--shadow-lg); animation: slideIn 0.35s cubic-bezier(0.16,1,0.3,1); }
  @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  @media (max-width: 700px) {
    .builder-main, .payment-grid { grid-template-columns: 1fr; }
    .builder-card-full { grid-column: 1; }
    .plan-cards { grid-template-columns: 1fr; }
    .template-grid { grid-template-columns: repeat(2,1fr); }
    .builder-cta { flex-direction: column; gap: 14px; text-align: center; }
    .nav { padding: 0 16px; }
    .auth-card { padding: 28px 22px; }
    .form-row { grid-template-columns: 1fr; }
    .order-summary { position: static; }
    .social-row, .card-input-row { grid-template-columns: 1fr; }
  }
`;

// ── Helpers ───────────────────────────────────────────────────────────────────
const STR_COLORS = {1:'#f43f5e',2:'#f59e0b',3:'#06b6d4',4:'#10b981'};
const STR_LABELS = ['','Weak','Fair','Good','Strong'];
function pwdStrength(p){let s=0;if(p.length>=8)s++;if(/[A-Z]/.test(p))s++;if(/[0-9]/.test(p))s++;if(/[^A-Za-z0-9]/.test(p))s++;return s;}

// ── SIGN IN ───────────────────────────────────────────────────────────────────
function SignIn({onSwitch,onSuccess}){
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const { login } = useAuth();

  const submit = async () => {
    if (!email || !pwd) {
      setErr('Please fill in all fields.');
      return;
    }
    setErr('');
    setLoading(true);
    setTimeout(() => {
      login({ name: "User", email }); 
      onSuccess();
      setLoading(false);
    }, 500);
  };

  return(
    <div className="page">
      <div className="auth-card">
        <div className="auth-badge">🚀 Welcome back</div>
        <h1 className="auth-title">Sign in to your<br/><span style={{background:'var(--gradient)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>workspace</span></h1>
        <p className="auth-subtitle">Don't have an account? <a href="#" onClick={e=>{e.preventDefault();onSwitch('signup');}}>Create one free</a></p>
        <div className="social-row">
          <button className="social-btn" onClick={onSuccess}><span style={{fontWeight:800,color:'#4285F4'}}>G</span> Google</button>
          <button className="social-btn" onClick={onSuccess}><span style={{fontWeight:800}}>⎔</span> GitHub</button>
        </div>
        <div className="divider">or continue with email</div>
        <div className="form-group"><label>Email address</label><div className="input-wrap"><span className="input-icon">✉</span><input type="email" placeholder="you@company.com" value={email} onChange={e=>setEmail(e.target.value)}/></div></div>
        <div className="form-group"><label>Password</label><div className="input-wrap"><span className="input-icon">🔒</span><input type={show?'text':'password'} placeholder="Enter your password" value={pwd} onChange={e=>setPwd(e.target.value)} style={{paddingRight:42}}/><button className="input-toggle" onClick={()=>setShow(!show)}>{show?'🙈':'👁'}</button></div></div>
        <div className="form-footer">
          <label className="check-label" onClick={()=>setChecked(!checked)}><div className={`custom-check ${checked?'checked':''}`}/>Remember me</label>
          <a href="#" className="forgot-link">Forgot password?</a>
        </div>
        {err&&<div style={{color:'var(--error)',fontSize:13,marginBottom:14,background:'rgba(244,63,94,0.07)',border:'1px solid rgba(244,63,94,0.2)',borderRadius:8,padding:'9px 13px'}}>{err}</div>}
        <button className="btn-primary" onClick={submit} disabled={loading}>{loading?'Signing in…':'Sign In →'}</button>
      </div>
    </div>
  );
}

// ── SIGN UP ───────────────────────────────────────────────────────────────────
function SignUp({onSwitch,onSuccess}){
  const [form, setForm] = useState({ first: '', last: '', email: '', pwd: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const strength = pwdStrength(form.pwd);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.first || !form.last || !form.email || !form.pwd) {
      setError('Please fill in all fields.');
      return;
    }
    if (!agreed) {
      setError('You must agree to the Terms and Privacy Policy.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      onSuccess();
      setLoading(false);
    }, 500);
  };

  return (
    <div className="page">
      <div className="auth-card">
        <div className="auth-badge">✦ Free forever plan available</div>
        <h1 className="auth-title">Create your<br/><span style={{background:'var(--gradient)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>account</span></h1>
        <p className="auth-subtitle">Already have an account? <a href="#" onClick={e=>{e.preventDefault();onSwitch('signin');}}>Sign in</a></p>
        <div className="social-row">
          <button className="social-btn" onClick={onSuccess}><span style={{fontWeight:800, color: '#4285F4'}}>G</span> Google</button>
          <button className="social-btn" onClick={onSuccess}><span style={{fontWeight:800}}>⎔</span> GitHub</button>
        </div>
        <div className="divider">or sign up with email</div>
        <div className="form-group form-row">
          <div><label>First name</label><div className="input-wrap"><span className="input-icon">👤</span><input type="text" placeholder="Alex" value={form.first} onChange={set('first')}/></div></div>
          <div><label>Last name</label><div className="input-wrap"><span className="input-icon" style={{fontSize:11,left:11}}>▸</span><input type="text" placeholder="Morgan" value={form.last} onChange={set('last')} style={{paddingLeft:28}}/></div></div>
        </div>
        <div className="form-group"><label>Work email</label><div className="input-wrap"><span className="input-icon">✉</span><input type="email" placeholder="you@company.com" value={form.email} onChange={set('email')}/></div></div>
        <div className="form-group">
          <label>Password</label>
          <div className="input-wrap"><span className="input-icon">🔒</span><input type={show?'text':'password'} placeholder="Min 8 characters" value={form.pwd} onChange={set('pwd')} style={{paddingRight:42}}/><button className="input-toggle" onClick={()=>setShow(!show)}>{show?'🙈':'👁'}</button></div>
          {form.pwd&&<><div className="strength-bar">{[1,2,3,4].map(i=><div key={i} className="strength-seg" style={{background:strength>=i?STR_COLORS[strength]:undefined}}/>)}</div><div style={{fontSize:11,color:STR_COLORS[strength]||'var(--text-dim)',marginTop:4,fontWeight:600}}>{STR_LABELS[strength]} password</div></>}
        </div>
        {error && <div style={{color:'var(--error)',fontSize:13,marginBottom:14,background:'rgba(244,63,94,0.07)',border:'1px solid rgba(244,63,94,0.2)',borderRadius:8,padding:'9px 13px'}}>{error}</div>}
        <div style={{marginBottom:20}}><label className="check-label" style={{alignItems:'flex-start',gap:10}} onClick={()=>setAgreed(!agreed)}><div className={`custom-check ${agreed?'checked':''}`} style={{marginTop:1}}/><span style={{fontSize:12,lineHeight:1.5,color:'var(--text-muted)'}}>I agree to the <a href="#" style={{color:'var(--primary)'}}>Terms</a> and <a href="#" style={{color:'var(--primary)'}}>Privacy Policy</a></span></label></div>
        <button className="btn-primary" onClick={handleSubmit} disabled={loading||!agreed}>{loading?'Creating account…':'Create Account →'}</button>
      </div>
    </div>
  );
}

// ── PAYMENT ───────────────────────────────────────────────────────────────────
function PaymentPage({ onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handlePay = () => {
    setLoading(true);
    // Simulate backend payment processing
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <h2>Secure Checkout</h2>
          <p>Complete your purchase to access the Admin Workspace.</p>
        </div>

        <div className="payment-grid">
          <div>
            <div className="pay-card">
              <div className="pay-section-title"><span>1</span> Payment Method</div>
              <div className="pay-methods">
                <button className="pay-method-btn active"><span className="pay-method-icon">💳</span>Card</button>
                <button className="pay-method-btn"><span className="pay-method-icon">🅿️</span>PayPal</button>
                <button className="pay-method-btn"><span className="pay-method-icon"></span>Apple</button>
              </div>

              <div className="card-input-group">
                <label>Card Number</label>
                <div className="input-wrap">
                  <span className="input-icon">💳</span>
                  <input type="text" placeholder="0000 0000 0000 0000" />
                </div>
              </div>

              <div className="form-row">
                <div>
                  <label>Expiry Date</label>
                  <div className="input-wrap"><span className="input-icon">📅</span><input type="text" placeholder="MM / YY" /></div>
                </div>
                <div>
                  <label>CVC</label>
                  <div className="input-wrap"><span className="input-icon">🔒</span><input type="text" placeholder="123" /></div>
                </div>
              </div>
              
              <div className="form-group" style={{marginTop: 12}}>
                <label>Cardholder Name</label>
                <div className="input-wrap"><span className="input-icon">👤</span><input type="text" placeholder="Full Name" /></div>
              </div>
            </div>
          </div>

          <div>
            <div className="pay-card order-summary">
              <div className="summary-plan-badge">
                <div className="summary-plan-name">Admin Pro Access</div>
                <div className="summary-plan-sub">Billed monthly</div>
              </div>

              <div className="summary-line"><span className="lbl">Subtotal</span><span className="val">$49.00</span></div>
              <div className="summary-line"><span className="lbl">Tax</span><span className="val">$4.90</span></div>
              <div className="summary-divider"></div>
              <div className="summary-line total"><span className="lbl">Total</span><span className="val">$53.90</span></div>

              <button className="pay-now-btn" onClick={handlePay} disabled={loading}>{loading ? 'Processing...' : 'Pay & Access'}</button>
              <div className="secure-badges"><span className="secure-badge">🔒 Secure SSL Encrypted</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── INTRO ─────────────────────────────────────────────────────────────────────
function IntroPage({ onStart }) {
  return (
    <div className="page">
      <div className="auth-card" style={{ maxWidth: '600px' }}>
        <div className="auth-badge">✨ Admin Setup</div>
        <h1 className="auth-title">Complete Your<br /><span style={{background:'var(--gradient)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Registration</span></h1>
        <p className="auth-subtitle">Unlock full access to the admin dashboard in 3 simple steps.</p>

        <div style={{ display: 'grid', gap: '20px', marginBottom: '30px' }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
            <div style={{ background: 'var(--surface2)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold', color: 'var(--text)' }}>1</div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px', color: 'var(--text)' }}>Create Account</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Sign up with your email or social accounts to verify your identity.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
            <div style={{ background: 'var(--surface2)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold', color: 'var(--text)' }}>2</div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px', color: 'var(--text)' }}>Add Payment Method</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Securely link your credit card or PayPal for subscription billing.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
            <div style={{ background: 'var(--surface2)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold', color: 'var(--text)' }}>3</div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px', color: 'var(--text)' }}>Access Dashboard</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Get instant access to analytics, user management, and settings.</p>
            </div>
          </div>
        </div>

        <button className="btn-primary" onClick={onStart}>
          Start Registration →
        </button>
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function AuthBuilderUI(){
  const navigate = useNavigate();
  const [page, setPage] = useState('intro');

  const handleSuccess = () => {
    setPage('payment');
  };

  const handlePaymentSuccess = () => {
    navigate('/admin');
  };

  return(
    <>
      <style>{styles}</style>
      <div className="app">
        <nav className="nav">
          <div className="logo" onClick={()=>setPage('intro')}>⬡ Launchpad</div>
          {page !== 'payment' && page !== 'intro' && (
            <div className="nav-links">
              {page!=='signin'&&<button className="nav-btn nav-btn-outline" onClick={() => setPage('signin')}>Sign In</button>}
              {page!=='signup'&&<button className="nav-btn nav-btn-solid" onClick={() => setPage('signup')}>Get Started</button>}
            </div>
          )}
        </nav>
        {page==='intro'&&<IntroPage onStart={()=>setPage('signin')}/>}
        {page==='signin'&&<SignIn onSwitch={setPage} onSuccess={handleSuccess}/>}
        {page==='signup'&&<SignUp onSwitch={setPage} onSuccess={handleSuccess}/>}
        {page==='payment'&&<PaymentPage onSuccess={handlePaymentSuccess}/>}
      </div>
    </>
  );
}
