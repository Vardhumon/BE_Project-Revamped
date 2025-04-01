import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Code2, Server, Layout, Brain, Terminal, Database } from 'lucide-react';

export default function Community() {
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-black text-white pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#00ff9d]">
            Join Our Developer Communities
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Connect with like-minded developers, share your projects, and learn from others
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {communities.map((community, index) => (
            <motion.div
              key={community.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/community/${community.slug}`)}
              className="group p-6 bg-gradient-to-br from-black to-gray-900 border border-white/10 rounded-xl cursor-pointer
                hover:border-[#00ff9d]/50 transition-all duration-300 transform hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-lg bg-white/5 group-hover:bg-[#00ff9d]/10 transition-colors">
                  {community.icon}
                </div>
                <h2 className="text-2xl font-bold group-hover:text-[#00ff9d] transition-colors">
                  {community.name}
                </h2>
              </div>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                {community.description}
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm text-[#00ff9d] opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Join community</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
