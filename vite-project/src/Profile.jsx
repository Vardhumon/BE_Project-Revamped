import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { LogOut, User, Code2 } from 'lucide-react';
import ProfileTab from "./components/profile/ProfileTab";
import ProjectsTab from "./components/profile/ProjectsTab";
import PortfolioBuilder from './components/profile/PortfolioBuilder';

// Add new import for dashboard components
import { BarChart, Activity, Award, GitBranch, Star, Clock } from 'lucide-react';
import UserDashboard from './components/profile/UserDashboard';

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

  // Add new state for dashboard metrics
  const [metrics, setMetrics] = useState({
    totalProjects: 0,
    completedProjects: 0,
    projectProgress: {},
    activeStreak: 0,
    totalContributions: 0,
    recentActivity: []
  });

  // Add new function to calculate metrics
  const calculateMetrics = (projectsData) => {
    const total = projectsData.length;
    const completed = projectsData.filter(p => 
      p.status === 'completed' || 
      (completedSteps[p.projectId._id] && Object.values(completedSteps[p.projectId._id]).flat().length > 0)
    ).length;

    const progress = projectsData.reduce((acc, project) => {
      const totalSteps = project.projectId.steps?.length || 0;
      const completedStepsCount = completedSteps[project.projectId._id] 
        ? Object.values(completedSteps[project.projectId._id]).flat().length 
        : 0;
      acc[project.projectId._id] = (completedStepsCount / totalSteps) * 100;
      return acc;
    }, {});

    setMetrics({
      totalProjects: total,
      completedProjects: completed,
      projectProgress: progress,
      activeStreak: calculateStreak(),
      totalContributions: calculateTotalContributions(),
      recentActivity: generateRecentActivity(projectsData)
    });
  };

  // Add these helper functions before calculateMetrics
  const calculateStreak = () => {
    // Sort projects by last activity
    const sortedProjects = [...projects].sort((a, b) => {
      const aDate = new Date(a.updatedAt || a.createdAt);
      const bDate = new Date(b.updatedAt || b.createdAt);
      return bDate - aDate;
    });

    if (sortedProjects.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    const oneDay = 24 * 60 * 60 * 1000;

    // Check the most recent activity
    const lastActivity = new Date(sortedProjects[0].updatedAt || sortedProjects[0].createdAt);
    const daysSinceLastActivity = Math.floor((today - lastActivity) / oneDay);

    // If no activity in the last day, streak is broken
    if (daysSinceLastActivity > 1) return 0;

    // Calculate streak by checking consecutive days of activity
    let currentDate = new Date(lastActivity);
    for (let i = 0; i < sortedProjects.length; i++) {
      const activityDate = new Date(sortedProjects[i].updatedAt || sortedProjects[i].createdAt);
      const daysDifference = Math.floor((currentDate - activityDate) / oneDay);

      if (daysDifference <= 1) {
        streak++;
        currentDate = activityDate;
      } else {
        break;
      }
    }

    return streak;
  };

  const calculateTotalContributions = () => {
    return Object.values(completedSteps).reduce((total, projectSteps) => {
      return total + Object.values(projectSteps).reduce((stepTotal, steps) => {
        return stepTotal + steps.length;
      }, 0);
    }, 0);
  };

  const generateRecentActivity = (projectsData) => {
    const activities = projectsData
      .filter(project => {
        const projectSteps = completedSteps[project.projectId._id];
        return projectSteps && Object.values(projectSteps).some(steps => steps.length > 0);
      })
      .map(project => {
        const completedCount = Object.values(completedSteps[project.projectId._id] || {})
          .reduce((total, steps) => total + steps.length, 0);
        return `Completed ${completedCount} tasks in ${project.projectId.title}`;
      })
      .slice(0, 5); // Get only the 5 most recent activities

    return activities;
  };

  // Update useEffect to include metrics calculation
  useEffect(() => {
    fetchUserProjectsAndProgress();
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (projects.length > 0) {
      calculateMetrics(projects);
    }
  }, [projects, completedSteps]);

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
      className="min-h-screen bg-black pt-20 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto">
        <Toaster position="top-right" />
        
        <motion.div 
          className="bg-gradient-to-br from-black to-gray-900 rounded-2xl border border-white/10 p-8 backdrop-blur-xl"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 bg-[#00ff9d]/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 bg-[#00ff9d]/20 blur-3xl" />

          {/* Navigation */}
          <div className="flex items-center gap-6 mb-8 border-b border-white/10 pb-6">
          <button 
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
              activeTab === "profile" 
                ? "text-[#00ff9d] bg-[#00ff9d]/10" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            <User className="w-5 h-5" />
            Profile
          </button>
          
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
              activeTab === "dashboard" 
                ? "text-[#00ff9d] bg-[#00ff9d]/10" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            <BarChart className="w-5 h-5" />
            Dashboard
          </button> 
          
          <button 
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
              activeTab === "projects" 
                ? "text-[#00ff9d] bg-[#00ff9d]/10" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Code2 className="w-5 h-5" />
            Projects
          </button>

          <div className="flex-grow" />

          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-500 hover:text-red-400 transition-colors rounded-xl border border-red-500/20 hover:border-red-500/40"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>


         

          {/* Content */}
          <div className="relative z-10">
          {activeTab === "dashboard" ? (
            <UserDashboard metrics={metrics} userInfo={userInfo} projects={projects} />
          ) : activeTab === "profile" ? (
            <>
              <ProfileTab 
                userInfo={userInfo}
                editing={editing}
                setEditing={setEditing}
                handleSave={handleSave}
                setUserInfo={setUserInfo}
              />
              <PortfolioBuilder userInfo={userInfo} projects={projects} />
            </>
          ) : (
            <ProjectsTab 
              loading={loading}
              projects={projects}
              expandedProject={expandedProject}
              setExpandedProject={setExpandedProject}
              isStepCompleted={isStepCompleted}
              isSubStepCompleted={isSubStepCompleted}
              toggleMainStep={toggleMainStep}
              toggleSubStep={toggleSubStep}
              handleSubmit={handleSubmit}
            />
          )}
        </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
