import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Choices() {
  const navigate = useNavigate();
  const [selectedTech, setSelectedTech] = useState([]);
  const [experience, setExperience] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  
  const techCategories = {
    "Frontend": ["React", "Next.js", "Flutter"],
    "Backend": ["Node.js", "Django", "Flask", "Firebase","MongoDB"],
    "Data & ML": ["Python", "NLTK", "TensorFlow", "ML"],
    "Other": ["DevOps"]
  };

  const categories = [
    "Full-Stack",
    "Machine Learning",
    "WEB3",
    "DevOps",
    "Full-Stack + ML"
  ];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const techstack = JSON.parse(localStorage.getItem("techStack")) || user.techStack || [];
    const experienceLevel = user.experienceLevel || localStorage.getItem("experience") || "";
    const savedCategories = JSON.parse(localStorage.getItem("selectedCategories")) || "Full-Stack";
    
    const separatedTech = Array.isArray(techstack) 
      ? techstack.flatMap(tech => tech.split(", ").map(t => t.trim()))
      : [];
    
    setSelectedTech(separatedTech);
    setExperience(experienceLevel);
    setSelectedCategories(savedCategories);
  }, []);

  const handleTechSelect = (tech) => {
    let updatedStack;
    if (selectedTech.includes(tech)) {
      updatedStack = selectedTech.filter(t => t !== tech);
    } else {
      updatedStack = [...selectedTech, tech];
    }
    setSelectedTech(updatedStack);
    localStorage.setItem("techStack", JSON.stringify(updatedStack));
  };

  const handleExperienceSelect = (level) => {
    setExperience(level);
    localStorage.setItem("experience", level);
  };

  const handleNext = () => {
    if (selectedTech.length === 0 || experience === "" || selectedCategories.length === 0) {
      alert("Please select at least one technology, category, and experience level!");
      return;
    }
    navigate("/create-project");
  };

  const handleCategorySelect = (category) => {
    if (selectedCategories === category) {
      return;
    }
    setSelectedCategories(category);
    localStorage.setItem("selectedCategories", JSON.stringify(category));
  };

  return (
    <div className="min-h-screen bg-black pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#00ff9d]">
          Customize Your Development Journey
        </h1>

        {/* Tech Stack Selection */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-[#00ff9d]">Selected Technologies</h2>
          <div className="flex flex-wrap gap-3 mb-8">
            {selectedTech.map((tech, index) => (
              <span
                key={index}
                onClick={() => handleTechSelect(tech)}
                className="px-4 py-2 bg-black border border-[#00ff9d] text-[#00ff9d] rounded-lg cursor-pointer hover:bg-[#00ff9d]/10 transition-all duration-300 flex items-center gap-2"
              >
                {tech}
                <span className="text-sm">×</span>
              </span>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(techCategories).map(([category, techs]) => (
              <div key={category} className="p-6 border border-white/10 rounded-xl bg-black/50 backdrop-blur-xl">
                <h3 className="text-lg font-medium text-white mb-4">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {techs.map((tech) => (
                    !selectedTech.includes(tech) && (
                      <button
                        key={tech}
                        onClick={() => handleTechSelect(tech)}
                        className="px-3 py-1.5 border border-white/10 rounded-lg text-gray-300 hover:border-[#00ff9d] hover:text-[#00ff9d] transition-all duration-300"
                      >
                        {tech}
                      </button>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Level */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-[#00ff9d]">Experience Level</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {["Beginner", "Intermediate", "Advanced"].map((level) => (
              <button
                key={level}
                onClick={() => handleExperienceSelect(level)}
                className={`px-8 py-3 rounded-lg transition-all duration-300 ${
                  experience === level
                    ? "bg-[#00ff9d] text-black"
                    : "border border-white/10 text-gray-300 hover:border-[#00ff9d] hover:text-[#00ff9d]"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-[#00ff9d]">Project Category</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                  selectedCategories === category
                    ? "bg-[#00ff9d] text-black"
                    : "border border-white/10 text-gray-300 hover:border-[#00ff9d] hover:text-[#00ff9d]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <button
            onClick={handleNext}
            className="px-12 py-4 bg-black border-2 border-[#00ff9d] text-[#00ff9d] rounded-lg hover:bg-[#00ff9d] hover:text-black transition-all duration-300 text-lg font-medium"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}