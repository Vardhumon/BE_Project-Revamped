import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, CheckCircle, Circle } from 'lucide-react';

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
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00ff9d]"></div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#00ff9d]/10 flex items-center justify-center">
          <Circle className="w-8 h-8 text-[#00ff9d]" />
        </div>
        <h3 className="text-xl font-medium text-white mb-2">No Projects Yet</h3>
        <p className="text-gray-400">Start a new project to track your progress</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {projects.map((project, index) => (
        <ProjectCard
          key={project.projectId._id}
          project={project}
          expanded={expandedProject === project.projectId._id}
          setExpanded={() => setExpandedProject(expandedProject === project.projectId._id ? null : project.projectId._id)}
          isStepCompleted={isStepCompleted}
          isSubStepCompleted={isSubStepCompleted}
          toggleMainStep={toggleMainStep}
          toggleSubStep={toggleSubStep}
          handleSubmit={handleSubmit}
        />
      ))}
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
      className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden transition-all duration-300 hover:border-[#00ff9d]/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div 
        className="p-6 cursor-pointer flex items-start justify-between"
        onClick={setExpanded}
      >
        <div>
          <h2 className="text-xl font-bold text-white mb-2">{project.projectId.title}</h2>
          <p className="text-gray-400">{project.projectId.description}</p>
        </div>
        <button className="text-[#00ff9d] p-2 hover:bg-[#00ff9d]/10 rounded-lg transition-colors">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>
      
      {expanded && (
        <div className="border-t border-gray-800 p-6">
          <div className="space-y-6">
            {project.projectId.steps.map((step, idx) => (
              <div key={idx} className="bg-black/30 rounded-xl p-4">
                <div 
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => toggleMainStep(project.projectId._id, step._id, step.subSteps)}
                >
                  <div className="text-[#00ff9d]">
                    {isStepCompleted(project.projectId._id, step._id, step.subSteps) ? 
                      <CheckCircle className="w-5 h-5" /> : 
                      <Circle className="w-5 h-5" />
                    }
                  </div>
                  <h3 className="text-lg font-medium text-white">{step.step}</h3>
                </div>

                <div className="mt-4 ml-8 space-y-3">
                  {step.subSteps.map((subStep, id) => (
                    <div 
                      key={id}
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => toggleSubStep(project.projectId._id, step._id, subStep)}
                    >
                      <div className="text-[#00ff9d]">
                        {isSubStepCompleted(project.projectId._id, step._id, subStep) ? 
                          <CheckCircle className="w-4 h-4" /> : 
                          <Circle className="w-4 h-4" />
                        }
                      </div>
                      <span className="text-gray-300">{subStep}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => handleSubmit(project.projectId._id)}
            className="mt-6 px-6 py-3 bg-[#00ff9d] text-black rounded-xl font-medium hover:bg-[#00ff9d]/90 transition-all duration-300 flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Save Progress
          </button>
        </div>
      )}
    </motion.div>
  );
}