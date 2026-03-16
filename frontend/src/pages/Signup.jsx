import React from "react";
import { motion } from "framer-motion";

const Singup = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center">
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm bg-white rounded-xl shadow-lg p-6 flex flex-col gap-6"
      >
        
        <h1 className="text-gray-700 font-bold text-2xl text-center">
          Welcome to <span className="text-blue-500">MyApp</span>
        </h1>

        <form className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Full Name"
            className="border p-2 rounded-md focus:outline-none focus:border-blue-500"
          />

          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded-md focus:outline-none focus:border-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded-md focus:outline-none focus:border-blue-500"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-500 text-white p-2 rounded-md"
          >
            Create Account
          </motion.button>

        </form>

      </motion.div>

    </div>
  );
};

export default Singup;