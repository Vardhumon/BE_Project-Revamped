import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const techOptions = [
  "React", "Node.js", "MongoDB", "Express", "Python", "Java", "Machine Learning",
  "Django", "Vue.js", "Angular", "Ruby on Rails", "Flutter", "Go", "C++", "Swift",
];

const experienceLevels = ["Beginner", "Intermediate", "Expert"];

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", techStack: [], experienceLevel: "",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleTechChange = (tech) => setFormData((prev) => ({
    ...prev,
    techStack: prev.techStack.includes(tech)
      ? prev.techStack.filter((t) => t !== tech)
      : [...prev.techStack, tech],
  }));
  const handleExperienceChange = (level) => setFormData({ ...formData, experienceLevel: level });

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/api/signup", {
        ...formData,
        techStack: formData.techStack.join(", "),
      });
      navigate("/login");
    } catch (err) {
      console.error("Signup failed:", err.response?.data?.message || "Server error");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex h-screen w-screen bg-black text-white mt-10"
    >
      {/* Left Section - Form */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-4/5 p-10 overflow-y-auto flex flex-col items-center overflow-y-hidden"
      >
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-3/5"
        >
          <h2 className="text-4xl font-semibold mb-6">Sign Up</h2>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="space-y-5 w-3/5"
        >
          {/* Name */}
          <motion.input 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} className="w-3/4 p-3 bg-white/10 border border-white/30 rounded-lg focus:ring-4 focus:ring-white text-lg" 
          />
          {/* Email */}
          <motion.input 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} className="w-3/4 p-3 bg-white/10 border border-white/30 rounded-lg focus:ring-4 focus:ring-white text-lg" 
          />
          {/* Password */}
          <motion.input 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            type="password" name="password" placeholder="Create Password" value={formData.password} onChange={handleChange} className="w-3/4 p-3 bg-white/10 border border-white/30 rounded-lg focus:ring-4 focus:ring-white text-lg" 
          />
          {/* Tech Stack */}
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="text-xl font-semibold mb-6"
          >
            Tech Stack
          </motion.h3>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="flex flex-wrap gap-2"
          >
            {techOptions.map((tech) => (
              <button key={tech} onClick={() => handleTechChange(tech)} className={`px-4 py-2 rounded-lg border transition duration-300 text-lg ${formData.techStack.includes(tech) ? "bg-white text-black" : "bg-black text-white border-white hover:bg-white hover:text-black"}`}>
                {tech}
              </button>
            ))}
          </motion.div>
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            className="text-xl font-semibold mb-6"
          >
            Experience Level
          </motion.h3>
          {/* Experience Level */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="flex gap-4"
          >
            {experienceLevels.map((level) => (
              <button key={level} onClick={() => handleExperienceChange(level)} className={`px-6 py-3 text-lg border rounded-lg transition duration-300 ${formData.experienceLevel === level ? "bg-white text-black" : "bg-black text-white border-white hover:bg-white hover:text-black"}`}>
                {level}
              </button>
            ))}
          </motion.div>
          {/* Submit Button */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.3 }}
            className="flex items-center gap-4"
          >
            <motion.button
              onClick={handleSubmit}
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(255, 255, 255, 0.8)" }}
              whileTap={{ scale: 0.95 }}
              className="w-1/3 bg-white text-black hover:bg-gray-300 transition py-3 text-xl rounded-lg font-semibold self-center"
            >
              Sign Up
            </motion.button>
            <p className="mt-6 text-gray-400">Already registered? <button onClick={() => navigate("/login")} className="text-white hover:underline">Login here</button></p>
          </motion.div>
        </motion.div>
        <div className="w-3/5 mb-6"></div>
      </motion.div>

      {/* Right Section - Animation */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="w-1/5 flex justify-center items-center relative overflow-hidden"
      >
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
      </motion.div>
    </motion.div>
  );
};

export default Signup;