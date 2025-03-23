import React from 'react';
import { motion } from "framer-motion";

const MembersList = ({ communityMembers }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {communityMembers.length === 0 ? (
                <p className="text-gray-400 text-center col-span-full">No members in this community yet.</p>
            ) : (
                communityMembers.map((member) => (
                    <motion.div 
                        key={member._id}
                        className="p-4 bg-[#21262D] rounded-lg shadow-md hover:shadow-lg transition-all"
                        whileHover={{ scale: 1.02 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-xl font-bold text-white">
                                    {member.name ? member.name.charAt(0).toUpperCase() : '?'}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                                {member.techStack && member.techStack.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {member.techStack.map((tech, index) => (
                                            <span 
                                                key={index}
                                                className="px-2 py-1 text-xs bg-[#1E293B] text-gray-300 rounded"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))
            )}
        </div>
    );
};

export default MembersList;