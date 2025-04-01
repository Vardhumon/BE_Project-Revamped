import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { User, Mail, Lock, Code2, Award, ArrowLeft } from 'lucide-react';

const techOptions = [
  "React", "Node.js", "MongoDB", "Express", "Python", "Java", "Machine Learning",
  "Django", "Vue.js", "Angular", "Ruby on Rails", "Flutter", "Go", "C++", "Swift",
];

const experienceLevels = ["Beginner", "Intermediate", "Expert"];

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "", 
    email: "", 
    password: "", 
    techStack: [], 
    experienceLevel: "",
  });

  const handleChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTechChange = (tech) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.includes(tech)
        ? prev.techStack.filter((t) => t !== tech)
        : [...prev.techStack, tech],
    }));
  };

  const handleExperienceChange = (level) => {
    setFormData({ ...formData, experienceLevel: level });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.techStack.length === 0) {
      setError("Please select at least one technology");
      return;
    }

    if (!formData.experienceLevel) {
      setError("Please select your experience level");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:5000/api/signup", {
        ...formData,
        techStack: formData.techStack.join(", "),
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20 px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto"
      >
        <div className=" rounded-2xl border border-white/10 p-8 backdrop-blur-xl">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <button 
              onClick={() => navigate("/login")}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-[#00ff9d]" />
            </button>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#00ff9d]">
              Create Account
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d] transition-colors"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d] transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d] transition-colors"
                      placeholder="Create a password"
                    />
                  </div>
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-[#00ff9d]" />
                  <h3 className="text-lg font-medium text-white">Experience Level</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {experienceLevels.map((level) => (
                    <button
                      key={level}
                      onClick={() => handleExperienceChange(level)}
                      className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
                        formData.experienceLevel === level
                          ? "bg-[#00ff9d] text-black border-[#00ff9d]"
                          : "border-white/10 hover:border-[#00ff9d]/50"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Tech Stack Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Code2 className="w-5 h-5 text-[#00ff9d]" />
                <h3 className="text-lg font-medium text-white">Select Your Tech Stack</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {techOptions.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => handleTechChange(tech)}
                    className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
                      formData.techStack.includes(tech)
                        ? "bg-[#00ff9d] text-black border-[#00ff9d]"
                        : "border-white/10 hover:border-[#00ff9d]/50"
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 mt-6"
            >
              {error}
            </motion.p>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex items-center gap-4"
          >
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-8 py-3 bg-[#00ff9d] text-black rounded-xl font-medium hover:bg-[#00ff9d]/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>
            <p className="text-gray-400">
              Already have an account?{" "}
              <button 
                onClick={() => navigate("/login")}
                className="text-[#00ff9d] hover:text-[#00ff9d]/80 transition-colors"
              >
                Sign in
              </button>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;