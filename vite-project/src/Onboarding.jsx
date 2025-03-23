import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import OnboardingSlide from "./components/OnboardingSlide";
import FinalForm from "./components/FinalForm";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideRef = useRef(null);
  const navigate = useNavigate();

  const slides = [
    {
      title: "Welcome to CodeWorked Park",
      description: "Your AI-powered coding companion for building impressive projects and growing your skills.",
      image: "/assets/welcome.svg", // You'll need to add these images
      color: "from-blue-500 to-purple-500"
    },
    {
      title: "Smart Project Recommendations",
      description: "Get personalized project suggestions based on your skills and experience level.",
      image: "/assets/projects.svg",
      color: "from-purple-500 to-indigo-500"
    },
    {
      title: "Join Developer Communities",
      description: "Connect with like-minded developers, share resources, and grow together.",
      image: "/assets/community.svg",
      color: "from-indigo-500 to-blue-500"
    }
  ];

  useEffect(() => {
    // Check if user has already visited
    const isVisited = localStorage.getItem("isVisited");
    const user = localStorage.getItem("user");

    if (isVisited && user) {
      navigate("/");
    }
  }, [navigate]);

  const animateSlide = (direction) => {
    gsap.to(slideRef.current, {
      opacity: 0,
      x: direction === 'next' ? -100 : 100,
      duration: 0.3,
      onComplete: () => {
        setCurrentSlide(prev => 
          direction === 'next' 
            ? prev < slides.length - 1 ? prev + 1 : prev + 1 // Changed this line
            : prev > 0 ? prev - 1 : prev
        );
        gsap.fromTo(slideRef.current,
          { opacity: 0, x: direction === 'next' ? 100 : -100 },
          { opacity: 1, x: 0, duration: 0.3 }
        );
      }
    });
  };

  const handleComplete = (formData) => {
    localStorage.setItem("isVisited", "true");
    localStorage.setItem("user", JSON.stringify(formData));
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-4xl p-8">
        <div ref={slideRef} className="relative">
          {currentSlide < slides.length ? (
            <OnboardingSlide
              {...slides[currentSlide]}
              currentSlide={currentSlide}
              totalSlides={slides.length}
              onNext={() => animateSlide('next')}
              onPrev={() => animateSlide('prev')}
            />
          ) : (
            <FinalForm onComplete={handleComplete} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;