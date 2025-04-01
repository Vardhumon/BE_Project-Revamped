import React from 'react';
import { motion } from "framer-motion";
import { Users } from 'lucide-react';

const MembersList = ({ communityMembers }) => {
    if (communityMembers.length === 0) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-black/20 rounded-xl border border-white/10"
            >
                <Users className="w-16 h-16 text-[#00ff9d]/30 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No members in this community yet.</p>
            </motion.div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communityMembers.map((member, index) => (
                <motion.div 
                    key={member._id}
                    className="p-6 bg-black/30 rounded-xl border border-white/10 hover:border-[#00ff9d]/30 transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00ff9d] to-[#00ff9d]/50 flex items-center justify-center text-black text-2xl font-bold">
                            {member.name ? member.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">{member.name}</h3>
                            <p className="text-gray-400">Member</p>
                        </div>
                    </div>

                    {member.techStack && member.techStack.length > 0 && (
                        <div className="mt-6">
                            <h4 className="text-sm font-medium text-gray-400 mb-3">Tech Stack</h4>
                            <div className="flex flex-wrap gap-2">
                                {member.techStack.map((tech, index) => (
                                    <span 
                                        key={index}
                                        className="px-3 py-1.5 bg-black/50 border border-white/10 rounded-lg text-[#00ff9d] text-sm"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
    );
};

export default MembersList;