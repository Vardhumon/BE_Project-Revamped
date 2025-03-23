import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import ProfileTab from "./components/profile/ProfileTab";
import ProjectsTab from "./components/profile/ProjectsTab";

export default function Profile() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedProject, setExpandedProject] = useState(null);
  const [completedSteps, setCompletedSteps] = useState({});
  const [editing, setEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    bio: "",
    techStack: "",
    experienceLevel: "",
    hobbies: "",
    education: "",
  });
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  // Function to fetch project data and progress
  const fetchUserProjectsAndProgress = () => {
    const userId = JSON.parse(localStorage.getItem("user"))._id;
    
    // First, fetch projects with their steps
    axios.post("http://localhost:5000/api/getUserProjects", {
      userId: userId,
    })
    .then((res) => {
      setProjects(res.data.projects);
      axios.post("http://localhost:5000/api/profile", {
        userId: userId,
      })
      .then((userRes) => {
        const userData = userRes.data;
        // console.log(userData)
        if (userData.projects && userData.projects.length > 0) {
          const newCompletedSteps = {};
          // console.log("inside")

          userData.projects.forEach(userProject => {
            const projectId = userProject.projectId.$oid || userProject.projectId;
            // console.log(projectId)
            const projectData = res.data.projects.find(p => 
              (p.projectId._id === projectId) || (p.projectId._id.$oid === projectId)
            );
            // console.log(projectData)
            
            if (projectData && projectData.projectId.steps) {
              newCompletedSteps[projectId] = {};
              // console.log("inside")
              projectData.projectId.steps.forEach(step => {
                newCompletedSteps[projectId][step._id] = [];
              });
              
              // Mark completed tasks from user data
              if (userProject.tasks && userProject.tasks.length > 0) {
                userProject.tasks.forEach(task => {
                  if (task.completed) {
                    // Find which step this task belongs to
                    const taskId = task.taskId.$oid || task.taskId;
                    
                    // Find step that contains this task
                    projectData.projectId.steps.forEach(step => {
                      // If this step has a matching subStep for this task, add it to completed
                      // This mapping needs to be adjusted based on how tasks relate to steps/substeps
                      if (step.subSteps && step.subSteps.length > 0) {
                        // Assuming taskId maps to a specific substep
                        // This logic might need to be adjusted based on your data structure
                        step.subSteps.forEach(subStep => {
                          // Simple matching - you may need a more sophisticated approach
                          if (subStep.includes(taskId) || taskId.includes(subStep)) {
                            newCompletedSteps[projectId][step._id].push(subStep);
                          }
                        });
                      }
                    });
                  }
                });
              }
            }
          });
          
          setCompletedSteps(newCompletedSteps);
          // console.log(newCompletedSteps);
        }
        
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching user data:", err);
        setLoading(false);
      });
    })
    .catch((err) => {
      console.error("Error fetching projects:", err);
      toast.error("Failed to load projects");
      setLoading(false);
    });
  };

  const fetchUserProfile = () => {
    const userId = JSON.parse(localStorage.getItem("user"))._id;
    
    axios.post("http://localhost:5000/api/profile", {
      userId: userId,
    })
    .then((res) => {
      setUserInfo(res.data);
    })
    .catch((err) => {
      console.error("Error fetching user profile:", err);
      toast.error("Failed to load profile information");
    });
  };

  useEffect(() => {
    fetchUserProjectsAndProgress();
    fetchUserProfile();
  }, []);

  const isStepCompleted = (projectId, stepId, subSteps) => {
    if (!completedSteps[projectId] || !completedSteps[projectId][stepId]) {
      return false;
    }
    
    return subSteps.length > 0 && 
      subSteps.every(subStep => 
        completedSteps[projectId][stepId].includes(subStep)
      );
  };
  
  const isSubStepCompleted = (projectId, stepId, subStep) => {
    if (!completedSteps[projectId] || !completedSteps[projectId][stepId]) {
      return false;
    }
    
    return completedSteps[projectId][stepId].includes(subStep);
  };
  
  const toggleMainStep = (projectId, stepId, subSteps) => {
    const newCompletedSteps = { ...completedSteps };
    
    if (!newCompletedSteps[projectId]) {
      newCompletedSteps[projectId] = {};
    }
    
    const isCompleted = isStepCompleted(projectId, stepId, subSteps);
    
    if (isCompleted) {
      newCompletedSteps[projectId][stepId] = [];
    } else {
      newCompletedSteps[projectId][stepId] = [...subSteps];
    }
    
    setCompletedSteps(newCompletedSteps);
  };
  
  const toggleSubStep = (projectId, stepId, subStep) => {
    const newCompletedSteps = { ...completedSteps };
    if (!newCompletedSteps[projectId]) {
      newCompletedSteps[projectId] = {};
    }
    
    if (!newCompletedSteps[projectId][stepId]) {
      newCompletedSteps[projectId][stepId] = [];
    }
    
    const isCompleted = isSubStepCompleted(projectId, stepId, subStep);
    
    if (isCompleted) {
      newCompletedSteps[projectId][stepId] = 
        newCompletedSteps[projectId][stepId].filter(item => item !== subStep);
    } else {
      newCompletedSteps[projectId][stepId] = 
        [...newCompletedSteps[projectId][stepId], subStep];
    }
    
    setCompletedSteps(newCompletedSteps);
  };

  const handleSubmit = (projectId) => {
    const completed = completedSteps[projectId] || {};
    const userId = JSON.parse(localStorage.getItem("user"))._id;
    
    const tasksToUpdate = [];
    
    const projectData = projects.find(p => p.projectId._id === projectId);
    
    if (projectData && projectData.projectId.steps) {
      projectData.projectId.steps.forEach(step => {
        // Create a task entry for the main step
        tasksToUpdate.push({
          taskId: step._id,
          completed: isStepCompleted(projectId, step._id, step.subSteps)
        });
        
        // Create task entries for each substep
        if (step.subSteps && step.subSteps.length > 0) {
          step.subSteps.forEach(subStep => {
            tasksToUpdate.push({
              taskId: step._id, // Use the step._id as the taskId
              subTask: subStep,
              completed: isSubStepCompleted(projectId, step._id, subStep)
            });
          });
        }
      });
    }
    
    axios.post("http://localhost:5000/api/update-tasks", { // Updated endpoint
      userId,
      projectId,
      completedSteps: tasksToUpdate
    })
    .then(() => {
      toast.success("Progress saved successfully!");
      fetchUserProjectsAndProgress();
    })
    .catch((err) => {
      console.error("Error saving progress:", err);
      toast.error("Failed to save progress.");
    });
};

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSave = () => {
    axios.post("http://localhost:5000/api/update", {
      userId: JSON.parse(localStorage.getItem("user"))._id,
      ...userInfo,
    })
    .then(() => {
      toast.success("Profile updated successfully!");
      setEditing(false);
      
      // Refresh user profile after saving
      fetchUserProfile();
    })
    .catch((err) => {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile.");
      setEditing(false);
    });
  }
  
  return (
    <motion.div 
  className="max-w-6xl bg-red-800 mx-auto p-8 rounded-2xl mt-14 relative overflow-hidden"
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  style={{
    background: "linear-gradient(to bottom right, #000000, #1a1a1a, #333333)", 
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)"
  }}
>
  <Toaster position="top-right" />
  
  {/* Background elements for visual interest */}
  <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" 
       style={{ background: "radial-gradient(circle, #4361ee, transparent)", transform: "translate(30%, -30%)" }} />
  <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full opacity-10" 
       style={{ background: "radial-gradient(circle, #3f37c9, transparent)", transform: "translate(-20%, 20%)" }} />
  
  {/* Tabs */}
  <div className="flex space-x-6 border-b border-gray-700/50 pb-3 mb-6 relative z-10">
    <button 
      className={`px-5 py-2.5 rounded-t-lg transition-all duration-300 font-medium ${activeTab === "profile" 
        ? "border-b-2 border-blue-400 text-blue-400" 
        : "text-gray-400 hover:text-gray-200"}`} 
      onClick={() => setActiveTab("profile")}
    >
      Profile
    </button>
    <button 
      className={`px-5 py-2.5 rounded-t-lg transition-all duration-300 font-medium ${activeTab === "projects" 
        ? "border-b-2 border-blue-400 text-blue-400" 
        : "text-gray-400 hover:text-gray-200"}`} 
      onClick={() => setActiveTab("projects")}
    >
      Projects
    </button>
    <div className="flex-grow"></div>
    <button 
      className="px-5 py-2.5 text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md flex items-center gap-2" 
      onClick={handleLogout}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      Logout 
    </button>
  </div>

  {activeTab === "profile" ? (
    <div className="mt-6 relative z-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">My Profile</h1>
        <button 
          onClick={() => setEditing(!editing)}
          className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm ${
            editing 
              ? "text-gray-300 hover:text-white" 
              : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md"
          }`}
        >
          {editing ? (
            "Cancel"
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Profile
            </>
          )}
        </button>
      </div>
    
      {editing ? (
        <div className="mt-6 space-y-4 bg-gray-900/50 p-6 rounded-xl backdrop-blur-sm border border-gray-800">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={userInfo.name}
              onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
              className="w-full p-3 bg-gray-800/70 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Bio</label>
            <textarea
              placeholder="Tell us about yourself"
              value={userInfo.bio}
              onChange={(e) => setUserInfo({ ...userInfo, bio: e.target.value })}
              className="w-full p-3 bg-gray-800/70 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300 min-h-[100px]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Tech Stack</label>
            <input
              type="text"
              placeholder="React, Node.js, MongoDB, etc."
              value={userInfo.techStack && Array.isArray(userInfo.techStack) ? userInfo.techStack.join(", ") : ""}
              onChange={(e) => setUserInfo({ ...userInfo, techStack: e.target.value.split(", ") })}
              className="w-full p-3 bg-gray-800/70 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Experience Level</label>
            <input
              type="text"
              placeholder="Junior, Mid-level, Senior, etc."
              value={userInfo.experienceLevel}
              onChange={(e) => setUserInfo({ ...userInfo, experienceLevel: e.target.value })}
              className="w-full p-3 bg-gray-800/70 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Education</label>
            <input
              type="text"
              placeholder="Your educational background"
              value={userInfo.education}
              onChange={(e) => setUserInfo({ ...userInfo, education: e.target.value })}
              className="w-full p-3 bg-gray-800/70 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Hobbies</label>
            <input
              type="text"
              placeholder="What do you enjoy outside of coding?"
              value={userInfo.hobbies}
              onChange={(e) => setUserInfo({ ...userInfo, hobbies: e.target.value })}
              className="w-full p-3 bg-gray-800/70 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
            />
          </div>
          
          <div className="pt-4">
            <button 
              onClick={handleSave} 
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-6 py-3 rounded-lg text-white font-medium shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900/50 p-6 rounded-xl backdrop-blur-sm border border-gray-800 transition-all duration-300 hover:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-lg bg-blue-500/20 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">{userInfo.name || "Your Name"}</h2>
            </div>
            <div className="mt-2">
              <h3 className="text-md font-medium text-gray-400">Bio</h3>
              <p className="mt-1 text-gray-300">{userInfo.bio || "Tell us about yourself..."}</p>
            </div>
          </div>

          <div className="bg-gray-900/50 p-6 rounded-xl backdrop-blur-sm border border-gray-800 transition-all duration-300 hover:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-lg bg-purple-500/20 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Tech Stack</h3>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {userInfo.techStack && Array.isArray(userInfo.techStack) && userInfo.techStack.length > 0 ? 
                userInfo.techStack.map((tech, index) => (
                  tech.trim() && (
                    <span key={index} className="px-3 py-1 bg-gray-800 text-blue-300 rounded-full text-sm">
                      {tech.trim()}
                    </span>
                  )
                )) : 
                <p className="text-gray-400">No technologies added yet</p>
              }
            </div>
          </div>

          <div className="bg-gray-900/50 p-6 rounded-xl backdrop-blur-sm border border-gray-800 transition-all duration-300 hover:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-lg bg-green-500/20 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Experience Level</h3>
            </div>
            <p className="mt-1 text-gray-300">{userInfo.experienceLevel || "Not specified"}</p>
          </div>

          <div className="bg-gray-900/50 p-6 rounded-xl backdrop-blur-sm border border-gray-800 transition-all duration-300 hover:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-lg bg-yellow-500/20 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Education</h3>
            </div>
            <p className="mt-1 text-gray-300">{userInfo.education || "Not specified"}</p>
          </div>

          <div className="bg-gray-900/50 p-6 rounded-xl backdrop-blur-sm border border-gray-800 md:col-span-2 transition-all duration-300 hover:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-lg bg-pink-500/20 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Hobbies</h3>
            </div>
            <p className="mt-1 text-gray-300">{userInfo.hobbies || "Not specified"}</p>
          </div>
        </div>
      )}
    </div>
      
      ) : (
        <div className="mt-6">
          {loading ? (
            <p className="text-gray-400">Loading projects...</p>
          ) : projects.length === 0 ? (
            <p className="text-gray-300">No projects assigned yet.</p>
          ) : (
            projects.map((project, index) => (
              <motion.div key={index} className="w-full p-5 border border-white bg-black rounded-lg shadow-md mt-4" whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h2 className="text-lg text-white font-semibold cursor-pointer" onClick={() => setExpandedProject(expandedProject === project.projectId._id ? null : project.projectId._id)}>
                  {project.projectId.title}
                </h2>
                <p className="text-gray-300 mt-1">{project.projectId.description}</p>
                {expandedProject === project.projectId._id && (
                  <div className="mt-4">
                    {project.projectId.steps.map((step, idx) => (
                      <div key={idx} className="mb-3">
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            checked={isStepCompleted(project.projectId._id, step._id, step.subSteps)}
                            onChange={() => toggleMainStep(project.projectId._id, step._id, step.subSteps)}
                            className="cursor-pointer h-4 w-4"
                          />
                          <h3 className="text-white font-medium">{step.step}</h3>
                        </div>
                        <ul className="ml-4 mt-2 space-y-2">
                          {step.subSteps.map((subStep, id) => (
                            <li key={id} className="flex items-center space-x-2 text-gray-300">
                              <input 
                                type="checkbox" 
                                checked={isSubStepCompleted(project.projectId._id, step._id, subStep)}
                                onChange={() => toggleSubStep(project.projectId._id, step._id, subStep)}
                                className="cursor-pointer h-4 w-4"
                              />
                              <span>{subStep}</span>
                            </li> 
                          ))}
                        </ul>
                      </div>
                    ))}
                    <button 
                      onClick={() => handleSubmit(project.projectId._id)} 
                      className="px-6 py-3 text-lg font-bold bg-gray-800 text-white border border-gray-600 rounded-lg transition-all
                      hover:bg-gray-700 hover:shadow-lg hover:shadow-gray-500/50">
                      Submit Progress
                    </button>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      )}
    </motion.div>
  );
}








// {/* <motion.div className="max-w-5xl mx-auto p-6 bg-black text-white shadow-lg rounded-xl mt-10 relative"
//       initial={{ opacity: 0, y: 50 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}>
//         <Toaster />
//       {/* Tabs */}
//       <div className="flex space-x-6 border-b border-gray-700 pb-2">
//         <button className={`px-4 py-2 ${activeTab === "profile" ? "border-b-2 border-white" : "text-gray-400"}`} onClick={() => setActiveTab("profile")}>
//           Profile
//         </button>
//         <button className={`px-4 py-2 ${activeTab === "projects" ? "border-b-2 border-white" : "text-gray-400"}`} onClick={() => setActiveTab("projects")}>
//           Projects
//         </button>
//         <button className="px-4 py-2 text-white bg-red-600 rounded-lg" onClick={handleLogout}>
//           Logout 
//         </button>
//       </div>

//       {activeTab === "profile" ? (
//         <div className="mt-6">
//         <div className="flex justify-between items-center">
//           <h1 className="text-2xl font-bold">My Profile</h1>
//           <div className="cursor-pointer text-white/50 hover:text-white" onClick={() => setEditing(!editing)}>Edit</div>
//         </div>
      
//         {editing ? (
//           <div className="mt-4 space-y-3">
//             <input
//               type="text"
//               placeholder="Name"
//               value={userInfo.name}
//               onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
//               className="w-full p-2 bg-gray-800 text-white rounded"
//             />
//             <textarea
//               placeholder="Bio"
//               value={userInfo.bio}
//               onChange={(e) => setUserInfo({ ...userInfo, bio: e.target.value })}
//               className="w-full p-2 bg-gray-800 text-white rounded"
//             />
//             <input
//               type="text"
//               placeholder="Tech Stack (comma-separated)"
//               value={userInfo.techStack && Array.isArray(userInfo.techStack) ? userInfo.techStack.join(", ") : ""}
//               onChange={(e) => setUserInfo({ ...userInfo, techStack: e.target.value.split(", ") })}
//               className="w-full p-2 bg-gray-800 text-white rounded"
//             />
//             <input
//               type="text"
//               placeholder="Experience Level"
//               value={userInfo.experienceLevel}
//               onChange={(e) => setUserInfo({ ...userInfo, experienceLevel: e.target.value })}
//               className="w-full p-2 bg-gray-800 text-white rounded"
//             />
//             <input
//               type="text"
//               placeholder="Education"
//               value={userInfo.education}
//               onChange={(e) => setUserInfo({ ...userInfo, education: e.target.value })}
//               className="w-full p-2 bg-gray-800 text-white rounded"
//             />
//             <input
//               type="text"
//               placeholder="Hobbies"
//               value={userInfo.hobbies}
//               onChange={(e) => setUserInfo({ ...userInfo, hobbies: e.target.value })}
//               className="w-full p-2 bg-gray-800 text-white rounded"
//             />
//             <button onClick={handleSave} className="bg-blue-500 px-4 py-2 rounded text-white mt-2">Save</button>
//           </div>
//         ) : (
//           <div className="mt-4 space-y-4 text-gray-300">
//             <h2 className="text-2xl font-bold text-white">{userInfo.name || "Not set"}</h2>

//             <div>
//               <h3 className="text-lg font-semibold text-white">Bio</h3>
//               <p>{userInfo.bio || "Not set"}</p>
//             </div>

//             <div>
//               <h3 className="text-lg font-semibold text-white">Tech Stack</h3>
//               <p>{userInfo.techStack && Array.isArray(userInfo.techStack) && userInfo.techStack.length > 0 ? userInfo.techStack.join(", ") : "Not set"}</p>
//             </div>

//             <div>
//               <h3 className="text-lg font-semibold text-white">Experience Level</h3>
//               <p>{userInfo.experienceLevel || "Not set"}</p>
//             </div>

//             <div>
//               <h3 className="text-lg font-semibold text-white">Education</h3>
//               <p>{userInfo.education || "Not set"}</p>
//             </div>

//             <div>
//               <h3 className="text-lg font-semibold text-white">Hobbies</h3>
//               <p>{userInfo.hobbies || "Not set"}</p>
//             </div>
//           </div>
//         )}
//       </div>
      
//       ) : (
//         <div className="mt-6">
//           {loading ? (
//             <p className="text-gray-400">Loading projects...</p>
//           ) : projects.length === 0 ? (
//             <p className="text-gray-300">No projects assigned yet.</p>
//           ) : (
//             projects.map((project, index) => (
//               <motion.div key={index} className="w-full p-5 border border-white bg-black rounded-lg shadow-md mt-4" whileHover={{ scale: 1.02 }}
//                 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
//                 <h2 className="text-lg font-semibold cursor-pointer" onClick={() => setExpandedProject(expandedProject === project.projectId._id ? null : project.projectId._id)}>
//                   {project.projectId.title}
//                 </h2>
//                 <p className="text-gray-300 mt-1">{project.projectId.description}</p>
//                 {expandedProject === project.projectId._id && (
//                   <div className="mt-4">
//                     {project.projectId.steps.map((step, idx) => (
//                       <div key={idx} className="mb-3">
//                         <div className="flex items-center space-x-2">
//                           <input 
//                             type="checkbox" 
//                             checked={isStepCompleted(project.projectId._id, step._id, step.subSteps)}
//                             onChange={() => toggleMainStep(project.projectId._id, step._id, step.subSteps)}
//                             className="cursor-pointer h-4 w-4"
//                           />
//                           <h3 className="text-white font-medium">{step.step}</h3>
//                         </div>
//                         <ul className="ml-4 mt-2 space-y-2">
//                           {step.subSteps.map((subStep, id) => (
//                             <li key={id} className="flex items-center space-x-2 text-gray-300">
//                               <input 
//                                 type="checkbox" 
//                                 checked={isSubStepCompleted(project.projectId._id, step._id, subStep)}
//                                 onChange={() => toggleSubStep(project.projectId._id, step._id, subStep)}
//                                 className="cursor-pointer h-4 w-4"
//                               />
//                               <span>{subStep}</span>
//                             </li> 
//                           ))}
//                         </ul>
//                       </div>
//                     ))}
//                     <button 
//                       onClick={() => handleSubmit(project.projectId._id)} 
//                       className="px-6 py-3 text-lg font-bold bg-gray-800 text-white border border-gray-600 rounded-lg transition-all
//                       hover:bg-gray-700 hover:shadow-lg hover:shadow-gray-500/50">
//                       Submit Progress
//                     </button>
//                   </div>
//                 )}
//               </motion.div>
//             ))
//           )}
//         </div>
//       )}
//     </motion.div> */}
