import React from 'react';
import ProfileForm from './ProfileForm';
import ProfileDisplay from './ProfileDisplay';

export default function ProfileTab({ userInfo, editing, setEditing, handleSave, setUserInfo }) {
  return (
    <div className="mt-6 relative z-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
          My Profile
        </h1>
        <button 
          onClick={() => setEditing(!editing)}
          className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm ${
            editing 
              ? "text-gray-300 hover:text-white" 
              : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md"
          }`}
        >
          {editing ? "Cancel" : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Profile
            </>
          )}
        </button>
      </div>
      
      {editing ? (
        <ProfileForm userInfo={userInfo} setUserInfo={setUserInfo} handleSave={handleSave} />
      ) : (
        <ProfileDisplay userInfo={userInfo} />
      )}
    </div>
  );
}