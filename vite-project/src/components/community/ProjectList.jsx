import React, { useState } from 'react';
import { motion } from "framer-motion";
import ProjectCard from './ProjectCard';
import { FileText, Star } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ProjectList = ({ submittedProjects, expandedProject, toggleExpand, comments, newComment, setNewComment, handleCommentSubmit ,starredProjects
    ,setStarredProjects
}) => {

    const handleStar = async (projectId) => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const pathParts = window.location.pathname.split("/");
            const community = pathParts[pathParts.length - 1] || "Other";
            
            const response = await axios.post(`http://localhost:5000/api/projects/${projectId}/star`, {
                userId: user._id
            });

            setStarredProjects(prev => ({
                ...prev,
                [projectId]: {
                    count: response.data.starCount,
                    isStarred: response.data.isStarred
                }
            }));

            toast.success(response.data.isStarred ? "Project starred!" : "Project unstarred");
        } catch (error) {
            console.error("Error starring project:", error);
            toast.error("Failed to update star status");
        }
    };

    if (submittedProjects.length === 0) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-black/20 rounded-xl border border-white/10"
            >
                <FileText className="w-16 h-16 text-[#00ff9d]/30 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No projects submitted yet.</p>
            </motion.div>
        );
    }

    return (
        <div className="space-y-6">
            {submittedProjects.map((project) => (
                <div key={project._id} className="relative">
                    <button
                        onClick={() => handleStar(project._id)}
                        className="absolute top-4 right-4 z-10 flex items-center gap-2"
                    >
                        <Star
                            className={`w-5 h-5 ${
                                starredProjects[project._id]?.isStarred 
                                    ? "fill-yellow-400 text-yellow-400" 
                                    : "text-gray-400"
                            }`}
                        />
                        <span className="text-sm text-gray-400">
                            {starredProjects[project._id]?.count || project.stars?.length || 0}
                        </span>
                    </button>

                    <ProjectCard 
                        project={project}
                        isExpanded={expandedProject === project._id}
                        toggleExpand={toggleExpand}
                        comments={comments}
                        newComment={newComment}
                        setNewComment={setNewComment}
                        handleCommentSubmit={handleCommentSubmit}
                    />
                </div>
            ))}
        </div>
    );
};

export default ProjectList;