import React from 'react';
import { Save } from 'lucide-react';

export default function ProfileForm({ userInfo, setUserInfo, handleSave }) {
  return (
    <div className="mt-6 space-y-6 bg-gray-900/50 p-8 rounded-xl backdrop-blur-sm border border-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
          <input
            type="text"
            placeholder="Your name"
            value={userInfo.name}
            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
            className="w-full p-3 bg-black/70 text-white rounded-xl border border-gray-700 focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d] transition-all duration-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Experience Level</label>
          <select
            value={userInfo.experienceLevel}
            onChange={(e) => setUserInfo({ ...userInfo, experienceLevel: e.target.value })}
            className="w-full p-3 bg-black/70 text-white rounded-xl border border-gray-700 focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d] transition-all duration-300"
          >
            <option value="">Select Level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
          <textarea
            placeholder="Tell us about yourself"
            value={userInfo.bio}
            onChange={(e) => setUserInfo({ ...userInfo, bio: e.target.value })}
            className="w-full p-3 bg-black/70 text-white rounded-xl border border-gray-700 focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d] transition-all duration-300 min-h-[120px] resize-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-400 mb-2">Tech Stack</label>
          <input
            type="text"
            placeholder="React, Node.js, MongoDB, etc."
            value={userInfo.techStack && Array.isArray(userInfo.techStack) ? userInfo.techStack.join(", ") : ""}
            onChange={(e) => setUserInfo({ ...userInfo, techStack: e.target.value.split(",").map(tech => tech.trim()) })}
            className="w-full p-3 bg-black/70 text-white rounded-xl border border-gray-700 focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d] transition-all duration-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Education</label>
          <input
            type="text"
            placeholder="Your educational background"
            value={userInfo.education}
            onChange={(e) => setUserInfo({ ...userInfo, education: e.target.value })}
            className="w-full p-3 bg-black/70 text-white rounded-xl border border-gray-700 focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d] transition-all duration-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Hobbies</label>
          <input
            type="text"
            placeholder="What do you enjoy outside of coding?"
            value={userInfo.hobbies}
            onChange={(e) => setUserInfo({ ...userInfo, hobbies: e.target.value })}
            className="w-full p-3 bg-black/70 text-white rounded-xl border border-gray-700 focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d] transition-all duration-300"
          />
        </div>
      </div>

      <div className="pt-4">
        <button 
          onClick={handleSave}
          className="px-6 py-3 bg-[#00ff9d] text-black rounded-xl font-medium hover:bg-[#00ff9d]/90 transition-all duration-300 flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </div>
    </div>
  );
}