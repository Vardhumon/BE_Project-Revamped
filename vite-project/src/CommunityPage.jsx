import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import PostModal from "./components/community/PostModal";
import MembersList from "./components/community/MembersList";
import ProjectList from "./components/community/ProjectList";
import HelpWantedList from "./components/community/HelpWantedList";

const socket = io("http://localhost:5000");

const CommunityPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [userProjects, setUserProjects] = useState([]);
    const [submittedProjects, setSubmittedProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [summary, setSummary] = useState("");
    const [deployedLink, setDeployedLink] = useState("");
    const [expandedProject, setExpandedProject] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    // Add these state variables at the top with other states
    const [activeTab, setActiveTab] = useState('posts'); // 'posts' or 'members'
    const [communityMembers, setCommunityMembers] = useState([]);
    const toggleExpand = (projectId) => {
        if (expandedProject === projectId) {
            setExpandedProject(null);
        } else {
            setExpandedProject(projectId);
            fetchComments(projectId);
        }
    };    

    const [sharedProjects, setSharedProjects] = useState([]);

    // Add these state variables in your component
    const [isMember, setIsMember] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // Add this function in your component
    const checkMembershipStatus = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;
    
      const pathParts = window.location.pathname.split("/");
      const community = pathParts[pathParts.length - 1] || "Other";
      
      try {
        const response = await axios.get(`http://localhost:5000/api/${community}/status/${user._id}`);
        setIsMember(response.data.isMember);
      } catch (error) {
        console.error("Error checking membership status:", error);
      }
    };
    
    // Add this function to handle joining
    const handleJoinCommunity = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        toast.error("Please login to join the community");
        return;
      }
    
      setIsLoading(true);
      const pathParts = window.location.pathname.split("/");
      const community = pathParts[pathParts.length - 1] || "Other";
    
      try {
        await axios.post("http://localhost:5000/api/joinCommunity", {
          userId: user._id,
          communityName: community
        });
        setIsMember(true);
        toast.success("Successfully joined the community!");
        fetchCommunityMembers();
      } catch (error) {
        toast.error("Error joining community");
      } finally {
        setIsLoading(false);
      }
    };
    
    

    const fetchCommunityMembers = async () => {
        try {
            const pathParts = window.location.pathname.split("/");
            const community = pathParts[pathParts.length - 1] || "Other";
            const response = await axios.get(`http://localhost:5000/api/${community}/members`);
            console.log("hi2",response.data)
            setCommunityMembers(response.data);
            console.log("hi",response.data)
        } catch (error) {
            console.error("Error fetching community members:", error);
            toast.error("Failed to fetch community members");
        }
    };
    
 
    useEffect(() => {
        fetchSubmittedProjects();
        checkMembershipStatus();
        fetchCommunityMembers(); // Add this line
        fetchSharedProjects();
        const pathParts = window.location.pathname.split("/");
            const community = pathParts[pathParts.length - 1] || "Other";
            // console.log("Community:", community);
            const timer = setTimeout(() => setIsVisible(true), 1500);
             // Listen for new project submissions in real-time
        socket.on("new_project", (newProject) => {
            // console.log("New Project Received:", newProject);
            
            setSubmittedProjects((prevProjects) => [...prevProjects,newProject]);
            toast.success("a new project has been submitted!");
        });

        // Cleanup socket listener on component unmount
        return () => {
            socket.off("new_project");
            clearTimeout(timer);
        };
           
    }, []);

    const fetchSubmittedProjects = async () => {
        try {
            const pathParts = window.location.pathname.split("/");
            const community = pathParts[pathParts.length - 1] || "Other";
            console.log("Community:", community);
            // Updated endpoint to use community routes
            const response = await axios.get(`http://localhost:5000/api/${community}/projects`);
            setSubmittedProjects(response.data);
        } catch (error) {
            console.error("Error fetching submitted projects:", error);
            toast.error("Failed to fetch community projects");
        }
    };

    const fetchUserProjects = async () => {
        const user = localStorage.getItem("user");
        const userId = user ? JSON.parse(user)._id : null;
        
        if (!userId) {
            toast.error("Please login to view your projects");
            return;
        }
    
        try {
            // Updated endpoint to use community routes
            const response = await axios.get(`http://localhost:5000/api/user/${userId}/projects`);
            setUserProjects(response.data.projects);
            console.log("hi again",response.data.projects)
        } catch (error) {
            console.error("Error fetching projects:", error);
            toast.error("Failed to fetch your projects");
        }
    };

    const handlePublish = async () => {
        if (!selectedProject || !summary || !deployedLink) {
            toast.error("Please fill all fields!");
            return;
        }
    
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user || !user._id) {
                toast.error("Please login to publish");
                return;
            }

            const pathParts = window.location.pathname.split("/");
            const community = pathParts[pathParts.length - 1] || "Other";
            
            // Updated to match communityController.createCommunityPost
            const response = await axios.post("http://localhost:5000/api/post", {
                userId: user._id,
                username: user.name,
                projectId: selectedProject.projectId._id,
                githubLink: selectedProject.repoUrl || "",
                deploymentLink: deployedLink,
                summary: summary,
                community: community
            });
            
            if (response.status === 201) {
                toast.success("Project published successfully!");
                fetchSubmittedProjects();
                setShowModal(false);
                setSelectedProject(null);
                setSummary("");
                setDeployedLink("");
                socket.emit("project_submitted", response.data.project);
            }
        } catch (error) {
            console.error("Error publishing project:", error);
            toast.error(error.response?.data?.message || "Failed to publish project");
        }
    };

    const handleProjectSelect = (projectId) => {
        const project = userProjects.find((p) => p._id === projectId);
        setSelectedProject(project || null);
    };

    // const handlePublish = async () => {
    //     if (!selectedProject || !summary || !deployedLink) {
    //         alert("Please fill all fields!");
    //         return;
    //     }
    
    //     try {
    //         const user = JSON.parse(localStorage.getItem("user"));
    //         if (!user || !user._id) {
    //             alert("User not found. Please log in again.");
    //             return;
    //         }

    //         const pathParts = window.location.pathname.split("/");
    //         const community = pathParts[pathParts.length - 1] || "Other";
    //         // console.log("Community:", community);
    //         const newPost = {
    //             userId: user._id,
    //             username: user.name,
    //             projectId: selectedProject._id,
    //             githubLink: selectedProject.repoUrl || "", 
    //             deploymentLink: deployedLink,
    //             summary,
    //             community
    //         };

    //         const response = await axios.post("http://localhost:5000/api/submitProject", newPost);
            
    //         if (response.status === 201) {
    //             toast.success("Project submitted successfully!");
    //             fetchSubmittedProjects(); // Refresh submitted projects
    //             setShowModal(false);
    //             setSelectedProject(null);
    //             setSummary("");
    //             setDeployedLink("");
    //             socket.emit("project_submitted", response.data);
    //         } else {
    //             alert("Failed to submit project.");
    //         }
    //     } catch (error) {
    //         console.error("Error submitting project:", error);
    //         alert("Error submitting project. Please try again later.");
    //     }
    // };
    const fetchComments = async (projectId) => {
        // console.log("Fetching Comments for Project:", projectId);
        try {
            const response = await axios.get(`http://localhost:5000/api/comments/${projectId}`);
            setComments(response.data);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const handleCommentSubmit = async (projectId) => {
        if (!newComment.trim()) return;
        // console.log("New Comment:", newComment);
        // console.log("Project ID:", projectId);
        
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const response = await axios.post("http://localhost:5000/api/addcomment", {
                projectId,
                userId: user._id,
                username: user.name,
                text: newComment
            });
    
            setComments([...comments, response.data]);
            // console.log("New Comment Added:", response.data);
            setNewComment("");
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleLeaveCommunity = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            toast.error("Please login first");
            return;
        }
    
        setIsLoading(true);
        const pathParts = window.location.pathname.split("/");
        const community = pathParts[pathParts.length - 1] || "Other";
    
        try {
            await axios.post("http://localhost:5000/api/leave", {
                userId: user._id,
                communityName: community
            });
            setIsMember(false);
            toast.success("Successfully left the community");
            fetchCommunityMembers(); // Refresh members list
        } catch (error) {
            toast.error("Error leaving community");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSharedProjects = async () => {
        try {
            const pathParts = window.location.pathname.split("/");
            const community = pathParts[pathParts.length - 1] || "Other";
            const response = await axios.get(`http://localhost:5000/api/${community}/shared-projects`);
            setSharedProjects(response.data);
            console.log("shared",response.data)
        } catch (error) {
            console.error("Error fetching shared projects:", error);
            toast.error("Failed to fetch shared projects");
        }
    };

    const handleCreateSharedProject = async () => {
        if (!selectedProject || !summary) {
            toast.error("Please fill all fields!");
            return;
        }

        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const pathParts = window.location.pathname.split("/");
            const community = pathParts[pathParts.length - 1] || "Other";
            
            const response = await axios.post(`http://localhost:5000/api/${community}/shared-projects`, {
                userId: user._id,
                projectId: selectedProject.projectId._id,
                description: summary,
                githubLink: selectedProject.repoUrl || "",
                community: community
            });
            
            toast.success("Project posted for collaboration!");
            fetchSharedProjects();
            setShowModal(false);
            setSelectedProject(null);
            setSummary("");
        } catch (error) {
            console.error("Error creating shared project:", error);
            toast.error("Failed to create shared project");
        }
    };

    const handleJoinSharedProject = async (projectId) => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const pathParts = window.location.pathname.split("/");
            const community = pathParts[pathParts.length - 1] || "Other";
            
            await axios.post(`http://localhost:5000/api/${community}/shared-projects/${projectId}/join`, {
                userId: user._id
            });
            
            toast.success("Successfully joined the project!");
            fetchSharedProjects();
        } catch (error) {
            console.error("Error joining project:", error);
            toast.error("Failed to join project");
        }
    };
    
    const handlePublishContent = async () => {
        if (activeTab === 'help-wanted') {
            await handleCreateSharedProject();
        } else {
            await handlePublish();
        }
    };

    return (
        
        <div className="max-w-5xl mx-auto p-6 bg-black text-white shadow-lg rounded-xl mt-14 relative">
            <Toaster />
            <div className="flex items-center justify-evenly mb-8">
            <h1 className="text-3xl font-semibold text-center mb-6">Community Posts</h1>
            <div className="flex justify-center mb-6 gap-4">
    <button 
        onClick={() => { setShowModal(true); fetchUserProjects(); }}
        className="px-6 py-3 text-lg font-bold bg-gray-800 text-white border border-gray-600 rounded-lg transition-all
        hover:bg-gray-700 hover:shadow-lg hover:shadow-gray-500/50 hover:scale-105"
    >
        Post a Project
    </button>
    {isMember ? (
        <button 
            onClick={handleLeaveCommunity}
            disabled={isLoading}
            className="px-2 py-1 text-lg font-bold bg-red-600 text-white border border-red-400 rounded-lg transition-all
            hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/50 hover:scale-105 disabled:opacity-50"
        >
            {isLoading ? "Leaving..." : "Leave Community"}
        </button>
    ) : (
        <button 
            onClick={handleJoinCommunity}
            disabled={isLoading}
            className="px-2 py-3 text-lg font-bold bg-blue-600 text-white border border-blue-400 rounded-lg transition-all
            hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105 disabled:opacity-50"
        >
            {isLoading ? "Joining..." : "Join Community"}
        </button>
    )}
</div>
            </div>
            {/* Tab Navigation */}
            <div className="mb-8">
                <div className="flex border-b border-gray-600">
                    <button
                        className={`px-6 py-3 text-lg font-semibold transition-all ${
                            activeTab === 'posts'
                            ? 'text-blue-400 border-b-2 border-blue-400'
                            : 'text-gray-400 hover:text-gray-300'
                        }`}
                        onClick={() => setActiveTab('posts')}
                    >
                        Posts
                    </button>
                    <button
                        className={`px-6 py-3 text-lg font-semibold transition-all ${
                            activeTab === 'members'
                            ? 'text-blue-400 border-b-2 border-blue-400'
                            : 'text-gray-400 hover:text-gray-300'
                        }`}
                        onClick={() => setActiveTab('members')}
                    >
                        Members
                    </button>
                    <button
                        className={`px-6 py-3 text-lg font-semibold transition-all ${
                            activeTab === 'help-wanted'
                            ? 'text-blue-400 border-b-2 border-blue-400'
                            : 'text-gray-400 hover:text-gray-300'
                        }`}
                        onClick={() => setActiveTab('help-wanted')}
                    >
                        Help Wanted
                    </button>
                </div>
            </div>
            {/* Content Area */}
            {activeTab === 'posts' ? (
                <ProjectList 
                    submittedProjects={submittedProjects}
                    expandedProject={expandedProject}
                    toggleExpand={toggleExpand}
                    comments={comments}
                    newComment={newComment}
                    setNewComment={setNewComment}
                    handleCommentSubmit={handleCommentSubmit}
                />
            ) : activeTab === 'members' ? (
                <MembersList communityMembers={communityMembers} />
            ) : (
                <HelpWantedList 
                    sharedProjects={sharedProjects}
                    onJoinProject={handleJoinSharedProject}
                />
            )}

            <PostModal 
                showModal={showModal}
                setShowModal={setShowModal}
                userProjects={userProjects}
                handleProjectSelect={handleProjectSelect}
                summary={summary}
                setSummary={setSummary}
                deployedLink={deployedLink}
                setDeployedLink={setDeployedLink}
                handlePublish={handlePublishContent}
                isHelpWanted={activeTab === 'help-wanted'}
            />
        </div>
    );
};


export default CommunityPage;
