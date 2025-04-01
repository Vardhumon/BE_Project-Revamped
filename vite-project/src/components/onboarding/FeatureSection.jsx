import React from 'react';
import { motion } from 'framer-motion';

const FeatureSection = ({ feature, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="min-h-screen flex items-center justify-center py-20"
    >
      <div className="container mx-auto px-4">
        <div className={`grid md:grid-cols-2 gap-16 items-center ${
          index % 2 === 1 ? 'md:grid-flow-col-dense' : ''
        }`}>
          <motion.div 
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`space-y-8 ${index % 2 === 1 ? 'md:col-start-2' : ''}`}
          >
            <div>
              <h3 className="text-2xl font-light text-gray-400 mb-2">
                {feature.subtitle}
              </h3>
              <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#00ff9d]">
                {feature.title}
              </h2>
            </div>
            <p className="text-xl text-gray-300 leading-relaxed">
              {feature.description}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`relative group ${index % 2 === 1 ? 'md:col-start-1' : ''}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#00ff9d]/20 to-transparent blur-3xl group-hover:scale-110 transition-transform duration-500" />
            <div className="relative aspect-square rounded-2xl bg-black/30 backdrop-blur-xl border border-[#00ff9d]/20 p-12 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
              {feature.icon}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeatureSection;