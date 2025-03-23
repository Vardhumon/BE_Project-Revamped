import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function View() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const fetchProject = () => {
    setLoading(true);
    setAccepted(false);
    setVerified(false);
    setRepoUrl("");
    const userStack = JSON.parse(localStorage.getItem("techStack")) || ["Github"];
    const userId = localStorage.getItem("user") || "12345";
    const experienceLevel = localStorage.getItem("experience") || "Intermediate";

    axios
      .post("http://localhost:5000/api/getProject", {
        userStack,
        userId,
        experienceLevel,
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
    <div className="max-w-5xl mx-auto p-8 bg-gradient-to-br from-gray-900 to-black text-white shadow-xl rounded-xl mt-16 border border-gray-700 relative overflow-hidden">
      <Toaster />
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-600/10 to-transparent rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-600/10 to-transparent rounded-full blur-3xl -ml-32 -mb-32"></div>
      
      <button
        className="absolute top-4 right-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-md hover:from-indigo-600 hover:to-purple-700 shadow-md transition-all duration-300"
        onClick={fetchProject}
      >
        New Project
      </button>

      <h1 className="text-3xl font-bold mt-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-300">
        {project.title}
      </h1>

      <p className="text-gray-300 mt-2 text-lg">
        {project.description}
      </p>

      <div className="mt-6">
        <h2 className="text-xl font-medium text-blue-300">Tech Stack:</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {project.techStack.map((tech, index) => (
            <span
              key={index}
              className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white px-4 py-1.5 text-sm rounded-full border border-blue-700/50 shadow-md"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-medium text-blue-300">Project Steps:</h2>
        <div className="space-y-4 mt-4">
          {project.steps.map((step, index) => (
            <div
              key={index}
              className="p-5 border-l-4 border-indigo-500 bg-gradient-to-r from-gray-800 to-gray-900 rounded-md shadow-md"
            >
              <h3 className="font-semibold text-indigo-300">{step.step}</h3>
              <ul className="list-disc list-inside text-gray-300 mt-2 pl-4">
                {step.subSteps.map((subStep, i) => (
                  <li key={i} className="mb-1">{subStep}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center text-gray-300">
        <span className="bg-gradient-to-r from-gray-800 to-gray-700 px-4 py-1.5 text-sm rounded-full shadow-inner">
          {project.tag}
        </span>
        <span className="font-medium text-indigo-300">
          Deadline: <span className="text-white">{project.deadline}</span>
        </span>
      </div>

      {/* GitHub Verification Section */}
      <div className="mt-8 p-6 bg-gradient-to-r from-gray-800/70 to-gray-900/70 rounded-lg border border-gray-700/50">
        <h2 className="text-xl font-medium text-blue-300">GitHub Repository Verification</h2>
        <div className="flex gap-2 mt-3">
          <input
            type="text"
            placeholder="Enter GitHub Repository URL"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            className="w-full p-3 bg-gray-800/80 text-white rounded-md border border-gray-700 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            className={`px-4 py-2 rounded-md shadow-md ${
              verified 
                ? "bg-gradient-to-r from-green-500 to-emerald-600" 
                : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            } text-white transition-all duration-300`}
            onClick={verifyGitHubRepo}
            disabled={verifying || verified}
          >
            {verified ? "Verified" : verifying ? "Verifying..." : "Verify"}
          </button>
        </div>
      </div>

      {!accepted ? (
        <button
          className="mt-8 w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-3 rounded-md hover:from-indigo-600 hover:to-purple-700 font-medium shadow-lg transition-all duration-300 text-lg"
          onClick={acceptProject}
          disabled={accepting}
        >
          {accepting ? "Accepting..." : "Accept Project"}
        </button>
      ) : (
        <div className="mt-8 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-md font-medium shadow-lg text-center text-lg">
          Project Accepted!
        </div>
      )}
    </div>
  );
}