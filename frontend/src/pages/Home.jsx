// frontend/src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiPhone, FiLogOut, FiMessageCircle, FiUsers, FiBell, FiHome } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/login");
    }
    setLoading(false);
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/api/auth/logout", {}, {
        withCredentials: true
      });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[linear-gradient(135deg,#667eea 0%,#764ba2 100%)] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FiHome className="w-8 h-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-gray-800">Home</span>
            </div>
            
            <div className="flex items-center gap-4">
              <FiBell className="w-5 h-5 text-gray-500 cursor-pointer hover:text-blue-500" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="profile" className="w-8 h-8 rounded-full" />
                  ) : (
                    <FiUser className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.userName || "User"}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
              >
                <FiLogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Home, {user?.userName || "User"}! 🏠
          </h1>
          <p className="text-gray-600">
            This is your personal dashboard. You're successfully logged in.
          </p>
        </motion.div>

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Profile</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <FiUser className="w-6 h-6 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Username</p>
                <p className="font-medium text-gray-800">{user?.userName || "Not set"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <FiMail className="w-6 h-6 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800">{user?.email || "Not set"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <FiPhone className="w-6 h-6 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Contact</p>
                <p className="font-medium text-gray-800">{user?.contact || "Not set"}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <FiMessageCircle />, label: 'Messages' },
            { icon: <FiUsers />, label: 'Contacts' },
            { icon: <FiUser />, label: 'Profile' },
            { icon: <FiHome />, label: 'Settings' }
          ].map((item, index) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all flex flex-col items-center gap-2"
            >
              <div className="text-blue-500 text-2xl">{item.icon}</div>
              <span className="text-gray-700 font-medium">{item.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-8">
          © 2026 Your App Name. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Home;