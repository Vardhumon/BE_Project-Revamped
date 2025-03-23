import React from 'react';
import { motion } from 'framer-motion';

export default function ProjectsTab({ 
  loading, 
  projects, 
  expandedProject, 
  setExpandedProject,
  isStepCompleted,
  isSubStepCompleted,
  toggleMainStep,
  toggleSubStep,
  handleSubmit 
}) {
  return (
    <div className="mt-6">
      {loading ? (
        <p className="text-gray-400">Loading projects...</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-300">No projects assigned yet.</p>
      ) : (
        projects.map((project, index) => (
          <ProjectCard
            key={index}
            project={project}
            expanded={expandedProject === project.projectId._id}
            setExpanded={() => setExpandedProject(expandedProject === project.projectId._id ? null : project.projectId._id)}
            isStepCompleted={isStepCompleted}
            isSubStepCompleted={isSubStepCompleted}
            toggleMainStep={toggleMainStep}
            toggleSubStep={toggleSubStep}
            handleSubmit={handleSubmit}
          />
        ))
      )}
    </div>
  );
}

function ProjectCard({ 
  project, 
  expanded, 
  setExpanded, 
  isStepCompleted,
  isSubStepCompleted,
  toggleMainStep,
  toggleSubStep,
  handleSubmit 
}) {
  return (
    <motion.div 
      className="w-full p-5 border border-white bg-black rounded-lg shadow-md mt-4" 
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-lg text-white font-semibold cursor-pointer" onClick={setExpanded}>
        {project.projectId.title}
      </h2>
      <p className="text-gray-300 mt-1">{project.projectId.description}</p>
      
      {expanded && (
        <div className="mt-4">
          {project.projectId.steps.map((step, idx) => (
            <div key={idx} className="mb-3">
              {/* Step content */}
            </div>
          ))}
          <button 
            onClick={() => handleSubmit(project.projectId._id)} 
            className="px-6 py-3 text-lg font-bold bg-gray-800 text-white border border-gray-600 rounded-lg transition-all hover:bg-gray-700 hover:shadow-lg hover:shadow-gray-500/50"
          >
            Submit Progress
          </button>
        </div>
      )}
    </motion.div>
  );
}