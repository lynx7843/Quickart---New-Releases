import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../login.css";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Github, Chrome } from "lucide-react";
import Footer from "./Footer.jsx";
import { useAuth } from "../AuthContext.jsx";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message || "Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="container">

      <div className="bg1"></div>
      <div className="bg2"></div>

      <div className="login-wrapper">

        {/* Logo */}
        <div className="logo-section">
          <div className="logo-box">
            <span style={{ fontSize: "24px" }}>⚡</span>
          </div>
          <div className="logo-text">QuickArt</div>
        </div>

        <p className="tagline">Smart. Fast. Reliable.</p>

        {/* Card */}
        <div className="card">

          <h2>Welcome Back</h2>
          <p className="subtitle">Please enter your details to sign in.</p>

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="input-group">
              <label>Email Address</label>

              <div className="input-box">
                <Mail size={18} className="icon-left" />
                <input type="email" placeholder="name@quickcart.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>

            {/* Password */}
            <div className="input-group">

              <div className="password-header">
                <label>Password</label>
                <a href="#">Forgot Password?</a>
              </div>

              <div className="input-box">
                <Lock size={18} className="icon-left" />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="icon-right"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

            </div>
            
            {error && <p className="error" style={{textAlign: 'center', marginTop: '10px'}}>{error}</p>}

            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "Signing In..." : <>Sign In <ArrowRight size={18} /></>}
            </button>

          </form>

          {/* Divider */}
          <div className="divider">
            <span>Or continue with</span>
          </div>

          {/* Social Login */}
          <div className="social">

            <button className="social-btn">
              <Chrome size={16} /> Google
            </button>

            <button className="social-btn">
              <Github size={16} /> Github
            </button>

          </div>

          {/* Create Account */}
          <div className="signup">
            Don't have an account?
            <Link to="/register"> Create an Account</Link>
          </div>

        </div>

      </div>
      
    </div>
  );
};

export default LoginPage;