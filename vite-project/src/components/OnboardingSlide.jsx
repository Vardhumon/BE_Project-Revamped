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
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="relative p-8 rounded-2xl bg-gradient-to-br bg-opacity-10 backdrop-blur-lg"
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-5 rounded-2xl`} />
      
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
          >
            {title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300"
          >
            {description}
          </motion.p>
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
              onClick={() => onNext('next')}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-colors"
            >
              {currentSlide === totalSlides - 1 ? 'Get Started' : 'Next'}
            </button>
          </div>
          <div className="flex gap-2 mt-4">
            {[...Array(totalSlides)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentSlide 
                    ? 'w-8 bg-blue-500' 
                    : 'w-2 bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          <img 
            src={image} 
            alt={title} 
            className="w-full max-w-md mx-auto"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OnboardingSlide;