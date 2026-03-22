import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import "./assets/login.css";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Github,
  Chrome
} from "lucide-react";

export default function AdminLoginPage() {
  const [showPassword,setShowPassword] = useState(false);
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
    const result = await login(email, password); // Call the login function from AuthContext

    


    setLoading(false);
    if (result.success) {
      navigate('/payment');
    } else {

      setError(result.message || "Invalid email or password. Please try again.");
    }
  };
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e)=>{
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (

    <div className="container">


      <div className="bg1"></div>
      <div className="bg2"></div>

      <div className="login-wrapper">

        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo-box">
            <span style={{ fontSize: "24px" }}>⚡</span>
          </div>
          <div className="logo-text">QuickArt</div>
        </div>

        <p className="tagline">Smart. Fast. Reliable.</p>


        {/* Card */}
        <div className="card">

          <h2>Admin Login</h2>
          <p className="subtitle">Please enter your details to sign in.</p>

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="input-group">
              <label>Email Address</label>

              <div className="input-box">
                <Mail size={18} className="icon-left"/>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  onChange={(e) => { setEmail(e.target.value); handleChange(e) }}
                  required
                />
              </div>

              {error && <p className="error" style={{textAlign: 'center', marginTop: '10px'}}>{error}</p>}
            </div>


            {/* Password */}
            <div className="input-group">

              <div className="password-header">
                <label>Password</label>
                <a href="#">Forgot Password?</a>
              </div>

              <div className="input-box">
                <Lock size={18} className="icon-left"/>

                <input
                  type={showPassword ? "text":"password"}
                  name="password"
                  placeholder="••••••••"
                  onChange={(e) => { setPassword(e.target.value); handleChange(e) }}
                  required
                />

                <button
                  type="button"
                  className="icon-right"
                  onClick={()=>setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>

            </div>

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