import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function HelpWantedList({ sharedProjects = [], onJoinProject }) {
  const [expandedProject, setExpandedProject] = useState(null);

  if (!sharedProjects || sharedProjects.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        No help wanted projects available at the moment.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Array.isArray(sharedProjects) && sharedProjects.map((project) => (
        <motion.div
          key={project?._id}
          className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white">{project?.projectId?.title}</h3>
              <p className="text-gray-400 mt-2">{project?.description}</p>
              <div className="mt-3 text-sm text-gray-500">
                Posted by: {project?.ownerName}
              </div>
              
              {/* Tech Stack */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Tech Stack:</h4>
                <div className="flex flex-wrap gap-2">
                  {project?.projectId?.techStack?.map((tech, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-700 rounded-full text-sm text-blue-400">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project Steps */}
              <div className="mt-6">
                <button
                  onClick={() => setExpandedProject(expandedProject === project._id ? null : project._id)}
                  className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {expandedProject === project._id ? 'Hide Details' : 'Show Details'}
                </button>
                
                {expandedProject === project._id && (
                  <div className="mt-4 space-y-4">
                    {project?.projectId?.steps?.map((step, stepIndex) => (
                      <div key={step._id} className="bg-gray-900/50 p-4 rounded-lg">
                        <h5 className="text-white font-medium mb-2">
                          {stepIndex + 1}. {step.step}
                        </h5>
                        <ul className="list-disc list-inside space-y-1">
                          {step.subSteps.map((subStep, subStepIndex) => (
                            <li key={subStepIndex} className="text-gray-400 text-sm ml-4">
                              {subStep}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Join Button */}
            <button
              onClick={() => project?._id && onJoinProject(project._id)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Join Project
            </button>
          </div>

          {/* Collaborators */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-400">Collaborators:</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {project?.collaborators?.map((collaborator, index) => (
                <span key={index} className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">
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