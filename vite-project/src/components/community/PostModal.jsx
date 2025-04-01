import React from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { X, Send, HelpCircle } from 'lucide-react';

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
    const validProjects = userProjects?.filter(project => 
        project && project.projectId && project.projectId.title
    ) || [];

    return (
        <AnimatePresence>
            {showModal && (
                <motion.div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div 
                        className="bg-black/90 border border-white/10 p-8 rounded-2xl w-full max-w-xl relative"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                    >
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="flex items-center gap-3 mb-8">
                            {isHelpWanted ? (
                                <HelpCircle className="w-8 h-8 text-[#00ff9d]" />
                            ) : (
                                <Send className="w-8 h-8 text-[#00ff9d]" />
                            )}
                            <h2 className="text-2xl font-bold text-white">
                                {isHelpWanted ? "Request Help with Project" : "Share Your Project"}
                            </h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-white font-medium mb-2">Select Project</label>
                                <select 
                                    onChange={(e) => handleProjectSelect(e.target.value)}
                                    className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-[#00ff9d] transition-colors"
                                >
                                    <option value="">Choose a project</option>
                                    {validProjects.map((project) => (
                                        <option key={project._id} value={project._id}>
                                            {project.projectId.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-white font-medium mb-2">
                                    {isHelpWanted ? "What help do you need?" : "Project Summary"}
                                </label>
                                <textarea 
                                    value={summary} 
                                    onChange={(e) => setSummary(e.target.value)}
                                    placeholder={isHelpWanted ? 
                                        "Describe what kind of help you're looking for..." : 
                                        "Share details about your project..."
                                    }
                                    className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-[#00ff9d] transition-colors min-h-[120px] resize-none"
                                />
                            </div>

                            {!isHelpWanted && (
                                <div>
                                    <label className="block text-white font-medium mb-2">Deployed Link</label>
                                    <input 
                                        type="text" 
                                        value={deployedLink} 
                                        onChange={(e) => setDeployedLink(e.target.value)}
                                        placeholder="https://your-project.com"
                                        className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-[#00ff9d] transition-colors"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-4 mt-8">
                            <button 
                                onClick={() => setShowModal(false)}
                                className="px-6 py-3 border border-white/10 rounded-xl text-white hover:bg-white/5 transition-all duration-300"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handlePublish}
                                className="px-6 py-3 bg-[#00ff9d] text-black rounded-xl font-medium hover:bg-[#00ff9d]/90 transition-all duration-300"
                            >
                                {isHelpWanted ? "Request Help" : "Publish"}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}