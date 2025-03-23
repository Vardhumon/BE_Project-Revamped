import React from "react";
import { motion } from "framer-motion";

const OnboardingSlide = ({ 
  title, 
  description, 
  image, 
  color,
  currentSlide,
  totalSlides,
  onNext,
  onPrev 
}) => {
  return (
    <div className="relative p-8 rounded-2xl bg-gradient-to-br bg-opacity-10 backdrop-blur-lg">
      <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-5 rounded-2xl`} />
      
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            {title}
          </h2>
          <p className="text-xl text-gray-300">
            {description}
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={onPrev}
              disabled={currentSlide === 0}
              className={`px-6 py-2 rounded-lg ${
                currentSlide === 0 
                  ? 'bg-gray-700 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } transition-colors`}
            >
              Previous
            </button>
            <button
              onClick={onNext}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-colors"
            >
              Next
            </button>
          </div>
          <div className="flex gap-2 mt-4">
            {[...Array(totalSlides)].map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentSlide 
                    ? 'w-8 bg-blue-500' 
                    : 'w-2 bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
        <div className="relative">
          <img 
            src={image} 
            alt={title} 
            className="w-full max-w-md mx-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default OnboardingSlide;