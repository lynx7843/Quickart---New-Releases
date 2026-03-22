import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import "./login.css";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  ShoppingBag,
  Store,
  ShieldCheck
} from "lucide-react";

const ADMIN_EMAIL = "quickart_admin@gmail.com";

const roleStyles = `
  .role-toggle {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }
  .role-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 11px;
    border: 2px solid #ddd;
    border-radius: 8px;
    background: #fafafa;
    font-family: Arial, sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #888;
    cursor: pointer;
    transition: all 0.2s;
  }
  .role-btn.active {
    border-color: #250902;
    background: #fff8f7;
    color: #250902;
  }
  .role-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .role-badge {
    display: inline-block;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.5px;
    padding: 2px 8px;
    border-radius: 20px;
    margin-left: 4px;
  }
  .role-badge.customer { background: #e8f5e9; color: #2e7d32; }
  .role-badge.seller   { background: #fff3e0; color: #e65100; }
  .role-badge.admin    { background: #e3f2fd; color: #1565c0; }
  .role-info {
    font-size: 12px;
    color: #888;
    background: #f5f5f5;
    border-radius: 7px;
    padding: 10px 14px;
    margin-bottom: 20px;
    border-left: 3px solid #250902;
    line-height: 1.5;
  }
  .role-info.admin-info {
    background: #e3f2fd;
    border-left-color: #1565c0;
    color: #1565c0;
  }
  .admin-detected {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #e3f2fd;
    border: 1px solid #90caf9;
    color: #1565c0;
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 16px;
  }
`;

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [showPassword, setShowPassword]               = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading]                         = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "CUSTOMER",
    storeName: "",
  });

  const [errors, setErrors] = useState({});

  const isAdmin  = formData.email.trim().toLowerCase() === ADMIN_EMAIL;
  const isSeller = formData.role === "SELLER" && !isAdmin;

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };

    // Auto-detect admin email and lock role to ADMIN
    if (name === "email") {
      const isAdminEmail = value.trim().toLowerCase() === ADMIN_EMAIL;
      if (isAdminEmail) {
        updated.role = "ADMIN";
      } else if (formData.role === "ADMIN") {
        updated.role = "CUSTOMER";
      }
    }

    setFormData(updated);
  };

  const setRole = (role) => {
    if (isAdmin) return; // lock role for admin email
    setFormData({ ...formData, role });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.name)     newErrors.name     = "Full name required";
    if (!formData.email)    newErrors.email    = "Email required";
    if (!formData.phone)    newErrors.phone    = "Phone number required";
    if (!formData.password) newErrors.password = "Password required";
    if (isSeller && !formData.storeName)
                            newErrors.storeName = "Store name required";
    if (formData.password !== formData.confirmPassword)
                            newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    const result = await register(
      formData.name,
      formData.email,
      formData.phone,
      formData.password,
      formData.confirmPassword,
      formData.role
    );
    setLoading(false);

    if (result.success) {
      const label = isAdmin ? "Admin" : isSeller ? "Seller" : "Customer";
      alert(`${label} account created successfully! Please log in.`);
      navigate("/login");
    } else {
      setErrors({ form: result.message || "Registration failed. The email might already be in use." });
    }
  };

  return (
    <div className="container">
      <style>{roleStyles}</style>

      <div className="bg1"></div>
      <div className="bg2"></div>

      <div className="login-wrapper">

        {/* Logo */}
        <div className="logo-section">
          <div className="logo-container">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">
              <span className="logo-quick">QUICK</span>
              <span className="logo-cart">🛒</span>
              <span className="logo-art">ART</span>
            </span>
          </div>
        </div>
        <p className="tagline">Smart. Fast. Reliable.</p>

        <div className="card">
          <h2>Create Account</h2>
          <p className="subtitle">Join QuickArt as a buyer, seller, or admin</p>

          {/* Admin detected banner */}
          {isAdmin && (
            <div className="admin-detected">
              <ShieldCheck size={16} />
              Admin account detected — role set to ADMIN automatically
            </div>
          )}

          {/* Role Toggle — hidden when admin email is entered */}
          {!isAdmin && (
            <>
              <div className="role-toggle">
                <button
                  type="button"
                  className={`role-btn ${formData.role === "CUSTOMER" ? "active" : ""}`}
                  onClick={() => setRole("CUSTOMER")}
                >
                  <ShoppingBag size={16} />
                  Customer
                  <span className="role-badge customer">Buyer</span>
                </button>
                <button
                  type="button"
                  className={`role-btn ${formData.role === "SELLER" ? "active" : ""}`}
                  onClick={() => setRole("SELLER")}
                >
                  <Store size={16} />
                  Seller
                  <span className="role-badge seller">Merchant</span>
                </button>
              </div>

              <div className="role-info">
                {formData.role === "CUSTOMER"
                  ? "🛍️ As a Customer you can browse, buy, use AI try-on, and track orders."
                  : "🏪 As a Seller you can list products, manage inventory, and view sales."}
              </div>
            </>
          )}

          {isAdmin && (
            <div className="role-info admin-info">
              🛡️ As an Admin you have full access to the Store Management Dashboard.
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Full Name */}
            <div className="input-group">
              <label>Full Name</label>
              <div className="input-box">
                <User size={18} className="icon-left" />
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.name && <p className="error">{errors.name}</p>}
            </div>

            {/* Store Name — sellers only */}
            {isSeller && (
              <div className="input-group">
                <label>Store Name</label>
                <div className="input-box">
                  <Store size={18} className="icon-left" />
                  <input
                    type="text"
                    name="storeName"
                    placeholder="Enter your store name"
                    onChange={handleChange}
                  />
                </div>
                {errors.storeName && <p className="error">{errors.storeName}</p>}
              </div>
            )}

            {/* Email */}
            <div className="input-group">
              <label>Email</label>
              <div className="input-box">
                <Mail size={18} className="icon-left" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.email && <p className="error">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="input-group">
              <label>Phone Number</label>
              <div className="input-box">
                <Phone size={18} className="icon-left" />
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter phone number"
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.phone && <p className="error">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div className="input-group">
              <label>Password</label>
              <div className="input-box">
                <Lock size={18} className="icon-left" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  onChange={handleChange}
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
              {errors.password && <p className="error">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="input-group">
              <label>Confirm Password</label>
              <div className="input-box">
                <Lock size={18} className="icon-left" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm password"
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="icon-right"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
            </div>

            {errors.form && (
              <p className="error" style={{ textAlign: "center", marginTop: 10 }}>
                {errors.form}
              </p>
            )}

            <button className="login-btn" type="submit" disabled={loading}>
              {loading
                ? "Creating Account..."
                : `Create ${isAdmin ? "Admin" : isSeller ? "Seller" : "Customer"} Account`}
            </button>

          </form>

          <div className="signup">
            Already have an account?
            <Link to="/login"> Login</Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;