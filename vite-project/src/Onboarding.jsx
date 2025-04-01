import React, { useState, useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { Code2, Brain, Rocket, Users } from 'lucide-react';
  import { motion, AnimatePresence } from 'framer-motion';
  import { toast, Toaster } from 'react-hot-toast';
  import HeroSection from './components/onboarding/HeroSection';
  import FeatureSection from './components/onboarding/FeatureSection';
  import FinalForm from './components/FinalForm';

  const features = [
    {
      title: "AI-Powered Learning",
      subtitle: "Smart Learning Assistant",
      description: "Experience personalized learning with our AI that adapts to your coding style and progress, providing tailored guidance and feedback.",
      icon: <Brain className="w-24 h-24 text-[#00ff9d]" />,
    },
    {
      title: "Project-Based Growth",
      subtitle: "Learn by Building",
      description: "Dive into real-world projects that match your skill level and interests. Build a portfolio that showcases your journey and expertise.",
      icon: <Code2 className="w-24 h-24 text-[#00ff9d]" />,
    },
    {
      title: "Smart Progress Tracking",
      subtitle: "Track Your Journey",
      description: "Watch your skills evolve with intelligent progress tracking. Get insights into your learning patterns and achievements.",
      icon: <Rocket className="w-24 h-24 text-[#00ff9d]" />,
    },
    {
      title: "Community Learning",
      subtitle: "Learn Together",
      description: "Join a community of passionate developers. Share knowledge, collaborate on projects, and grow together in your coding journey.",
      icon: <Users className="w-24 h-24 text-[#00ff9d]" />,
    },
  ];

  const Onboarding = () => {
    const navigate = useNavigate();
    const [currentSection, setCurrentSection] = useState(0);

    const handleComplete = (data) => {
      if (data?.user && data?.token) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        localStorage.setItem("isVisited", "true");
        toast.success("Welcome to CodeWorked Park!");
        setTimeout(() => navigate('/'), 1000);
      }
    };

    useEffect(() => {
      const handleScroll = () => {
        const sections = document.querySelectorAll('section');
        sections.forEach((section, index) => {
          const rect = section.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            setCurrentSection(index);
          }
        });
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
      <div className="bg-black text-white h-screen">
        <style>
          {`
            ::-webkit-scrollbar {
              width: 6px;
            }
            ::-webkit-scrollbar-track {
              background: rgba(255, 255, 255, 0.1);
              border-radius: 10px;
            }
            ::-webkit-scrollbar-thumb {
              background: #00ff9d;
              border-radius: 10px;
            }
            ::-webkit-scrollbar-thumb:hover {
              background: #00cc7d;
            }
          `}
        </style>
        
        <div className="h-full overflow-x-hidden">
          <Toaster />
          
          <section id="hero">
            <HeroSection />
          </section>

          {features.map((feature, index) => (
            <section key={index} id={`feature-${index}`}>
              <FeatureSection feature={feature} index={index} />
            </section>
          ))}

          <section id="signup" className="min-h-screen relative">
            <div className="absolute inset-0 bg-gradient-to-b from-[#00ff9d]/10 to-black" />
            <div className="relative z-10">
              <FinalForm onComplete={handleComplete} />
            </div>
          </section>
        </div>

        {/* Progress Slider stays outside scrollable area */}
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50">
          <div className="relative h-[300px] w-1 bg-white/10 rounded-full">
            {/* Progress Bar */}
            <motion.div 
              className="absolute top-0 left-0 w-full bg-[#00ff9d] rounded-full"
              style={{
                height: `${(currentSection / (features.length + 1)) * 100}%`,
              }}
              initial={{ height: '0%' }}
              animate={{ height: `${(currentSection / (features.length + 1)) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Indicator Dots */}
            {[...Array(features.length + 2)].map((_, index) => (
              <motion.div
                key={index}
                className="absolute -left-2 w-5 h-5 cursor-pointer"
                style={{ top: `${(index / (features.length + 1)) * 100}%` }}
                onClick={() => {
                  document.getElementById(
                    index === 0 ? 'hero' : 
                    index === features.length + 1 ? 'signup' : 
                    `feature-${index - 1}`
                  ).scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <motion.div 
                  className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                    currentSection === index 
                      ? "border-[#00ff9d] bg-black" 
                      : "border-white/20 bg-black hover:border-white/40"
                  }`}
                />
                {currentSection === index && (
                  <motion.div 
                    className="absolute inset-0 rounded-full bg-[#00ff9d]/20"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  export default Onboarding;