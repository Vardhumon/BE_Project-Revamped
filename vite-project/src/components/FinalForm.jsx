import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ArrowRight, CheckCircle } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const FinalForm = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    techStack: [],
    experienceLevel: "",
    bio: "",
    education: "",
    githubProfile: ""
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef(null);
  const navigate = useNavigate();
  
  const techStackOptions = [
    "JavaScript", "React", "Node.js", "Python", "Java", 
    "C#", "PHP", "Ruby", "Go", "Swift", "Kotlin",
    "HTML/CSS", "TypeScript", "Angular", "Vue.js"
  ];
  
  const experienceOptions = ["Beginner", "Intermediate", "Advanced"];
  
  useEffect(() => {
    // Animate form elements when they appear
    if (formRef.current) {
      gsap.fromTo(
        formRef.current.querySelectorAll('.form-element'),
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.1, 
          duration: 0.6,
          ease: "power2.out"
        }
      );
    }
  }, [currentStep]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTechStackToggle = (tech) => {
    setFormData(prev => {
      const newTechStack = prev.techStack.includes(tech)
        ? prev.techStack.filter(t => t !== tech)
        : [...prev.techStack, tech];
      return { ...prev, techStack: newTechStack };
    });
  };
  
  // Fix the experience handler
  const handleExperienceSelect = (level) => {
    setFormData(prev => ({ ...prev, experienceLevel: level }));  // Changed from experience to experienceLevel
  };
  
  // Add profile section and fix tech stack selection check
  const isStepComplete = () => {
    if (currentStep === 0) return formData.name.trim() !== "" && formData.email.trim() !== "" && formData.password.trim() !== "";
    if (currentStep === 1) return formData.techStack.length > 0;
    if (currentStep === 2) return formData.experienceLevel !== "";  // Changed from experience to experienceLevel
    if (currentStep === 3) return true;
    return false;
  };
  
  const handleNextStep = async () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Handle form submission
      try {
        setIsLoading(true);
        
        // Send request to backend
        const response = await fetch('http://localhost:5000/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Something went wrong');
        }
        
        // Show success toast
        console.log(data);
        if(data.user){
        // toast.success('Account created successfully!');
        console.log("account created")
        // Navigate to home page
        // setTimeout(() => {
        //     navigate('/');
        //   }, 1000);
        }
        
        // Call the onComplete callback if provided
        if (onComplete) {
          onComplete(data);
        }
      } catch (error) {
        toast.error(error.message || 'Failed to create account');
        console.error('Signup error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  return (
    <div 
      ref={formRef}
      className="w-full min-h-screen flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl p-8"
    >
      <Toaster />
      <div className="w-full max-w-3xl">
        <h2 className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#00ff9d]">
          Complete Your Profile
        </h2>
        <p className="text-gray-300 mb-12">
          Just a few more details to personalize your experience
        </p>
      
        {/* Progress indicator */}
        <div className="flex mb-12 relative">
          <div className="absolute h-1 bg-gray-700 top-3 left-0 right-0 z-0"></div>
          {[0, 1, 2, 3].map((step) => (
            <div key={step} className="flex-1 relative z-10 flex flex-col items-center">
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-300 ${
                  step < currentStep 
                    ? 'bg-[#00ff9d] text-black' 
                    : step === currentStep 
                      ? 'bg-white' 
                      : 'bg-gray-700'
                }`}
              >
                {step < currentStep ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <span className={step === currentStep ? 'text-black' : 'text-gray-400'}>
                    {step + 1}
                  </span>
                )}
              </div>
              <span className={`text-sm mt-2 ${
                step <= currentStep ? 'text-white' : 'text-gray-500'
              }`}>
                {step === 0 ? 'Account' : step === 1 ? 'Tech Stack' : step === 2 ? 'Experience' : 'Profile'}
              </span>
            </div>
          ))}
        </div>

        {/* Input fields styling */}
        <style jsx>{`
          input, textarea {
            @apply w-full p-3 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#00ff9d] focus:border-[#00ff9d] text-white transition-all duration-300;
          }
          
          .tech-stack-btn {
            @apply px-4 py-2 rounded-xl transition-all duration-300;
          }
          
          .tech-stack-btn.selected {
            @apply bg-[#00ff9d] text-black shadow-lg shadow-[#00ff9d]/20;
          }
          
          .tech-stack-btn.unselected {
            @apply bg-white/10 text-gray-300 hover:bg-white/20 border border-white/10;
          }
        `}</style>

        {/* Step 1: Basic Info */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="form-element">
              <label className="block text-gray-300 mb-2">Your Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-pink-500 text-white"
                placeholder="Enter your name"
              />
            </div>
            <div className="form-element">
              <label className="block text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-pink-500 text-white"
                placeholder="Enter your email"
              />
            </div>
            <div className="form-element">
              <label className="block text-gray-300 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-pink-500 text-white"
                placeholder="Create a password"
              />
            </div>
          </div>
        )}

        {/* Remove the style jsx block and replace with regular classes */}
        {/* Step 2: Tech Stack */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="form-element">
              <label className="block text-gray-300 mb-4">Select Your Tech Stack</label>
              <div className="flex flex-wrap gap-3">
                {techStackOptions.map((tech, idx) => (
                  <motion.button
                    key={tech}
                    type="button"
                    onClick={() => handleTechStackToggle(tech)}
                    className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                      formData.techStack.includes(tech)
                        ? 'bg-[#00ff9d] text-black shadow-lg shadow-[#00ff9d]/20'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/10'
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 * idx }}
                  >
                    {tech}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Experience */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="form-element">
              <label className="block text-gray-300 mb-4">Your Experience Level</label>
              <div className="grid grid-cols-3 gap-4">
                {experienceOptions.map((level, idx) => (
                  <motion.button
                    key={level}
                    type="button"
                    onClick={() => handleExperienceSelect(level)}
                    className={`p-4 rounded-xl border transition-all duration-300 flex flex-col items-center ${
                      formData.experienceLevel === level  // Changed from experience to experienceLevel
                        ? 'bg-[#00ff9d] text-black border-transparent shadow-lg shadow-[#00ff9d]/20'
                        : 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/20'
                    }`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 * idx }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-lg font-medium">{level}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Profile */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="form-element">
              <label className="block text-gray-300 mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full p-3 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#00ff9d] focus:border-[#00ff9d] text-white transition-all duration-300"
                placeholder="Tell us about yourself..."
                rows="4"
              />
            </div>
            <div className="form-element">
              <label className="block text-gray-300 mb-2">Education</label>
              <input
                type="text"
                name="education"
                value={formData.education}
                onChange={handleChange}
                className="w-full p-3 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#00ff9d] focus:border-[#00ff9d] text-white transition-all duration-300"
                placeholder="Your educational background"
              />
            </div>
            <div className="form-element">
              <label className="block text-gray-300 mb-2">GitHub Profile</label>
              <input
                type="text"
                name="githubProfile"
                value={formData.githubProfile}
                onChange={handleChange}
                className="w-full p-3 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#00ff9d] focus:border-[#00ff9d] text-white transition-all duration-300"
                placeholder="Your GitHub username"
              />
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="mt-10 flex justify-between">
          {currentStep > 0 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/10 transition-colors"
              disabled={isLoading}
            >
              Back
            </button>
          ) : (
            <div></div>
          )}
          
          <motion.button
            type="button"
            onClick={handleNextStep}
            disabled={!isStepComplete() || isLoading}
            whileHover={{ scale: isStepComplete() && !isLoading ? 1.05 : 1 }}
            whileTap={{ scale: isStepComplete() && !isLoading ? 0.95 : 1 }}
            className={`px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 ${
              isStepComplete() && !isLoading
                ? 'bg-[#00ff9d] text-black shadow-lg shadow-[#00ff9d]/20'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <span className="animate-pulse">Processing...</span>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              </>
            ) : (
              <>
                {currentStep === 3 ? 'Complete' : 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default FinalForm;