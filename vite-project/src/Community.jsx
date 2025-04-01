import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Code2, Server, Layout, Brain, Terminal, Database } from 'lucide-react';
import { useState } from "react";

export default function Community() {
  const navigate = useNavigate();
  const [hoveredCommunity, setHoveredCommunity] = useState(null);

  const communities = [
    { 
      name: "Full-Stack", 
      slug: "full-stack", 
      description: "Why choose one when you can suffer both frontend & backend?",
      icon: <Code2 className="w-8 h-8 text-[#00ff9d]" />
    },
    { 
      name: "Backend", 
      slug: "backend", 
      description: "Where real developers live—frontend? Never heard of it.",
      icon: <Server className="w-8 h-8 text-[#00ff9d]" />
    },
    { 
      name: "Frontend", 
      slug: "frontend", 
      description: "Making things pretty while suffering inside (CSS nightmares included).",
      icon: <Layout className="w-8 h-8 text-[#00ff9d]" />
    },
    { 
      name: "Machine Learning", 
      slug: "ml", 
      description: "Turning data into magic, or just overfitting for fun.",
      icon: <Brain className="w-8 h-8 text-[#00ff9d]" />
    },
    { 
      name: "Artificial Intelligence", 
      slug: "ai", 
      description: "Teaching computers to think—so we don't have to.",
      icon: <Brain className="w-8 h-8 text-[#00ff9d]" />
    },
    { 
      name: "DevOps", 
      slug: "devops", 
      description: "We break things so you don't have to. Also, YAML.",
      icon: <Terminal className="w-8 h-8 text-[#00ff9d]" />
    },
    { 
      name: "Web3", 
      slug: "web3", 
      description: "Decentralized dreams & centralized errors. Welcome to the blockchain.",
      icon: <Database className="w-8 h-8 text-[#00ff9d]" />
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-20 px-4 overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#00ff9d]/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-[#00ff9d]/10 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-[#00ff9d]/10 rounded-full rotate-45" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#00ff9d]/20 rounded-full -rotate-45" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#00ff9d]">
            Developer Communities
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Join our tech communities and connect with fellow developers
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16 place-items-center">
          {communities.map((community, index) => (
            <motion.div
              key={community.slug}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onHoverStart={() => setHoveredCommunity(community.slug)}
              onHoverEnd={() => setHoveredCommunity(null)}
              onClick={() => navigate(`/community/${community.slug}`)}
            >
              <motion.div
                className="w-32 h-32 flex flex-col items-center justify-center gap-4 cursor-pointer
                  bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl
                  hover:border-[#00ff9d]/50 transition-all duration-300
                  hover:shadow-[0_0_30px_rgba(0,255,157,0.2)]"
                whileHover={{ scale: 1.05 }}
              >
                <div className="p-4 rounded-xl bg-white/5">
                  {community.icon}
                </div>
                <p className="text-sm font-medium text-center">{community.name}</p>
              </motion.div>

              <AnimatePresence>
                {hoveredCommunity === community.slug && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="absolute left-full top-1/2 -translate-y-1/2 ml-4 w-64
                      bg-black/70 backdrop-blur-xl border border-[#00ff9d]/20 rounded-xl p-4
                      shadow-[0_0_30px_rgba(0,255,157,0.1)] z-10"
                  >
                    <p className="text-sm text-gray-300 z-10">{community.description}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-[#00ff9d]">
                      <span>Join now</span>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
