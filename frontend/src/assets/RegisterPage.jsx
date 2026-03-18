import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone
} from "lucide-react";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [showPassword,setShowPassword] = useState(false);
  const [showConfirmPassword,setShowConfirmPassword] = useState(false);

  const [formData,setFormData] = useState({
    name:"",
    email:"",
    phone:"",
    password:"",
    confirmPassword:""
  });

  const [errors,setErrors] = useState({});

  const handleChange = (e)=>{
    const {name,value} = e.target;

    setFormData({
      ...formData,
      [name]:value
    });
  };

  const validate = ()=>{

    let newErrors={};

    if(!formData.name){
      newErrors.name="Full name required";
    }

    if(!formData.email){
      newErrors.email="Email required";
    }

    if(!formData.phone){
      newErrors.phone="Phone number required";
    }

    if(!formData.password){
      newErrors.password="Password required";
    }

    if(formData.password !== formData.confirmPassword){
      newErrors.confirmPassword="Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit= async (e)=>{

    e.preventDefault();

    const validationErrors = validate();

    if(Object.keys(validationErrors).length>0){
      setErrors(validationErrors);
    }else{
      try {
        alert("Account Created Successfully! Please log in.");
        navigate('/login');
      } catch (error) {
        setErrors({ form: error.message });
      }
    }

  };

  return (

    <div className="container">

      <div className="bg1"></div>
      <div className="bg2"></div>

      <div className="login-wrapper">

        {/* Logo Section */}
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


        {/* Card */}
        <div className="card">

          <h2>Create Account</h2>
          <p className="subtitle">Create your QuickCart account</p>

          <form onSubmit={handleSubmit}>

            {/* Full Name */}
            <div className="input-group">
              <label>Full Name</label>

              <div className="input-box">
                <User size={18} className="icon-left"/>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  onChange={handleChange}
                />
              </div>

              {errors.name && <p className="error">{errors.name}</p>}
            </div>


            {/* Email */}
            <div className="input-group">
              <label>Email</label>

              <div className="input-box">
                <Mail size={18} className="icon-left"/>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  onChange={handleChange}
                />
              </div>

              {errors.email && <p className="error">{errors.email}</p>}
            </div>


            {/* Phone */}
            <div className="input-group">
              <label>Phone Number</label>

              <div className="input-box">
                <Phone size={18} className="icon-left"/>
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter phone number"
                  onChange={handleChange}
                />
              </div>

              {errors.phone && <p className="error">{errors.phone}</p>}
            </div>


            {/* Password */}
            <div className="input-group">
              <label>Password</label>

              <div className="input-box">
                <Lock size={18} className="icon-left"/>

                <input
                  type={showPassword ? "text":"password"}
                  name="password"
                  placeholder="Enter password"
                  onChange={handleChange}
                />

                <button
                  type="button"
                  className="icon-right"
                  onClick={()=>setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>

              {errors.password && <p className="error">{errors.password}</p>}
            </div>


            {/* Confirm Password */}
            <div className="input-group">
              <label>Confirm Password</label>

              <div className="input-box">
                <Lock size={18} className="icon-left"/>

                <input
                  type={showConfirmPassword ? "text":"password"}
                  name="confirmPassword"
                  placeholder="Confirm password"
                  onChange={handleChange}
                />

                <button
                  type="button"
                  className="icon-right"
                  onClick={()=>setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>

              {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
            </div>

            {errors.form && <p className="error" style={{textAlign: 'center', marginTop: '10px'}}>{errors.form}</p>}


            <button className="login-btn">
              Create Account
            </button>

          </form>


          {/* Login Link */}
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