import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Users, Plus, User, LogOut } from 'lucide-react';

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16 2L3 9L16 16L29 9L16 2Z"
      className="stroke-[#00ff9d] fill-none stroke-2 animate-pulse"
    />
    <path
      d="M3 9V23L16 30M16 16V30M29 9V23L16 30"
      className="stroke-white/50 fill-none stroke-2"
    />
    <path
      d="M8 11L13 14M24 11L19 14"
      className="stroke-[#00ff9d] stroke-2"
      strokeLinecap="round"
    />
  </svg>
);

const Navbar = ({ user, onLogout }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-sm border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex items-center gap-3"
            >
              <Logo />
              <div className="absolute inset-0 bg-gradient-to-r from-[#00ff9d] to-[#00cc7d] blur-sm opacity-0 group-hover:opacity-30 transition-opacity" />
              <span className="relative text-2xl font-bold font-['Space_Grotesk'] text-white">
                CodeWorkedPark
              </span>
            </motion.div>
          </Link>

          <div className="flex items-center space-x-8">
            {[
              { path: '/create-project', label: 'Create', icon: Plus },
              { path: '/community', label: 'Community', icon: Users },
              { path: '/profile', label: 'Profile', icon: User }
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center space-x-2 text-gray-300 hover:text-[#00ff9d] transition-colors duration-300"
                onMouseEnter={() => setHoveredItem(item.label)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <item.icon 
                  className={`w-4 h-4 transition-all duration-300 ${
                    hoveredItem === item.label ? 'text-[#00ff9d]' : 'text-gray-400'
                  }`}
                />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
            <motion.button 
              onClick={onLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-white/10 hover:border-[#00ff9d]/50 hover:bg-[#00ff9d]/10 transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
