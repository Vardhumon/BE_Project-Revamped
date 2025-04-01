import React from 'react';
import { motion } from "framer-motion";
import ProjectCard from './ProjectCard';
import { FileText } from 'lucide-react';

const ProjectList = ({ submittedProjects, expandedProject, toggleExpand, comments, newComment, setNewComment, handleCommentSubmit }) => {
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
    );
};

export default ProjectList;