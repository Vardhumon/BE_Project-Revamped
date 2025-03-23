import React, { useState, useMemo } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const BackgroundAnimation = () => {
  return (
    <>
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 0.7, scale: 1, y: -50 }}
          transition={{ duration: 6, repeat: Infinity, repeatType: "mirror", delay: i * 0.8 }}
          className="absolute bg-white rounded-full blur-3xl"
          style={{
            width: `${30 + i * 30}px`,
            height: `${30 + i * 30}px`,
            top: `${Math.random() * 100}%`,
            left: `${50 + Math.random() * 50}%`,
            opacity: 0.3,
          }}
        />
      ))}
    </>
  );
};

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/login", formData);
      onLogin(response.data.token, response.data.user);
    localStorage.setItem("isVisited", "true");

      setTimeout(() => {
        navigate('/');
      }, 100);
    } catch (err) {
      console.error("Login failed:", err.response?.data?.message || "Server error");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex h-screen w-screen bg-black text-white"
    >
      {/* Left Section - Form */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-4/5 p-10 flex flex-col items-center justify-center"
      >
        <div className="w-3/5">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-4xl font-semibold mb-10"
          >
            Login
          </motion.h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.input
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="w-3/4 p-3 bg-white/10 border border-white/30 rounded-lg focus:ring-4 focus:ring-white text-lg"
              required
            />
            <motion.input
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-3/4 p-3 bg-white/10 border border-white/30 rounded-lg focus:ring-4 focus:ring-white text-lg"
              required
            />
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col items-start gap-4"
            >
              <button
                type="submit"
                className="w-1/3 bg-white text-black py-3 text-xl rounded-lg font-semibold
                  transform transition-all duration-300 ease-in-out
                  hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.8)]
                  active:scale-95 active:bg-gray-200"
              >
                Login
              </button>
              <p className="text-gray-400">
                Don't have an account? {" "}
                <button 
                  onClick={() => navigate("/signup")} 
                  className="text-white hover:underline"
                >
                  Sign up here
                </button>
              </p>
            </motion.div>
          </form>
        </div>
      </motion.div>

      {/* Right Section - Animation */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="w-1/5 flex justify-center items-center relative overflow-hidden"
      >
        <BackgroundAnimation />
      </motion.div>
    </motion.div>
  );
};

export default Login;
