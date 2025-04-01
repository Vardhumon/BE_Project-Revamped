import React from 'react';
import { Code2, Briefcase, GraduationCap, Heart } from 'lucide-react';

export default function ProfileDisplay({ userInfo }) {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* User Info Card */}
      <div className="bg-gray-900/50 p-6 rounded-xl backdrop-blur-sm border border-gray-800 transition-all duration-300 hover:border-[#00ff9d]/30">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00ff9d] to-[#00ff9d]/50 flex items-center justify-center text-black text-2xl font-bold">
            {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : '?'}
          </div>
          <div className="ml-4">
            <h2 className="text-2xl font-bold text-white">{userInfo.name || "Your Name"}</h2>
            <p className="text-[#00ff9d]">{userInfo.experienceLevel || "Experience Level"}</p>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-md font-medium text-gray-400">Bio</h3>
          <p className="mt-2 text-gray-300 leading-relaxed">
            {userInfo.bio || "Tell us about yourself..."}
          </p>
        </div>
      </div>

      {/* Tech Stack Card */}
      <div className="bg-gray-900/50 p-6 rounded-xl backdrop-blur-sm border border-gray-800 transition-all duration-300 hover:border-[#00ff9d]/30">
        <div className="flex items-center mb-4">
          <div className="p-2 rounded-lg bg-[#00ff9d]/10 mr-3">
            <Code2 className="w-6 h-6 text-[#00ff9d]" />
          </div>
          <h3 className="text-xl font-bold text-white">Tech Stack</h3>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {userInfo.techStack && Array.isArray(userInfo.techStack) && userInfo.techStack.length > 0 ? 
            userInfo.techStack.map((tech, index) => (
              tech.trim() && (
                <span 
                  key={index} 
                  className="px-3 py-1.5 bg-black/50 border border-[#00ff9d]/20 rounded-lg text-[#00ff9d] text-sm"
                >
                  {tech.trim()}
                </span>
              )
            )) : 
            <p className="text-gray-400">No technologies added yet</p>
          }
        </div>
      </div>

      {/* Experience Card */}
      <div className="bg-gray-900/50 p-6 rounded-xl backdrop-blur-sm border border-gray-800 transition-all duration-300 hover:border-[#00ff9d]/30">
        <div className="flex items-center mb-4">
          <div className="p-2 rounded-lg bg-[#00ff9d]/10 mr-3">
            <Briefcase className="w-6 h-6 text-[#00ff9d]" />
          </div>
          <h3 className="text-xl font-bold text-white">Experience</h3>
        </div>
        <p className="text-gray-300">{userInfo.experienceLevel || "Not specified"}</p>
      </div>

      {/* Education Card */}
      <div className="bg-gray-900/50 p-6 rounded-xl backdrop-blur-sm border border-gray-800 transition-all duration-300 hover:border-[#00ff9d]/30">
        <div className="flex items-center mb-4">
          <div className="p-2 rounded-lg bg-[#00ff9d]/10 mr-3">
            <GraduationCap className="w-6 h-6 text-[#00ff9d]" />
          </div>
          <h3 className="text-xl font-bold text-white">Education</h3>
        </div>
        <p className="text-gray-300">{userInfo.education || "Not specified"}</p>
      </div>

      {/* Hobbies Card */}
      <div className="bg-gray-900/50 p-6 rounded-xl backdrop-blur-sm border border-gray-800 md:col-span-2 transition-all duration-300 hover:border-[#00ff9d]/30">
        <div className="flex items-center mb-4">
          <div className="p-2 rounded-lg bg-[#00ff9d]/10 mr-3">
            <Heart className="w-6 h-6 text-[#00ff9d]" />
          </div>
          <h3 className="text-xl font-bold text-white">Hobbies</h3>
        </div>
        <p className="text-gray-300">{userInfo.hobbies || "Not specified"}</p>
      </div>
    </div>
  );
}