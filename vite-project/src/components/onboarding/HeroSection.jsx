import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const HeroSection = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen flex items-center justify-center relative"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00ff9d]/10 to-black" />
        {/* Animated background elements */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-[#00ff9d]/10 rounded-full blur-3xl"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1],
              x: [-50, 50, -50],
              y: [-50, 50, -50],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              delay: i * 2,
            }}
            style={{
              width: `${200 + i * 100}px`,
              height: `${200 + i * 100}px`,
              left: `${20 + i * 15}%`,
              top: `${20 + i * 10}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center space-y-8 max-w-4xl px-4">
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#00ff9d]"
        >
          CodeWorked Park
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl text-gray-300"
        >
          Your AI-Powered Coding Journey Begins Here
        </motion.p>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="animate-bounce"
        >
          <ArrowDown className="w-8 h-8 mx-auto text-[#00ff9d]" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroSection;