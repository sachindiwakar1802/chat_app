// frontend/src/pages/Signup.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiUser } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import axios from '../config/axios'; // Use your axios config
import { auth, googleProvider, signInWithPopup } from "../config/firebase";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: '',
    name: '',
    email: '',
    contact: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.userName.trim()) {
      newErrors.userName = 'Username is required';
    } else if (formData.userName.length < 3) {
      newErrors.userName = 'Username must be at least 3 characters';
    }

    if (formData.name && formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contact)) {
      newErrors.contact = 'Contact must be 10 digits';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle email/password signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccess("");
    
    try {
      const response = await axios.post('/auth/signup', {
        userName: formData.userName,
        name: formData.name || undefined,
        email: formData.email,
        contact: parseInt(formData.contact),
        password: formData.password
      });

      if (response.status === 201) {
        setSuccess('Signup successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (error) {
      console.error('Signup error:', error);
      
      if (error.response) {
        const errorMessage = error.response.data.message;
        
        if (errorMessage.includes('username')) {
          setErrors(prev => ({ ...prev, userName: errorMessage }));
        } else if (errorMessage.includes('email')) {
          setErrors(prev => ({ ...prev, email: errorMessage }));
        } else if (errorMessage.includes('contact')) {
          setErrors(prev => ({ ...prev, contact: errorMessage }));
        } else if (errorMessage.includes('password')) {
          setErrors(prev => ({ ...prev, password: errorMessage }));
        } else {
          setErrors({ general: errorMessage });
        }
      } else if (error.code === 'ECONNABORTED') {
        setErrors({ general: "Connection timeout. Please try again." });
      } else {
        setErrors({ general: 'Server error. Please try again later.' });
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Signup
  const handleGoogleSignup = async () => {
    setErrors({});
    setLoading(true);
    setSuccess("");
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const baseUsername = user.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
      const generatedUsername = baseUsername + Math.floor(Math.random() * 1000);
      
      const response = await axios.post('/auth/google-auth', {
        email: user.email,
        userName: generatedUsername,
        name: user.displayName || user.email.split('@')[0],
        googleId: user.uid,
        image: user.photoURL || "",
        password: Math.random().toString(36).slice(-16) + user.uid.slice(-8)
      });
      
      if (response.status === 201 || response.status === 200) {
        setSuccess(response.data.message);
        
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
        
        setTimeout(() => {
          navigate('/chat');
        }, 1500);
      }
      
    } catch (error) {
      console.error("Google signup error:", error);
      
      if (error.response) {
        setErrors({ general: error.response.data.message });
      } else if (error.code === 'auth/popup-closed-by-user') {
        setErrors({ general: "Signup popup was closed. Please try again." });
      } else if (error.code === 'auth/popup-blocked') {
        setErrors({ general: "Popup was blocked. Please allow popups and try again." });
      } else {
        setErrors({ general: error.message || "Google signup failed" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#667eea 0%,#764ba2 100%)] flex items-center justify-center p-3">
      {/* Background blobs */}
      <div className="absolute w-48 h-48 bg-white/10 rounded-full blur-3xl -top-20 -right-20"></div>
      <div className="absolute w-48 h-48 bg-white/10 rounded-full blur-3xl -bottom-20 -left-20"></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-5 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
        
        {/* Header */}
        <div className="text-center mb-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mx-auto mb-2 flex items-center justify-center shadow-lg shadow-blue-500/30"
          >
            <FiUser className="w-6 h-6 text-white" />
          </motion.div>
          
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="text-gray-500 text-xs mt-0.5">Join our chat community</p>
        </div>

        {/* Messages */}
        {(errors.general || success) && (
          <div className="mb-2">
            {errors.general && (
              <div className="p-2 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs">
                {errors.general}
              </div>
            )}
            
            {success && (
              <div className="p-2 bg-green-50 border border-green-200 text-green-600 rounded-lg text-xs">
                {success}
              </div>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-2.5'>
          {/* Username */}
          <div>
            <div className='relative'>
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type='text'
                name='userName'
                value={formData.userName}
                onChange={handleChange}
                placeholder='Username *'
                className={`w-full pl-9 pr-3 py-2.5 bg-gray-50 border-2 rounded-lg focus:ring-3 outline-none transition text-sm ${
                  errors.userName 
                    ? 'border-red-200 focus:border-red-500 focus:ring-red-100' 
                    : 'border-gray-100 focus:border-blue-500 focus:ring-blue-100'
                }`}
                disabled={loading}
              />
            </div>
            {errors.userName && (
              <p className='text-red-500 text-[10px] mt-0.5 ml-1'>{errors.userName}</p>
            )}
          </div>

          {/* Full Name */}
          <div>
            <div className='relative'>
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                placeholder='Full Name (Optional)'
                className={`w-full pl-9 pr-3 py-2.5 bg-gray-50 border-2 rounded-lg focus:ring-3 outline-none transition text-sm ${
                  errors.name 
                    ? 'border-red-200 focus:border-red-500 focus:ring-red-100' 
                    : 'border-gray-100 focus:border-blue-500 focus:ring-blue-100'
                }`}
                disabled={loading}
              />
            </div>
            {errors.name && (
              <p className='text-red-500 text-[10px] mt-0.5 ml-1'>{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <div className='relative'>
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='Email *'
                className={`w-full pl-9 pr-3 py-2.5 bg-gray-50 border-2 rounded-lg focus:ring-3 outline-none transition text-sm ${
                  errors.email 
                    ? 'border-red-200 focus:border-red-500 focus:ring-red-100' 
                    : 'border-gray-100 focus:border-blue-500 focus:ring-blue-100'
                }`}
                disabled={loading}
              />
            </div>
            {errors.email && (
              <p className='text-red-500 text-[10px] mt-0.5 ml-1'>{errors.email}</p>
            )}
          </div>

          {/* Contact */}
          <div>
            <div className='relative'>
              <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type='tel'
                name='contact'
                value={formData.contact}
                onChange={handleChange}
                placeholder='Contact Number *'
                maxLength='10'
                className={`w-full pl-9 pr-3 py-2.5 bg-gray-50 border-2 rounded-lg focus:ring-3 outline-none transition text-sm ${
                  errors.contact 
                    ? 'border-red-200 focus:border-red-500 focus:ring-red-100' 
                    : 'border-gray-100 focus:border-blue-500 focus:ring-blue-100'
                }`}
                disabled={loading}
              />
            </div>
            {errors.contact && (
              <p className='text-red-500 text-[10px] mt-0.5 ml-1'>{errors.contact}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className='relative'>
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type={showPassword ? 'text' : 'password'}
                name='password'
                value={formData.password}
                onChange={handleChange}
                placeholder='Password *'
                className={`w-full pl-9 pr-9 py-2.5 bg-gray-50 border-2 rounded-lg focus:ring-3 outline-none transition text-sm ${
                  errors.password 
                    ? 'border-red-200 focus:border-red-500 focus:ring-red-100' 
                    : 'border-gray-100 focus:border-blue-500 focus:ring-blue-100'
                }`}
                disabled={loading}
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className='text-red-500 text-[10px] mt-0.5 ml-1'>{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <div className='relative'>
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name='confirmPassword'
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder='Confirm Password *'
                className={`w-full pl-9 pr-9 py-2.5 bg-gray-50 border-2 rounded-lg focus:ring-3 outline-none transition text-sm ${
                  errors.confirmPassword 
                    ? 'border-red-200 focus:border-red-500 focus:ring-red-100' 
                    : 'border-gray-100 focus:border-blue-500 focus:ring-blue-100'
                }`}
                disabled={loading}
              />
              <button
                type='button'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className='text-red-500 text-[10px] mt-0.5 ml-1'>{errors.confirmPassword}</p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-center gap-1.5 text-[11px]">
            <input type="checkbox" className="w-3.5 h-3.5 text-blue-500 rounded border-gray-300" required />
            <span className="text-gray-600">
              I agree to the <a href="/terms" className="text-blue-500 font-medium hover:text-blue-600">Terms</a> and <a href="/privacy" className="text-blue-500 font-medium hover:text-blue-600">Privacy</a>
            </span>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.99 }}
            type='submit'
            disabled={loading}
            className='w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2.5 rounded-lg font-semibold text-sm shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed'
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-[10px]">
            <span className="px-2 bg-white text-gray-400">or</span>
          </div>
        </div>

        {/* Google Signup Button */}
        <motion.button
          whileHover={{ scale: loading ? 1 : 1.01 }}
          whileTap={{ scale: loading ? 1 : 0.99 }}
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full py-2.5 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          <FcGoogle className="w-4 h-4" />
          <span className="text-gray-700 font-medium">
            {loading ? "Processing..." : "Continue with Google"}
          </span>
        </motion.button>

        {/* Login Link */}
        <p className="text-center text-[11px] text-gray-600 mt-3">
          Already have an account?{' '}
          <Link to='/login' className="text-blue-500 font-semibold hover:text-blue-600">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;  