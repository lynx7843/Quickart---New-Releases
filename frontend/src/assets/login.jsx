import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const styles = `
  .login-page {
    min-height: 100vh;
    background-color: #f8f8f8;
    display: flex;
    flex-direction: column;
    font-family: Arial, sans-serif;
    color: #333;
  }

  .login-topbar {
    background: #fff;
    border-bottom: 2px solid #250902;
    padding: 14px 24px;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    cursor: pointer;
  }

  .login-logo { display: flex; align-items: center; gap: 6px; text-decoration: none; }
  .login-logo-icon { font-size: 22px; }
  .login-logo-text { font-size: 20px; font-weight: 700; letter-spacing: 1px; }
  .login-logo-quick { color: #250902; }
  .login-logo-art   { color: #250902; }
  .login-logo-tagline { font-size: 10px; color: #888; letter-spacing: 2px; margin-top: 1px; }

  .login-body {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
  }

  .login-wrapper {
    display: flex;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 16px rgba(0,0,0,0.1);
    overflow: hidden;
    width: 100%;
    max-width: 900px;
  }

  .login-form-panel { flex: 1; padding: 48px 44px; }

  .login-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #888;
    text-decoration: none;
    font-size: 13px;
    margin-bottom: 28px;
    transition: color 0.2s;
  }
  .login-back:hover { color: #250902; }

  .login-title { font-size: 26px; font-weight: 700; color: #250902; margin-bottom: 6px; }
  .login-subtitle { font-size: 14px; color: #888; margin-bottom: 32px; }

  .login-error {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #fff5f5;
    border: 1px solid #fca5a5;
    color: #dc2626;
    padding: 11px 14px;
    border-radius: 8px;
    font-size: 13px;
    margin-bottom: 20px;
  }

  .form-group { margin-bottom: 18px; }
  .form-label { display: block; font-size: 13px; font-weight: 700; color: #333; margin-bottom: 7px; }

  .input-wrap { position: relative; }

  .form-input {
    width: 100%;
    padding: 11px 14px 11px 40px;
    border: 1.5px solid #ddd;
    border-radius: 8px;
    font-family: Arial, sans-serif;
    font-size: 14px;
    color: #333;
    background: #fafafa;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    box-sizing: border-box;
  }
  .form-input:focus { border-color: #250902; background: #fff; box-shadow: 0 0 0 3px rgba(37,9,2,0.08); }
  .form-input::placeholder { color: #bbb; }

  .input-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    pointer-events: none;
  }

  .pw-toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    padding: 0;
    line-height: 1;
  }

  .forgot-row { text-align: right; margin-top: -8px; margin-bottom: 20px; }
  .forgot-row a { font-size: 12px; color: #250902; text-decoration: none; }
  .forgot-row a:hover { text-decoration: underline; }

  .login-btn {
    width: 100%;
    padding: 13px;
    background: #250902;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-family: Arial, sans-serif;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 20px;
  }
  .login-btn:hover:not(:disabled) { background: #3d1005; transform: translateY(-1px); }
  .login-btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  .divider { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
  .divider-line { flex: 1; height: 1px; background: #e5e5e5; }
  .divider-text { font-size: 12px; color: #aaa; }

  .social-row { display: flex; gap: 10px; margin-bottom: 24px; }
  .social-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px;
    border: 1.5px solid #ddd;
    border-radius: 8px;
    background: #fff;
    font-family: Arial, sans-serif;
    font-size: 13px;
    color: #555;
    cursor: pointer;
    text-decoration: none;
    transition: border-color 0.2s, background 0.2s;
  }
  .social-btn:hover { border-color: #250902; background: #fdf8f7; color: #250902; }

  .register-text { text-align: center; font-size: 13px; color: #888; }
  .register-text a { color: #250902; font-weight: 700; text-decoration: none; }
  .register-text a:hover { text-decoration: underline; }

  /* Right info panel */
  .login-info-panel {
    width: 320px;
    background: #250902;
    color: #fff;
    padding: 48px 32px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 24px;
  }

  .info-heading { font-size: 21px; font-weight: 700; line-height: 1.35; margin-bottom: 4px; }
  .info-sub { font-size: 13px; color: rgba(255,255,255,0.65); line-height: 1.6; }

  .info-features { display: flex; flex-direction: column; gap: 12px; }

  .info-feature {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 13px;
    background: rgba(255,255,255,0.07);
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .info-feature-icon { font-size: 20px; flex-shrink: 0; }
  .info-feature-title { font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 2px; }
  .info-feature-desc { font-size: 12px; color: rgba(255,255,255,0.55); line-height: 1.4; }

  .info-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 20px;
    font-size: 12px;
    color: rgba(255,255,255,0.8);
  }

  @media (max-width: 700px) {
    .login-info-panel { display: none; }
    .login-form-panel { padding: 32px 24px; }
  }
`;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      const res = await login(email, password);
      if (res?.success) {
        const role  = res.user?.role;
        const userEmail = email.trim().toLowerCase();
        if (userEmail === 'quickart_admin@gmail.com' || role === 'ADMIN') {
          navigate('/admin');
        } else if (role === 'SELLER') {
          navigate('/seller-dashboard');
        } else {
          navigate('/');
        }
      } else {
        setError(res?.message || 'Invalid email or password.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <style>{styles}</style>

      {/* Top bar */}
      <div className="login-topbar" onClick={() => navigate('/')}>
        <div className="login-logo">
          <span className="login-logo-icon">⚡</span>
          <div>
            <div className="login-logo-text">
              <span className="login-logo-quick">QUICK</span>
              🛒
              <span className="login-logo-art">ART</span>
            </div>
            <div className="login-logo-tagline">SMART. FAST. RELIABLE</div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="login-body">
        <div className="login-wrapper">

          {/* Form panel */}
          <div className="login-form-panel">
            <Link to="/" className="login-back">← Back to Home</Link>

            <h1 className="login-title">Welcome Back!</h1>
            <p className="login-subtitle">Sign in to your QuickArt account</p>

            {error && (
              <div className="login-error">⚠️ {error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-wrap">
                  <span className="input-icon">✉️</span>
                  <input
                    className="form-input"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrap">
                  <span className="input-icon">🔒</span>
                  <input
                    className="form-input"
                    type={showPw ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    style={{ paddingRight: 40 }}
                  />
                  <button type="button" className="pw-toggle" onClick={() => setShowPw(p => !p)}>
                    {showPw ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="forgot-row">
                <a href="#">Forgot Password?</a>
              </div>

              <button className="login-btn" type="submit" disabled={loading}>
                {loading ? <><div className="spinner" /> Signing In...</> : '🔐 Sign In'}
              </button>
            </form>

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">or continue with</span>
              <div className="divider-line" />
            </div>

            <div className="social-row">
              <a href="#" className="social-btn">
                <svg width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google
              </a>
              <a href="#" className="social-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.75-1.33-1.75-1.08-.74.08-.73.08-.73 1.2.09 1.83 1.23 1.83 1.23 1.06 1.82 2.79 1.29 3.47.99.11-.77.41-1.29.75-1.59-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.01 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>
                GitHub
              </a>
            </div>

            <p className="register-text">
              Don't have an account?{' '}
              <Link to="/register">Sign Up for Free</Link>
            </p>
          </div>

          {/* Info panel */}
          <div className="login-info-panel">
            <div>
              <div className="info-heading">Shop smarter with QuickArt ⚡</div>
              <div className="info-sub">Your one-stop shop for fashion, electronics, home & more.</div>
            </div>
            <div className="info-features">
              <div className="info-feature">
                <span className="info-feature-icon">🤖</span>
                <div>
                  <div className="info-feature-title">AI Assistant</div>
                  <div className="info-feature-desc">Personalized product recommendations</div>
                </div>
              </div>
              <div className="info-feature">
                <span className="info-feature-icon">👗</span>
                <div>
                  <div className="info-feature-title">Virtual Fitting Room</div>
                  <div className="info-feature-desc">Try on clothes before you buy</div>
                </div>
              </div>
              <div className="info-feature">
                <span className="info-feature-icon">📦</span>
                <div>
                  <div className="info-feature-title">Track Orders</div>
                  <div className="info-feature-desc">Real-time tracking & order history</div>
                </div>
              </div>
            </div>
            <div className="info-badge">🛡️ &nbsp;Secure & Encrypted Login</div>
          </div>

        </div>
      </div>
    </div>
  );
}