import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

export default function Choices() {
  const navigate = useNavigate();
  const [selectedTech, setSelectedTech] = useState([]);
  const [experience, setExperience] = useState("");
  
  // Refs for GSAP animations
  const titleRef = useRef(null);
  const cardContainerRef = useRef(null);
  const experienceRef = useRef(null);
  const nextButtonRef = useRef(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  
  // All Available Tech Stacks with categories
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


  // Flatten tech stacks for easier handling
  const allTechStack = Object.values(techCategories).flat();

  // Load Previously Selected Tech Stack (if exists)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const techstack = JSON.parse(localStorage.getItem("techStack")) || user.techStack || [];
    const experienceLevel = user.experienceLevel || localStorage.getItem("experience") || "";
    const savedCategories = JSON.parse(localStorage.getItem("selectedCategories")) || "Full-Stack";
    // Ensure proper separation of multiple tech stacks
    const separatedTech = Array.isArray(techstack) 
      ? techstack.flatMap(tech => tech.split(", ").map(t => t.trim()))
      : [];
    
    setSelectedTech(separatedTech);
    setExperience(experienceLevel);
    setSelectedCategories(savedCategories);
    
    // Initial GSAP animations
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
    );
    
    gsap.fromTo(
      cardContainerRef.current.children,
      { opacity: 0, y: 20, scale: 0.9 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 0.8,
        stagger: 0.05,
        ease: "back.out(1.7)" 
      }
    );
    
    gsap.fromTo(
      experienceRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, delay: 0.6, ease: "power3.out" }
    );
    
    gsap.fromTo(
      nextButtonRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, delay: 0.8, ease: "power3.out" }
    );
  }, []);

  // Handle Tech Selection (Select/Deselect)
  const handleTechSelect = (tech) => {
    let updatedStack;

    if (selectedTech.includes(tech)) {
      // Deselect: Remove tech from selected list
      updatedStack = selectedTech.filter(t => t !== tech);
    } else {
      // Select: Add tech to selected list
      updatedStack = [...selectedTech, tech];
    }

    setSelectedTech(updatedStack);
    localStorage.setItem("techStack", JSON.stringify(updatedStack));
    
    // Animate the tech items as they change
    gsap.fromTo(
      cardContainerRef.current.children,
      { scale: 0.95 },
      { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" }
    );
  };

  // Handle Experience Level Selection
  const handleExperienceSelect = (level) => {
    setExperience(level);
    localStorage.setItem("experience", level);
    
    // Animate the selected experience button
    const buttons = experienceRef.current.querySelectorAll("button");
    buttons.forEach(button => {
      if (button.textContent === level) {
        gsap.fromTo(
          button,
          { scale: 0.9 },
          { scale: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
      }
    });
  };

  // Navigate to Projects Page
  const handleNext = () => {
    if (selectedTech.length === 0 || experience === "" || selectedCategories.length === 0) {
      gsap.to(nextButtonRef.current, {
        x: [-10, 10, -10, 10, 0],
        duration: 0.4,
        ease: "power2.inOut"
      });
      
      alert("Please select at least one technology, category, and experience level!");
      return;
    }
    
    gsap.to(".container", { 
      opacity: 0, 
      y: -30, 
      duration: 0.7,
      onComplete: () => navigate("/create-project")
    });
  };

  const handleCategorySelect = (category) => {
    // If clicking the already selected category, do nothing
    if (selectedCategories === category) {
      return;
    }
    
    // Set the single selected category
    setSelectedCategories(category);
    localStorage.setItem("selectedCategories", JSON.stringify(category));
    
    // Animate the category items
    gsap.fromTo(
      `.category-${category.replace(/\s+/g, '-').toLowerCase()}`,
      { scale: 0.95 },
      { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" }
    );
  };
  

  // Filter Remaining Tech (Only Show Unselected Ones)
  const getRemainingTechInCategory = (category) => {
    return techCategories[category].filter(tech => !selectedTech.includes(tech));
  };

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6 mt-14">
      <div className="w-full max-w-4xl">
        <h1 
          ref={titleRef}
          className="text-4xl font-bold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 p-4"
        >
          What technologies are you using?
        </h1>
        
        {/* Selected Tech Stack */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {selectedTech.length > 0 ? (
            selectedTech.map((tech, index) => (
              <span 
                key={index} 
                onClick={() => handleTechSelect(tech)} 
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg cursor-pointer shadow-lg hover:shadow-blue-500/50 transition-all duration-300 flex items-center gap-2"
              >
                {tech}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </span>
            ))
          ) : (
            <div className="text-gray-400 italic mb-2">Select technologies below</div>
          )}
        </div>

        {/* Tech Stack Selection by Category */}
        <div ref={cardContainerRef} className="space-y-8 mb-12">
          {Object.keys(techCategories).map((category) => {
            const remainingInCategory = getRemainingTechInCategory(category);
            if (remainingInCategory.length === 0) return null;
            
            return (
              <div key={category} className="space-y-3">
                <h3 className="text-xl font-medium text-gray-300">{category}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {remainingInCategory.map((tech, index) => (
                    <button
                      key={index}
                      onClick={() => handleTechSelect(tech)}
                      className="group px-4 py-3 border border-gray-700 rounded-xl transition-all duration-300
                        hover:border-blue-500 hover:bg-blue-500/10 text-gray-200 hover:text-white
                        flex items-center justify-center shadow-md hover:shadow-blue-500/20"
                    >
                      <span className="group-hover:scale-105 transition-transform duration-300">{tech}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Experience Level Selection */}
        <div ref={experienceRef} className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            What's your experience level?
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {["Beginner", "Intermediate", "Advanced"].map((level) => (
              <button
                key={level}
                onClick={() => handleExperienceSelect(level)}
                className={`px-6 py-3 rounded-xl transition-all duration-300 text-lg
                  ${experience === level 
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30" 
                    : "border border-gray-700 text-gray-300 hover:border-blue-500 hover:text-white"
                  }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
         {/* Add Categories Selection */}
         <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Select Your Project Categories
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={`category-${category.replace(/\s+/g, '-').toLowerCase()} px-4 py-2 rounded-lg transition-all duration-300
                  ${selectedCategories.includes(category)
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg"
                    : "border border-gray-700 text-gray-300 hover:border-blue-500"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Next Button */}
        <div className="flex justify-center">
          <button
            ref={nextButtonRef}
            onClick={handleNext}
            className="px-10 py-4 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl 
              hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:translate-y-[-2px]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}