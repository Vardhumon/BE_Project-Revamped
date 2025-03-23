import React from 'react';

export default function ProfileForm({ userInfo, setUserInfo, handleSave }) {
  return (
    <div className="mt-6 space-y-4 bg-gray-900/50 p-6 rounded-xl backdrop-blur-sm border border-gray-800">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1.5">Name</label>
        <input
          type="text"
          placeholder="Your name"
          value={userInfo.name}
          onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
          className="w-full p-3 bg-gray-800/70 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
        />
      </div>
      
      {/* Similar pattern for other fields */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1.5">Bio</label>
        <textarea
          placeholder="Tell us about yourself"
          value={userInfo.bio}
          onChange={(e) => setUserInfo({ ...userInfo, bio: e.target.value })}
          className="w-full p-3 bg-gray-800/70 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300 min-h-[100px]"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1.5">Tech Stack</label>
        <input
          type="text"
          placeholder="React, Node.js, MongoDB, etc."
          value={userInfo.techStack && Array.isArray(userInfo.techStack) ? userInfo.techStack.join(", ") : ""}
          onChange={(e) => setUserInfo({ ...userInfo, techStack: e.target.value.split(", ") })}
          className="w-full p-3 bg-gray-800/70 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
        />
      </div>
      
      {/* Add other form fields here */}
      
      <div className="pt-4">
        <button 
          onClick={handleSave} 
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-6 py-3 rounded-lg text-white font-medium shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Save Changes
        </button>
      </div>
    </div>
  );
}