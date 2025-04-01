import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, ChevronDown, ChevronUp, ExternalLink, Send } from 'lucide-react';

const ProjectCard = ({ project, isExpanded, toggleExpand, comments, newComment, setNewComment, handleCommentSubmit }) => {
    return (
        <motion.div 
            className="bg-black/30 rounded-xl border border-white/10 hover:border-[#00ff9d]/30 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="p-6" onClick={() => toggleExpand(project._id)}>
                <div className="flex items-start justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">{project.projectId.title}</h2>
                        <p className="text-gray-400 text-lg">{project.summary}</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[#00ff9d]">{project.username}</span>
                        <span className="text-sm text-gray-500">Creator</span>
                    </div>
                </div>

                <div className="mt-6 flex items-center gap-4">
                    <span className="px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-[#00ff9d]">
                        {project.community}
                    </span>
                    
                    {project.deploymentLink && (
                        <a 
                            href={project.deploymentLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-2 text-white hover:text-[#00ff9d] transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ExternalLink className="w-4 h-4" />
                            View Live
                        </a>
                    )}
                </div>

                <button
                    className="mt-6 flex items-center gap-2 text-[#00ff9d] hover:text-[#00ff9d]/80 transition-colors"
                >
                    {isExpanded ? (
                        <>
                            <ChevronUp className="w-5 h-5" />
                            <span>Show Less</span>
                        </>
                    ) : (
                        <>
                            <ChevronDown className="w-5 h-5" />
                            <span>Show More</span>
                        </>
                    )}
                </button>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-6 space-y-6"
                        >
                            <div className="p-6 bg-black/40 rounded-xl border border-white/5">
                                <p className="text-gray-300">{project.projectId.description}</p>
                            </div>

                            <div>
                                <h4 className="text-lg font-medium text-white mb-3">Tech Stack</h4>
                                <div className="flex flex-wrap gap-2">
                                    {project.projectId.techStack.map((tech, index) => (
                                        <span 
                                            key={index} 
                                            className="px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-[#00ff9d]"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-lg font-medium text-white mb-3">Project Steps</h4>
                                <div className="space-y-4">
                                    {project.projectId.steps.map((step, index) => (
                                        <div key={step._id} className="p-6 bg-black/40 rounded-xl border border-white/5">
                                            <h5 className="text-lg font-medium text-white mb-3">
                                                {index + 1}. {step.step}
                                            </h5>
                                            <ul className="space-y-2">
                                                {step.subSteps.map((subStep, subIndex) => (
                                                    <li key={subIndex} className="text-gray-400 flex items-start gap-2">
                                                        <span className="w-2 h-2 mt-2 rounded-full bg-[#00ff9d]" />
                                                        <span>{subStep}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 bg-black/40 rounded-xl border border-white/5" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center gap-2 mb-4">
                                    <MessageCircle className="w-5 h-5 text-[#00ff9d]" />
                                    <h4 className="text-lg font-medium text-white">Comments</h4>
                                </div>

                                <div className="max-h-60 overflow-y-auto space-y-4 mb-6">
                                    {comments?.length > 0 ? (
                                        comments.map((comment) => (
                                            <div key={comment._id} className="p-4 bg-black/30 rounded-lg border border-white/5">
                                                <p className="text-[#00ff9d] mb-1">{comment.username}</p>
                                                <p className="text-gray-300">{comment.text}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400">No comments yet.</p>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Add a comment..."
                                        className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#00ff9d] transition-colors"
                                    />
                                    <button 
                                        onClick={() => handleCommentSubmit(project._id)}
                                        className="px-6 py-3 bg-[#00ff9d] text-black rounded-xl font-medium hover:bg-[#00ff9d]/90 transition-all duration-300 flex items-center gap-2"
                                    >
                                        <Send className="w-4 h-4" />
                                        Send
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