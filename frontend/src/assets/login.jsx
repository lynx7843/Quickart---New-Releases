import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { ArrowRight, Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;700&display=swap');

  .login-container {
    min-height: 100vh;
    display: flex;
    font-family: 'DM Sans', sans-serif;
    background: #F4F6FA;
  }

  .login-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 40px;
    max-width: 600px;
    position: relative;
    z-index: 2;
  }

  .login-right {
    flex: 1.5;
    background: linear-gradient(135deg, #111111 0%, #222222 100%);
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .login-right::before {
    content: '';
    position: absolute;
    top: -20%; right: -20%;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(85, 122, 140, 0.2) 0%, transparent 70%);
    border-radius: 50%;
  }

  .login-right::after {
    content: '';
    position: absolute;
    bottom: -10%; left: -10%;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(85, 122, 140, 0.15) 0%, transparent 70%);
    border-radius: 50%;
  }

  .login-card {
    background: #fff;
    padding: 48px;
    border-radius: 24px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
    width: 100%;
    max-width: 440px;
    margin: 0 auto;
  }

  .login-header {
    margin-bottom: 32px;
  }

  .login-title {
    font-family: 'Sora', sans-serif;
    font-size: 32px;
    font-weight: 800;
    color: #1a1a1a;
    margin-bottom: 8px;
    letter-spacing: -0.5px;
  }

  .login-subtitle {
    color: #64748b;
    font-size: 15px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-label {
    display: block;
    font-size: 13px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 8px;
  }

  .input-wrapper {
    position: relative;
  }

  .form-input {
    width: 100%;
    padding: 14px 16px 14px 44px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    color: #1a1a1a;
    transition: all 0.2s;
    background: #f8fafc;
  }

  .form-input:focus {
    outline: none;
    border-color: #557a8c;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(85, 122, 140, 0.1);
  }

  .input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
  }

  .login-btn {
    width: 100%;
    padding: 16px;
    background: #557a8c;
    color: #fff;
    border: none;
    border-radius: 12px;
    font-family: 'Sora', sans-serif;
    font-weight: 700;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 12px;
  }

  .login-btn:hover {
    background: #466978;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(85, 122, 140, 0.3);
  }

  .login-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  .error-msg {
    background: #fef2f2;
    color: #ef4444;
    padding: 12px;
    border-radius: 8px;
    font-size: 13px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1px solid #fee2e2;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #64748b;
    text-decoration: none;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 32px;
    transition: color 0.2s;
  }
  
  .back-link:hover {
    color: #1a1a1a;
  }

  @media (max-width: 900px) {
    .login-right { display: none; }
    .login-left { max-width: 100%; }
    .login-card { max-width: 480px; }
  }
`;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulate API delay or actual login
      await new Promise(resolve => setTimeout(resolve, 800));
      const res = await login(email, password);
      
      if (res.success) {
        navigate('/payment');
      }else {
        setError(res.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <style>{styles}</style>
      
      <div className="login-left">
        <div style={{ width: '100%', maxWidth: 440, margin: '0 auto' }}>
          <Link to="/" className="back-link">
            <ArrowLeft size={18} /> Back to Home
          </Link>
          
          <div className="login-card">
            <div className="login-header">
              <h1 className="login-title">Welcome Back</h1>
              <p className="login-subtitle">Sign in to access your dashboard</p>
            </div>

            {error && (
              <div className="error-msg">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input
                    type="email"
                    className="form-input"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
                <a href="#" style={{ color: '#557a8c', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Forgot Password?</a>
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? 'Signing In...' : <>Sign In <ArrowRight size={18} /></>}
              </button>
            </form>

            <div style={{ marginTop: 24, textAlign: 'center', fontSize: 14, color: '#64748b' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#557a8c', fontWeight: 700, textDecoration: 'none' }}>
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div style={{ textAlign: 'center', zIndex: 2, padding: 40 }}>
          <h2 style={{ fontFamily: 'Sora', fontSize: 42, fontWeight: 800, color: '#fff', marginBottom: 16 }}>
            QuickArt Admin
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, maxWidth: 400, margin: '0 auto', lineHeight: 1.6 }}>
            Manage your products, track orders, and analyze performance in one place.
          </p>
        </div>
      </div>
    </div>
  );
}