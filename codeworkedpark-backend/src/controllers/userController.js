const User = require('../models/User');
const Project = require('../models/Project');
const bcrypt = require('bcryptjs');

exports.getUser = async (req, res) => {
    const { userId } = req.body;
    try {
        const user = await User
            .findById(userId)
            .select("-password -email -_id -__v");
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch user" });
    }
};

exports.updateUser = async (req, res) => {
    const { userId, name, techStack, experienceLevel, bio, education, hobbies } = req.body;
    try {
        const user = await User.findById(userId);
        user.name = name;
        user.techStack = techStack;
        user.experienceLevel = experienceLevel;
        user.bio = bio;
        user.education = education;
        user.hobbies = hobbies;
        await user.save();
        res.status(200).json({ message: "User updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to update user" });
    }
};

exports.getUserProjects = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId).populate("projects.projectId");
        
        if (!user) return res.status(404).json({ message: "User not found" });

        const validProjects = user.projects
            .map(p => ({
                projectId: p.projectId,
                repoUrl: p.repoUrl
            }))
            .filter(project => project.projectId !== null);

        res.status(200).json({ projects: validProjects });
    } catch (error) {
        res.status(500).json({ message: "Error fetching projects", error: error.message });
    }
};

exports.getUserProgress = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const progress = user.projects.map((project) => ({
            projectId: project.projectId,
            tasks: project.tasks.map((task) => ({
                taskId: task.taskId,
                completed: task.completed,
            })),
        }));

        res.json({ progress });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.acceptProject = async (req, res) => {
    const { userId, projectId, repoUrl } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: "Project not found" });

        const isProjectAccepted = user.projects.some((p) => p.projectId.equals(projectId));
        if (isProjectAccepted) return res.status(400).json({ message: "Project already accepted" });

        const taskProgress = project.steps.map((step) => ({
            taskId: step._id,
            completed: false,
        }));

        user.projects.push({ projectId, repoUrl, tasks: taskProgress });
        await user.save();

        res.status(200).json({ message: "Project accepted successfully", repoUrl });
    } catch (err) {
        res.status(500).json({ message: "Error accepting project", error: err.message });
    }
};

exports.updateTaskProgress = async (req, res) => {
    const { userId, projectId, completedSteps } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const project = user.projects.find((p) => String(p.projectId) === String(projectId));
        if (!project) return res.status(404).json({ message: "Project not found" });

        for (const [stepId] of Object.entries(completedSteps)) {
            const task = project.tasks.find((t) => String(t.taskId) === String(stepId));
            if (task) {
                task.completed = true;
            }
        }

        await user.save();
        res.status(200).json({ message: "Task progress updated successfully", user });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Add this to your exports
exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("hi",userId);
    const user = await User.findById(userId)
      .select('-password')
      .populate('projects.projectId');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      name: user.name,
      bio: user.bio,
      techStack: user.techStack,
      experienceLevel: user.experienceLevel,
      projects: user.projects,
      education: user.education,
      hobbies: user.hobbies
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};