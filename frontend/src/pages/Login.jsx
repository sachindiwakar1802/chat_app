// frontend/src/pages/Login.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiChevronDown } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider, signInWithPopup } from "../config/firebase";
import axios from "../config/axios";

// Country codes data
const countryCodes = [
  { code: "+1", country: "US", flag: "🇺🇸", name: "United States" },
  { code: "+44", country: "GB", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+91", country: "IN", flag: "🇮🇳", name: "India" },
  { code: "+61", country: "AU", flag: "🇦🇺", name: "Australia" },
  { code: "+86", country: "CN", flag: "🇨🇳", name: "China" },
  { code: "+81", country: "JP", flag: "🇯🇵", name: "Japan" },
  { code: "+49", country: "DE", flag: "🇩🇪", name: "Germany" },
  { code: "+33", country: "FR", flag: "🇫🇷", name: "France" },
  { code: "+39", country: "IT", flag: "🇮🇹", name: "Italy" },
  { code: "+7", country: "RU", flag: "🇷🇺", name: "Russia" },
  { code: "+55", country: "BR", flag: "🇧🇷", name: "Brazil" },
  { code: "+52", country: "MX", flag: "🇲🇽", name: "Mexico" },
  { code: "+82", country: "KR", flag: "🇰🇷", name: "South Korea" },
  { code: "+34", country: "ES", flag: "🇪🇸", name: "Spain" },
  { code: "+971", country: "AE", flag: "🇦🇪", name: "UAE" },
  { code: "+966", country: "SA", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+65", country: "SG", flag: "🇸🇬", name: "Singapore" },
  { code: "+60", country: "MY", flag: "🇲🇾", name: "Malaysia" },
  { code: "+64", country: "NZ", flag: "🇳🇿", name: "New Zealand" },
  { code: "+27", country: "ZA", flag: "🇿🇦", name: "South Africa" },
];

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countryCodes.find(c => c.code === "+1") || countryCodes[0]);
  
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    phoneNumber: "",
    countryCode: "+1"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    setFormData({
      ...formData,
      phoneNumber: value,
      identifier: selectedCountry.code + value // Combine country code and phone number
    });
    setError("");
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setFormData({
      ...formData,
      countryCode: country.code,
      identifier: country.code + formData.phoneNumber // Update identifier with new country code
    });
    setShowCountryDropdown(false);
    setError("");
  };

  const validateForm = () => {
    if (loginMethod === "email") {
      if (!formData.identifier.trim()) {
        setError("Email is required");
        return false;
      }
      if (!/\S+@\S+\.\S+/.test(formData.identifier)) {
        setError("Please enter a valid email");
        return false;
      }
    } else {
      if (!formData.phoneNumber) {
        setError("Phone number is required");
        return false;
      }
      if (formData.phoneNumber.length < 10) {
        setError("Please enter a valid phone number (at least 10 digits)");
        return false;
      }
    }
    
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const loginData = {
        password: formData.password
      };
      
      if (loginMethod === "email") {
        loginData.email = formData.identifier;
      } else {
        loginData.contact = formData.identifier; // This will include country code + phone number
      }
      
      const response = await axios.post("/auth/login", loginData);
      
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      
      setSuccess("Login successful! Redirecting...");
      
      setTimeout(() => {
        navigate("/home");
      }, 1500);
      
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const baseUsername = user.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
      const generatedUsername = baseUsername + Math.floor(Math.random() * 1000);
      
      const response = await axios.post("/auth/google-auth", {
        email: user.email,
        userName: generatedUsername,
        name: user.displayName || user.email.split('@')[0],
        googleId: user.uid,
        image: user.photoURL || "",
        password: Math.random().toString(36).slice(-16) + user.uid.slice(-8)
      });
      
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      
      setSuccess("Google login successful! Redirecting...");
      
      setTimeout(() => {
        navigate("/home");
      }, 1500);
      
    } catch (error) {
      console.error("Google login error:", error);
      
      if (error.response) {
        setError(error.response.data.message || "Google login failed");
      } else if (error.code === 'auth/popup-closed-by-user') {
        setError("Login popup was closed. Please try again.");
      } else if (error.code === 'auth/popup-blocked') {
        setError("Popup was blocked. Please allow popups and try again.");
      } else {
        setError(error.message || "Google login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setShowCountryDropdown(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#667eea 0%,#764ba2 100%)] flex items-center justify-center p-4">
      {/* Background blobs */}
      <div className="absolute w-64 h-64 bg-white/10 rounded-full blur-3xl -top-20 -right-20"></div>
      <div className="absolute w-64 h-64 bg-white/10 rounded-full blur-3xl -bottom-20 -left-20"></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
        
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-500/30"
          >
            <FiLock className="w-8 h-8 text-white" />
          </motion.div>
          
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
            {success}
          </div>
        )}

        {/* Login Method Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => {
              setLoginMethod("email");
              setFormData({ ...formData, identifier: "" });
              setError("");
            }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              loginMethod === "email"
                ? "bg-white text-blue-500 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
            disabled={loading}
          >
            <FiMail className="w-4 h-4" />
            Email
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMethod("phone");
              setFormData({ ...formData, identifier: "", phoneNumber: "" });
              setError("");
            }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              loginMethod === "phone"
                ? "bg-white text-blue-500 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
            disabled={loading}
          >
            <FiPhone className="w-4 h-4" />
            Phone
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {loginMethod === "email" ? (
            // Email Input
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                placeholder="Email address"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
                disabled={loading}
              />
            </div>
          ) : (
            // Phone Input with Country Code
            <div className="relative">
              <FiPhone className="absolute left-32 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
              
              {/* Country Code Dropdown */}
              <div className="absolute left-0 top-0 h-full">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCountryDropdown(!showCountryDropdown);
                  }}
                  className="h-full px-3 bg-gray-100 border-2 border-gray-100 rounded-l-xl hover:bg-gray-200 transition flex items-center gap-1 text-sm font-medium"
                >
                  <span className="text-lg">{selectedCountry.flag}</span>
                  <span className="text-gray-700">{selectedCountry.code}</span>
                  <FiChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Country Dropdown Menu */}
                {showCountryDropdown && (
                  <div 
                    className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {countryCodes.map((country) => (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => handleCountrySelect(country)}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 ${
                          selectedCountry.code === country.code ? 'bg-blue-50 text-blue-600' : ''
                        }`}
                      >
                        <span className="text-lg">{country.flag}</span>
                        <span className="font-medium">{country.code}</span>
                        <span className="text-sm text-gray-600">{country.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Phone Number Input */}
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handlePhoneNumberChange}
                placeholder="Phone number"
                className="w-full pl-32 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
                disabled={loading}
              />
            </div>
          )}

          {/* Password Input */}
          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full pl-12 pr-12 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 text-blue-500 rounded border-gray-300" />
              <span className="text-gray-600">Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => window.location.href = "/forgot-password"}
              className="text-blue-500 font-medium hover:text-blue-600"
            >
              Forgot password?
            </button>
          </div>

          <motion.button
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </motion.button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3 border-2 border-gray-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FcGoogle className="w-5 h-5" />
          <span className="text-gray-700 font-medium">
            {loading ? "Processing..." : "Continue with Google"}
          </span>
        </button>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 font-semibold hover:text-blue-600">
            Sign up free
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;