import React from 'react';
import { motion } from 'framer-motion';
import { Edit3, X } from 'lucide-react';
import ProfileForm from './ProfileForm';
import ProfileDisplay from './ProfileDisplay';

export default function ProfileTab({ userInfo, editing, setEditing, handleSave, setUserInfo }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative z-10"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#00ff9d]">
          My Profile
        </h1>
        <button 
          onClick={() => setEditing(!editing)}
          className={`px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 ${
            editing 
              ? "text-gray-400 hover:text-white border border-gray-700 hover:border-white" 
              : "bg-[#00ff9d] text-black hover:bg-[#00ff9d]/90"
          }`}
        >
          {editing ? (
            <>
              <X className="w-4 h-4" />
              Cancel
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </>
          )}
        </button>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {editing ? (
          <ProfileForm userInfo={userInfo} setUserInfo={setUserInfo} handleSave={handleSave} />
        ) : (
          <ProfileDisplay userInfo={userInfo} />
        )}
      </motion.div>
    </motion.div>
  );
}