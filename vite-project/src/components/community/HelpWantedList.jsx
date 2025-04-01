import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

export default function HelpWantedList({ sharedProjects = [], onJoinProject }) {
  const [expandedProject, setExpandedProject] = useState(null);

  if (!sharedProjects || sharedProjects.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20 bg-black/20 rounded-xl border border-white/10"
      >
        <Users className="w-16 h-16 text-[#00ff9d]/30 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">No help wanted projects available at the moment.</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {Array.isArray(sharedProjects) && sharedProjects.map((project) => (
        <motion.div
          key={project?._id}
          className="bg-black/30 rounded-xl p-6 border border-white/10 hover:border-[#00ff9d]/30 transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-start gap-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">{project?.projectId?.title}</h3>
              <p className="text-gray-400 text-lg">{project?.description}</p>
              
              <div className="flex items-center gap-3 mt-4">
                <span className="text-[#00ff9d]">Posted by:</span>
                <span className="text-white">{project?.ownerName}</span>
              </div>

              <div className="mt-6">
                <h4 className="text-lg font-medium text-white mb-3">Tech Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {project?.projectId?.techStack?.map((tech, index) => (
                    <span 
                      key={index} 
                      className="px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-[#00ff9d]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setExpandedProject(expandedProject === project._id ? null : project._id)}
                className="mt-6 flex items-center gap-2 text-[#00ff9d] hover:text-[#00ff9d]/80 transition-colors"
              >
                {expandedProject === project._id ? (
                  <>
                    <ChevronUp className="w-5 h-5" />
                    <span>Hide Details</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-5 h-5" />
                    <span>Show Details</span>
                  </>
                )}
              </button>

              {expandedProject === project._id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 space-y-4"
                >
                  {project?.projectId?.steps?.map((step, stepIndex) => (
                    <div key={step._id} className="bg-black/40 p-6 rounded-xl border border-white/5">
                      <h5 className="text-lg font-medium text-white mb-3">
                        {stepIndex + 1}. {step.step}
                      </h5>
                      <ul className="space-y-2">
                        {step.subSteps.map((subStep, subStepIndex) => (
                          <li key={subStepIndex} className="text-gray-400 flex items-start gap-2">
                            <span className="w-2 h-2 mt-2 rounded-full bg-[#00ff9d]" />
                            <span>{subStep}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            <button
              onClick={() => project?._id && onJoinProject(project._id)}
              className="px-6 py-3 bg-[#00ff9d] text-black rounded-lg font-medium hover:bg-[#00ff9d]/90 transition-all duration-300 flex items-center gap-2"
            >
              <Users className="w-5 h-5" />
              Join Project
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <h4 className="text-lg font-medium text-white mb-3">Collaborators</h4>
            <div className="flex flex-wrap gap-3">
              {project?.collaborators?.map((collaborator, index) => (
                <span 
                  key={index} 
                  className="px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-[#00ff9d]" />
                  {collaborator?.name}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}