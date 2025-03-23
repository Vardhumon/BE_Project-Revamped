import React from 'react';
import { motion } from "framer-motion";

const PostModal = ({ showModal, setShowModal, userProjects, handleProjectSelect, summary, setSummary, deployedLink, setDeployedLink, handlePublish }) => {
    return (
        showModal && (
            <motion.div 
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div 
                    className="bg-[#111] rounded-lg shadow-lg p-6 w-full max-w-lg"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    <h2 className="text-2xl font-bold text-white mb-4">Create a Post</h2>

                    <label className="block text-white font-medium mb-2">Select a Project:</label>
                    <select 
                        onChange={(e) => handleProjectSelect(e.target.value)}
                        className="w-full bg-[#222] border  border-gray-500 rounded-md p-2 mb-4 text-white focus:ring focus:ring-white focus:ring-opacity-50"
                    >
                        <option value="">Select a Project</option>
                        {userProjects.map((project) => (
                            <option key={project._id} value={project._id} className='text-white'>
                                {project.projectId.title}
                            </option>
                        ))}
                    </select>

                    <label className="block text-white font-medium mt-4">Summary:</label>
                    <textarea 
                        value={summary} 
                        onChange={(e) => setSummary(e.target.value)}
                        className="w-full bg-[#222] border border-gray-500 rounded-md p-2 mt-1 text-white focus:ring focus:ring-white focus:ring-opacity-50"
                    />

                    <label className="block text-white font-medium mt-4">Deployed Link:</label>
                    <input 
                        type="text" 
                        value={deployedLink} 
                        onChange={(e) => setDeployedLink(e.target.value)}
                        className="w-full bg-[#222] border border-gray-500 rounded-md p-2 mt-1 text-white focus:ring focus:ring-white focus:ring-opacity-50"
                    />

                    <div className="flex justify-between mt-6">
                        <motion.button 
                            onClick={handlePublish}
                            className="px-4 py-2 bg-white text-black font-semibold rounded-md shadow-lg transition-all hover:bg-gray-200 focus:ring-4 focus:ring-white focus:ring-opacity-50"
                            whileHover={{ scale: 1.05, boxShadow: "0px 0px 10px rgba(255,255,255,0.6)" }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Publish
                        </motion.button>
                        <motion.button 
                            onClick={() => setShowModal(false)}
                            className="px-4 py-2 bg-white text-black font-semibold rounded-md shadow-lg transition-all hover:bg-gray-200 focus:ring-4 focus:ring-white focus:ring-opacity-50"
                            whileHover={{ scale: 1.05, boxShadow: "0px 0px 10px rgba(255,255,255,0.6)" }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Cancel
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        )
    );
};

export default PostModal;