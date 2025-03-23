import React, { useState } from "react";
import { motion } from "framer-motion";

const FinalForm = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    techStack: []
  });

  const techOptions = [
    "React", "Node.js", "Python", "JavaScript", "TypeScript",
    "Java", "C++", "Go", "Ruby", "PHP", "Swift"
  ];

  const handleTechToggle = (tech) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.includes(tech)
        ? prev.techStack.filter(t => t !== tech)
        : [...prev.techStack, tech]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800"
    >
      <h2 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
        Let's Personalize Your Experience
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-300 mb-2">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-300 mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Select Your Tech Stack</label>
          <div className="flex flex-wrap gap-2">
            {techOptions.map(tech => (
              <button
                key={tech}
                type="button"
                onClick={() => handleTechToggle(tech)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  formData.techStack.includes(tech)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-colors text-white font-semibold"
        >
          Get Started
        </button>
      </form>
    </motion.div>
  );
};

export default FinalForm;