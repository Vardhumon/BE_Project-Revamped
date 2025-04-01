import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Rocket, Brain, Sparkles, ArrowRight, Terminal, Users, Star, ChevronRight, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [activeTab, setActiveTab] = useState('trending');

  const features = [
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "Smart Code Generation",
      description: "Generate high-quality code snippets powered by advanced AI. Get instant solutions for complex programming challenges.",
      stats: "500+ Snippets Generated"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI Assistance",
      description: "Get intelligent suggestions and real-time code analysis. Our AI helps you write better, cleaner, and more efficient code.",
      stats: "24/7 AI Support"
    },
    {
      icon: <Rocket className="w-6 h-6" />,
      title: "Project Builder",
      description: "Create and manage projects with our intuitive tools. From ideation to deployment, we've got you covered.",
      stats: "1000+ Projects Created"
    }
  ];

  const projectTabs = {
    trending: [
      {
        title: "AI Chat Application",
        description: "A real-time chat application with AI-powered response generation and sentiment analysis.",
        tech: ['React', 'Node.js', 'OpenAI'],
        stats: { stars: 128, forks: 34 }
      },
      {
        title: "Smart Portfolio Generator",
        description: "Generate professional developer portfolios using AI with custom themes and content suggestions.",
        tech: ['Vue.js', 'Python', 'GPT-3'],
        stats: { stars: 95, forks: 28 }
      },
      {
        title: "Code Review Assistant",
        description: "Automated code review tool that provides intelligent suggestions and best practices.",
        tech: ['TypeScript', 'Express', 'AI'],
        stats: { stars: 156, forks: 42 }
      }
    ],
    recent: [
      // ... similar structure for recent projects
    ]
  };

  return (
    <div className="pt-20 min-h-screen bg-black text-white">
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
        
      {/* Hero Section - Enhanced with particle effect background */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative px-4 py-32"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#00ff9d]/10 to-transparent">
          {/* Add animated particles here */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#00ff9d]/30 rounded-full"
              animate={{
                y: [-20, 20],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: Math.random() * 2 + 2,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
        
        {/* Rest of the hero section content */}
        <div className="max-w-7xl mx-auto relative">
          <motion.div className="text-center space-y-8">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="inline-block px-6 py-2 rounded-full bg-white/5 border border-white/10 text-[#00ff9d] mb-4"
            >
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4 animate-pulse" />
                Smart Project Recommendations
              </span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold font-['Space_Grotesk'] leading-tight">
              Discover & Build
              <div className="relative inline-block">
                <span className="bg-gradient-to-r from-white to-[#00ff9d] bg-clip-text text-transparent"> Projects</span>
                <motion.div
                  className="absolute -bottom-2 left-0 w-full h-1 bg-[#00ff9d]/30"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5 }}
                />
              </div>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Get personalized project recommendations based on your tech stack. Build your portfolio, share with the community, and grow together with fellow developers.
            </p>

            {/* Enhanced CTA buttons */}
            <motion.div 
              className="flex justify-center gap-4 pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link
                to="/choices"
                className="group flex items-center gap-2 px-8 py-4 bg-[#00ff9d] text-black rounded-lg font-medium hover:bg-[#00cc7d] transition-all duration-300 shadow-lg shadow-[#00ff9d]/20"
              >
                <Terminal className="w-5 h-5" />
                Start Building
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/community"
                className="group px-8 py-4 border border-white/10 rounded-lg font-medium hover:bg-white/5 transition-all duration-300 flex items-center gap-2"
              >
                <Users className="w-5 h-5" />
                Explore Community
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Stats section update */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-16 pt-8 border-t border-white/10">
              {[
                { label: "Project Templates", value: "100+" },
                { label: "Active Community", value: "5,000+" },
                { label: "Projects Completed", value: "10,000+" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl font-bold text-[#00ff9d]">{stat.value}</div>
                  <div className="text-gray-400 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section - Enhanced with hover effects */}
      <section className="px-4 py-32 bg-gradient-to-b from-transparent via-white/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-center mb-16"
          >
            Your Journey to Better Projects
          </motion.h2>
          
          {/* Changed to flex container */}
          <div className="flex flex-col md:flex-row gap-8">
            {[
              {
                icon: <Code2 className="w-6 h-6" />,
                title: "Smart Project Matching",
                description: "Get personalized project recommendations that match your skills and interests. Find the perfect project to enhance your portfolio.",
                stats: "100+ Project Templates"
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Community Support",
                description: "Connect with developers, share your progress, and get help when stuck. Learn from others and grow together.",
                stats: "Active Community"
              },
              {
                icon: <Rocket className="w-6 h-6" />,
                title: "Portfolio Builder",
                description: "Complete projects, showcase your work, and build a strong portfolio. Stand out to potential employers.",
                stats: "1000+ Portfolios Created"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ delay: index * 0.1 }}
                className="flex-1 p-8 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl hover:border-[#00ff9d]/50 transition-all duration-300 relative group"
                onHoverStart={() => setHoveredFeature(index)}
                onHoverEnd={() => setHoveredFeature(null)}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-[#00ff9d]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
                />
                
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-[#00ff9d]/10 flex items-center justify-center mb-6 group-hover:bg-[#00ff9d]/20 transition-colors">
                    {React.cloneElement(feature.icon, { 
                      className: "w-8 h-8 text-[#00ff9d]" 
                    })}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">{feature.description}</p>
                  
                  <div className="flex items-center gap-2 text-sm text-[#00ff9d]">
                    <Activity className="w-4 h-4" />
                    {feature.stats}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section - Enhanced with tabs and detailed cards */}
      <section className="px-4 py-32">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold">Featured Projects</h2>
            
            <div className="flex gap-4">
              {['trending', 'recent'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeTab === tab 
                      ? 'bg-[#00ff9d] text-black' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {projectTabs[activeTab]?.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-6 rounded-xl border border-white/10 bg-black hover:border-[#00ff9d]/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 rounded-lg bg-[#00ff9d]/10 text-[#00ff9d]">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-medium group-hover:text-[#00ff9d] transition-colors">
                      {project.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-400 mb-6 line-clamp-2">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((tech) => (
                      <span 
                        key={tech} 
                        className="px-3 py-1 rounded-full bg-white/5 text-sm text-gray-300 border border-white/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        {project.stats.stars}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {project.stats.forks}
                      </span>
                    </div>
                    <Link 
                      to={`/project-details`}
                      className="text-[#00ff9d] hover:underline flex items-center gap-1"
                    >
                      View Details
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default HomePage;