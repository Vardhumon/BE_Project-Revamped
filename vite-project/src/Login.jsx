import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

const BackgroundAnimation = () => {
  return (
    <div className="relative w-full h-full">
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ 
            opacity: [0.3, 0.6, 0.3], 
            scale: [1, 1.2, 1],
            y: [-50, 50, -50] 
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            repeatType: "reverse", 
            delay: i * 0.5,
            ease: "easeInOut"
          }}
          className="absolute bg-gradient-to-br from-[#00ff9d] to-[#00ff9d]/30 rounded-full blur-3xl"
          style={{
            width: `${40 + i * 20}px`,
            height: `${40 + i * 20}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: 0.2,
          }}
        />
      ))}
    </div>
  );
};

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setError("");
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/login", formData);
      onLogin(response.data.token, response.data.user);
      localStorage.setItem("isVisited", "true");
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-black text-white flex overflow-x-hidden overflow-y-hidden"
    >
      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#00ff9d]">
            Welcome Back
          </h1>
          <p className="text-gray-400 mb-8">Please enter your details to continue</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d] transition-colors"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d] transition-colors"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#00ff9d] text-black rounded-xl font-medium
                flex items-center justify-center gap-2 
                hover:bg-[#00ff9d]/90 transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-sm">
              <button 
                type="button"
                onClick={() => navigate("/signup")}
                className="text-[#00ff9d] hover:text-[#00ff9d]/80 transition-colors flex items-center gap-1"
              >
                Create account
                <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                type="button"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Forgot password?
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Animation Section */}
      <div className="hidden lg:block w-1/3 relative">
        <div className="absolute inset-0">
          <BackgroundAnimation />
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
