import React from 'react';

export default function ProfileDisplay({ userInfo }) {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* User Info Card */}
      <div className="bg-gray-900/50 p-6 rounded-xl backdrop-blur-sm border border-gray-800 transition-all duration-300 hover:border-gray-700">
        <div className="flex items-center mb-4">
          <div className="p-2 rounded-lg bg-blue-500/20 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">{userInfo.name || "Your Name"}</h2>
        </div>
        <div className="mt-2">
          <h3 className="text-md font-medium text-gray-400">Bio</h3>
          <p className="mt-1 text-gray-300">{userInfo.bio || "Tell us about yourself..."}</p>
        </div>
      </div>

      {/* Tech Stack Card */}
      <div className="bg-gray-900/50 p-6 rounded-xl backdrop-blur-sm border border-gray-800 transition-all duration-300 hover:border-gray-700">
        {/* Add tech stack display content */}
      </div>

      {/* Add other profile display cards */}
    </div>
  );
}