import React from 'react';
import { motion, AnimatePresence } from "framer-motion";

const ProjectCard = ({ project, isExpanded, toggleExpand, comments, newComment, setNewComment, handleCommentSubmit }) => {
    return (
        <motion.div 
            className="hover:shadow-lg shadow-blue-500/50 transition-all duration-300 ease-in-out"
            transition={{ duration: 2 }}
        >
            <div 
                className="p-5 border border-white bg-black rounded-lg shadow-md"
                onClick={() => toggleExpand(project._id)}
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">{project.projectId.title}</h2>
                    <div className="flex items-center gap-2">
                        <p className="text-gray-400">Created by:</p>
                        <p className="text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">{project.username}</p>
                    </div>
                </div>
                <p className="text-gray-400">{project.summary}</p>

                <div className="mt-4">
                    <span className="font-semibold text-gray-300">Community:</span>
                    <span className="bg-[#21262D] text-white px-3 py-1 text-sm rounded-lg ml-2">
                        {project.community}
                    </span>
                </div>

                {project.deploymentLink && (
                    <div className="mt-4">
                        <a href={project.deploymentLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                            View Deployed Project
                        </a>
                    </div>
                )}

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 p-4 bg-[#21262D] rounded-lg overflow-hidden"
                        >
                            <p className="text-gray-300">{project.projectId.description}</p>

                            <div className="mt-4">
                                <span className="font-semibold text-gray-300">Tech Stack:</span>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {project.projectId.techStack.map((tech, index) => (
                                        <span key={index} className="bg-[#1E293B] text-white px-3 py-1 text-sm rounded-lg">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4">
                                <span className="font-semibold text-gray-300">Project Steps:</span>
                                <ul className="list-disc pl-5 text-gray-400 mt-2">
                                    {project.projectId.steps.map((step) => (
                                        <li key={step._id}>
                                            <strong>{step.step}</strong>
                                            <ul className="list-disc pl-5 mt-1">
                                                {step.subSteps.map((subStep, index) => (
                                                    <li key={index} className="text-gray-500">{subStep}</li>
                                                ))}
                                            </ul>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-4 bg-[#161B22] p-4 rounded-lg" onClick={(e) => e.stopPropagation()}>
                                <div className="max-h-40 overflow-y-auto">
                                    {comments?.length > 0 ? (
                                        comments.map((comment) => (
                                            <div key={comment._id} className="p-2 border-b border-gray-700">
                                                <p className="text-sm text-blue-400">{comment.username}</p>
                                                <p className="text-gray-300">{comment.text}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400">No comments yet.</p>
                                    )}
                                </div>
                                <div className="mt-4">
                                    <input
                                        type="text"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Add a comment..."
                                        className="w-full p-2 rounded text-white bg-gray-800"
                                    />
                                    <button 
                                        onClick={() => handleCommentSubmit(project._id)}
                                        className="mt-2 px-6 py-3 text-lg font-bold bg-gray-800 text-white border border-gray-600 rounded-lg transition-all
                                            hover:bg-gray-700 hover:shadow-lg hover:shadow-gray-500/50"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default ProjectCard;