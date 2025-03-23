import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { useNavigate } from "react-router-dom";
import { Code2, Users, Rocket, MousePointerClick, ArrowDown } from 'lucide-react';
import FinalForm from "./components/FinalForm"; 
import toast, { Toaster } from "react-hot-toast";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const Onboarding = () => {
  const navigate = useNavigate();
  const mainRef = useRef(null);
  const sectionsRef = useRef([]);
  const cursorRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  // Removed timelineRef

  const slides = [
    {
      title: "CodeWorked Park",
      subtitle: "Where Innovation Meets Code",
      description: "Your AI-powered coding companion for building impressive projects and growing your skills.",
      bgColor: "from-blue-600/20 via-purple-600/20 to-indigo-600/20",
      accent: "blue",
      icon: <Code2 className="w-20 h-20" />,
    },
    {
      title: "Smart Projects",
      subtitle: "AI-Powered Recommendations",
      description: "Get personalized project suggestions that match your skill level and career goals. Build a portfolio that stands out.",
      bgColor: "from-purple-600/20 via-pink-600/20 to-blue-600/20",
      accent: "purple",
      icon: <Rocket className="w-20 h-20" />,
    },
    {
      title: "Join Communities",
      subtitle: "Connect & Grow Together",
      description: "Connect with developers worldwide. Share knowledge, collaborate on projects, and grow together.",
      bgColor: "from-pink-400/20 via-blue-600/20 to-red-200/20",
      accent: "pink",
      icon: <Users className="w-20 h-20" />,
    }
  ];

  useEffect(() => {
    // Initial text scramble animation
    const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    const duration = 1;
    const finalTitle = "Welcome to the Future";
    const finalSubtitle = "Scroll down to begin your journey";
    
    if (titleRef.current && subtitleRef.current) {
      gsap.to(titleRef.current, {
        duration,
        text: {
          value: finalTitle,
          scrambleText: chars,
          delimiter: "",
        },
        ease: "none",
        delay: 0.5,
      });

      gsap.to(subtitleRef.current, {
        duration: duration * 0.8,
        text: {
          value: finalSubtitle,
          scrambleText: chars,
          delimiter: "",
        },
        ease: "none",
        delay: 1,
      });
    }

    // Cursor animation
    const cursor = cursorRef.current;
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    const moveCursor = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const updateCursor = () => {
      const dx = mouseX - cursorX;
      const dy = mouseY - cursorY;
      
      cursorX += dx * 0.1;
      cursorY += dy * 0.1;
      
      if (cursor) {
        gsap.set(cursor, {
          x: cursorX,
          y: cursorY,
        });
      }
      
      requestAnimationFrame(updateCursor);
    };

    window.addEventListener("mousemove", moveCursor);
    updateCursor();

    // Removed timeline animation code

    // Initialize scroll animations with overlapping gradients
    sectionsRef.current.forEach((section, index) => {
      if (!section) return;

      // Content animation
      gsap.fromTo(
        section.querySelector('.content-container'),
        {
          opacity: 0,
          x: index % 2 === 0 ? -100 : 100,
        },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top center",
            end: "center center",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Icon container animation
      const icon = section.querySelector('.icon-container');
      if (icon) {
        gsap.fromTo(
          icon,
          {
            opacity: 0,
            x: index % 2 === 0 ? 100 : -100,
            rotateY: 90,
          },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top center",
              end: "center center",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Gradient animation
      const gradient = section.querySelector('.gradient-bg');
      if (gradient) {
        gsap.fromTo(
          gradient,
          { opacity: 0 },
          {
            opacity: 0.3,
            duration: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              toggleActions: "play reverse play reverse",
              scrub: true,
            },
          }
        );
      }
    });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleComplete = (data) => {
    // Check if data exists and has the required properties
    if (data && data.user && data.token) {
      // Store user data and token
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      localStorage.setItem("isVisited", "true");
      toast.success("Registration successful!");
      // Add a small delay to ensure storage is complete
      setTimeout(() => {
        window.location.href = '/'; // This will refresh the page and redirect to home
      }, 500);
    } else {
      console.error("Invalid data received:", data);
    }
  };

  return (
    <div 
      ref={mainRef}
      className="min-h-screen bg-black text-white overflow-x-hidden relative"
    >
      <Toaster />
      {/* Timeline removed */}

      {/* Custom cursor */}
      <div 
        ref={cursorRef}
        className="fixed w-8 h-8 pointer-events-none z-50 mix-blend-difference"
      >
        <div className="w-full h-full bg-white rounded-full blur-sm" />
      </div>

      {/* Welcome Section */}
      <div className="h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-purple-900/20 to-black opacity-50" />
        <div className="text-center space-y-6 max-w-4xl px-4 z-10">
          <h1 
            ref={titleRef}
            className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
          ></h1>
          <p 
            ref={subtitleRef}
            className="text-2xl text-gray-300"
          ></p>
          <div className="animate-bounce mt-12">
            <ArrowDown className="w-8 h-8 mx-auto text-gray-400" />
          </div>
        </div>
      </div>

      {/* Content Sections */}
      {slides.map((slide, index) => (
        <div
          key={index}
          ref={el => sectionsRef.current[index] = el}
          className="min-h-screen flex items-center justify-center relative py-20"
        >
          {/* Background gradient */}
          <div className={`gradient-bg absolute inset-0 bg-gradient-to-r pink opacity-0 transition-opacity duration-1000`} />

          <div className="container mx-auto px-4">
            <div className={`grid md:grid-cols-2 gap-16 items-center ${index % 2 === 1 ? 'md:grid-flow-col-dense' : ''}`}>
              <div className={`content-container space-y-8 ${index % 2 === 1 ? 'md:col-start-2' : ''}`}>
                <div>
                  <h3 className="text-2xl font-light text-gray-400 mb-2">
                    {slide.subtitle}
                  </h3>
                  <h2 className={`text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-${slide.accent}-600`}>
                    {slide.title}
                  </h2>
                </div>
                <p className="text-xl text-gray-300 leading-relaxed">
                  {slide.description}
                </p>
                {index === slides.length - 1 && (
                  <button
                    onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                    className={`px-8 py-3 rounded-lg bg-gradient-to-r from-${slide.accent}-500 to-${slide.accent}-700 hover:from-${slide.accent}-600 hover:to-${slide.accent}-800 transition-colors flex items-center gap-2`}
                  >
                    Get Started <MousePointerClick className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className={`icon-container relative group ${index % 2 === 1 ? 'md:col-start-1' : ''}`}>
                <div className={`w-1/2 mx-auto aspect-square rounded-2xl bg-gradient-to-br from-${slide.accent}-500/20 to-${slide.accent}-700/20 backdrop-blur-xl border border-${slide.accent}-500/20 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500`}>
                  <div className={`text-${slide.accent}-500 transform group-hover:scale-110 transition-transform duration-500`}>
                    {slide.icon}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Final Form Section */}
      <div 
        ref={el => sectionsRef.current[slides.length] = el}
        className="min-h-screen flex items-center justify-center relative py-20"
      >
        <div className="absolute inset-0 bg-gradient-to-r pink" />
        <FinalForm onComplete={handleComplete} />
      </div>
    </div>
  );
};

export default Onboarding;