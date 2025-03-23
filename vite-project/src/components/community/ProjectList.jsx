import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from './ProjectCard';

const ProjectList = ({ submittedProjects, expandedProject, toggleExpand, comments, newComment, setNewComment, handleCommentSubmit }) => {
    // console.log(submittedProjects,expandedProject,comments)
    return (
        submittedProjects.length === 0 ? (
            <p className="text-gray-400 text-center">No projects submitted yet.</p>
        ) : (
            <div className="grid gap-6 max-w-4xl mx-auto">
                {submittedProjects.map((project) => (
                    <ProjectCard 
                        key={project._id}
                        project={project}
                        isExpanded={expandedProject === project._id}
                        toggleExpand={toggleExpand}
                        comments={comments}
                        newComment={newComment}
                        setNewComment={setNewComment}
                        handleCommentSubmit={handleCommentSubmit}
                    />
                ))}
            </div>
        )
    );
};

export default ProjectList;