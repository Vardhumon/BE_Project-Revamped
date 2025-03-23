import React from 'react';
import { AnimatePresence, motion } from "framer-motion";

export default function PostModal({ 
    showModal, 
    setShowModal, 
    userProjects, 
    handleProjectSelect, 
    summary, 
    setSummary, 
    deployedLink, 
    setDeployedLink, 
    handlePublish, 
    isHelpWanted 
}) {
    // Filter out invalid projects
    const validProjects = userProjects?.filter(project => 
        project && project.projectId && project.projectId.title
    ) || [];

    return (
        <AnimatePresence>
            {showModal && (
                <motion.div 
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div 
                        className="bg-gray-900 p-8 rounded-xl w-full max-w-md"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                    >
                        <h2 className="text-2xl font-bold mb-6 text-white">
                            {isHelpWanted ? "Request Help with Project" : "Share Your Project"}
                        </h2>

                        <label className="block text-white font-medium mb-2">Select a Project:</label>
                        <select 
                            onChange={(e) => handleProjectSelect(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 mb-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select a Project</option>
                            {validProjects.map((project) => (
                                <option key={project._id} value={project._id}>
                                    {project.projectId.title}
                                </option>
                            ))}
                        </select>

                        <label className="block text-white font-medium mt-4">
                            {isHelpWanted ? "What help do you need?" : "Project Summary:"}
                        </label>
                        <textarea 
                            value={summary} 
                            onChange={(e) => setSummary(e.target.value)}
                            placeholder={isHelpWanted ? 
                                "Describe what kind of help you're looking for..." : 
                                "Share details about your project..."
                            }
                            className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 mt-1 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                        />

                        {!isHelpWanted && (
                            <>
                                <label className="block text-white font-medium mt-4">Deployed Link:</label>
                                <input 
                                    type="text" 
                                    value={deployedLink} 
                                    onChange={(e) => setDeployedLink(e.target.value)}
                                    placeholder="https://your-project.com"
                                    className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 mt-1 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </>
                        )}

                        <div className="flex justify-end gap-4 mt-6">
                            <motion.button 
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-700 text-white font-semibold rounded-md hover:bg-gray-600 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Cancel
                            </motion.button>
                            <motion.button 
                                onClick={handlePublish}
                                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isHelpWanted ? "Request Help" : "Publish"}
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}