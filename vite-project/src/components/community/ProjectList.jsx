import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import ProjectCard from './ProjectCard';
import { FileText, Star } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ProjectList = ({ 
    submittedProjects, 
    expandedProject, 
    toggleExpand, 
    comments, 
    newComment, 
    setNewComment, 
    handleCommentSubmit,
    starredProjects,
    setStarredProjects,
    handleStarProject 
}) => {

    const handleStar = async (projectId) => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user) {
                toast.error("Please login to star projects");
                return;
            }

            const projectToStar = submittedProjects.find(p => p.projectId._id === projectId);
            console.log(projectToStar); // Add this line to check the value of projectToStar
            if (!projectToStar) {
                toast.error("Project not found");
                return;
            }

            const response = await axios.post(`http://localhost:5000/api/projects/${projectToStar.projectId._id}/star`, {
                userId: user._id
            });

            if (response.data.success) {
                setStarredProjects(prev => ({
                    ...prev,
                    [projectId]: {
                        count: response.data.starCount,
                        isStarred: response.data.isStarred
                    }
                }));

                // Call the parent component's handler
                handleStarProject && handleStarProject(projectId, response.data.isStarred);
                
                toast.success(response.data.isStarred ? "Project starred!" : "Project unstarred");
            }
        } catch (error) {
            console.error("Error starring project:", error);
            toast.error("Failed to update star status");
        }
    };

    useEffect(() => {
        const fetchStarStatus = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                if (!user) return;

                const response = await axios.get(`http://localhost:5000/api/projects/stars/${user._id}`);
                const starData = {};
                
                response.data.forEach(project => {
                    starData[project.projectId] = {
                        count: project.starCount,
                        isStarred: project.isStarred
                    };
                });
                
                setStarredProjects(starData);
            } catch (error) {
                console.error("Error fetching star status:", error);
            }
        };

        fetchStarStatus();
    }, []);

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
                <div key={project.projectId._id} className="relative">
                    {/* <button
                        onClick={() => handleStar(project.projectId._id)}
                        className="absolute top-4 right-4 z-10 flex items-center gap-2"
                    >
                        <Star
                            className={`w-5 h-5 ${
                                starredProjects[project.projectId._id]?.isStarred 
                                    ? "fill-yellow-400 text-yellow-400" 
                                    : "text-gray-400"
                            }`}
                        />
                        <span className="text-sm text-gray-400">
                            {starredProjects[project.projectId._id]?.count || 0}
                        </span>
                    </button> */}

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