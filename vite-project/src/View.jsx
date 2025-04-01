import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import gsap from "gsap";

export default function View() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const animateProjectTransition = () => {
    const container = document.querySelector('.project-container');
    
    // Fade out animation
    gsap.to(container, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      onComplete: () => {
        fetchProject();
        // Fade in animation after new project is loaded
        gsap.to(container, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: 0.2
        });
      }
    });
  };

  const fetchProject = () => {
    setAccepted(false);
    setVerified(false);
    setRepoUrl("");
    const userStack = JSON.parse(localStorage.getItem("techStack")) || ["Github"];
    const userId = localStorage.getItem("user") || "12345";
    const experienceLevel = localStorage.getItem("experience") || "Intermediate";
    const category = localStorage.getItem("selectedCategories") || "Full-Stack";

    axios
      .post("http://localhost:5000/api/getProject", {
        userStack,
        userId,
        experienceLevel,
        category
      })
      .then((res) => {
        setProject(res.data.project);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProject();
  }, []);

  const acceptProject = () => {
    if (!verified) {
      toast.error("Please verify your GitHub repository first.");
      return;
    }

    setAccepting(true);
    axios
      .post("http://localhost:5000/api/acceptProject", {
        userId: JSON.parse(localStorage.getItem("user"))._id,
        projectId: project._id,
        repoUrl
      })
      .then(() => {
        setAccepted(true);
        toast.success("Project accepted successfully!");
      })
      .catch(() => {
        toast.error("Error accepting project.");
      })
      .finally(() => {
        setAccepting(false);
      });
  };

  const verifyGitHubRepo = () => {
    if (!repoUrl.trim()) {
      toast.error("Enter a valid GitHub repository URL.");
      return;
    }

    setVerifying(true);
    axios
      .post("http://localhost:5000/api/verifyGithubRepo", { repoUrl })
      .then((res) => {
        if (res.data.verified) {
          setVerified(true);
          toast.success("Repository is public and accessible!");
        } else {
          toast.error("Repository is not public or doesn't exist.");
        }
      })
      .catch(() => {
        toast.error("Error verifying repository.");
      })
      .finally(() => {
        setVerifying(false);
      });
  };

  if (loading) return <p className="text-center text-gray-400 py-8 text-lg">Loading project...</p>;
  if (error) return <p className="text-center text-red-500 py-8 text-lg">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-black pt-20 px-4">
      <div className="max-w-5xl mx-auto p-8 bg-gradient-to-br from-black to-gray-900 text-white shadow-2xl rounded-2xl border border-white/10 relative overflow-hidden backdrop-blur-xl">
        <Toaster />
        
        {/* Enhanced decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00ff9d]/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00ff9d]/5 rounded-full blur-3xl -ml-48 -mb-48"></div>
        
        <button
          className="absolute top-4 right-4 px-6 py-2.5 bg-black border border-[#00ff9d]/20 text-[#00ff9d] rounded-lg hover:bg-[#00ff9d]/10 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[#00ff9d]/5"
          onClick={animateProjectTransition}
        >
          <span className="w-2 h-2 bg-[#00ff9d] rounded-full animate-pulse"></span>
          New Project
        </button>
      <div className="project-container relative z-10">
        {project && (
          <>
            <h1 className="text-4xl font-bold mt-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#00ff9d]">
              {project.title}
            </h1>

            <p className="text-gray-300 mt-4 text-lg leading-relaxed">
              {project.description}
            </p>

            <div className="mt-8">
              <h2 className="text-xl font-medium text-[#00ff9d]">Tech Stack</h2>
              <div className="flex flex-wrap gap-3 mt-4">
                {project.techStack.map((tech, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-black border border-[#00ff9d]/20 text-white rounded-lg hover:bg-[#00ff9d]/5 transition-all duration-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-xl font-medium text-[#00ff9d]">Project Steps</h2>
              <div className="space-y-6 mt-6">
                {project.steps.map((step, index) => (
                  <div
                    key={index}
                    className="p-6 border border-white/10 rounded-xl bg-black/50 backdrop-blur-xl hover:border-[#00ff9d]/30 transition-all duration-300"
                  >
                    <h3 className="font-semibold text-[#00ff9d] text-lg">{step.step}</h3>
                    <ul className="space-y-3 mt-4 text-gray-300">
                      {step.subSteps.map((subStep, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="w-2 h-2 mt-2 bg-[#00ff9d] rounded-full"></span>
                          <span>{subStep}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 flex items-center justify-between">
              <span className="px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-[#00ff9d]">
                {project.tag}
              </span>
              <span className="text-gray-300">
                Deadline: <span className="text-[#00ff9d]">{project.deadline}</span>
              </span>
            </div>

            {/* GitHub Verification Section */}
            <div className="mt-12 p-8 border border-white/10 rounded-xl bg-black/50 backdrop-blur-xl">
              <h2 className="text-xl font-medium text-[#00ff9d] mb-6">GitHub Repository Verification</h2>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Enter GitHub Repository URL"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="flex-1 px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#00ff9d] transition-colors"
                />
                <button
                  onClick={verifyGitHubRepo}
                  disabled={verifying || verified}
                  className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                    verified 
                      ? "bg-[#00ff9d] text-black"
                      : "border border-[#00ff9d] text-[#00ff9d] hover:bg-[#00ff9d]/10"
                  }`}
                >
                  {verified ? "Verified ✓" : verifying ? "Verifying..." : "Verify"}
                </button>
              </div>
            </div>

            <button
              onClick={acceptProject}
              disabled={accepting || !verified}
              className={`mt-12 w-full py-4 rounded-lg text-lg font-medium transition-all duration-300 ${
                accepted
                  ? "bg-[#00ff9d] text-black"
                  : !verified
                  ? "bg-gray-800 text-gray-400 cursor-not-allowed"
                  : "bg-black border border-[#00ff9d] text-[#00ff9d] hover:bg-[#00ff9d] hover:text-black"
              }`}
            >
              {accepting ? "Accepting..." : accepted ? "Project Accepted!" : "Accept Project"}
            </button>
          </>
        )}
      </div>
    </div>
  </div>
);
}