const Project = require('../models/Project');
const User = require('../models/User');
const SubmittedProject = require('../models/SubmittedProject');
const fetch = require('node-fetch');

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch projects" });
    }
};

const projectRecommender = require('../ml/recommendation_model');

exports.getProject = async (req, res) => {
    const { userStack, experienceLevel,category } = req.body;
    const categoryValue = category.replace(/\s+/g, '').normalize();
const expectedValue = "Machine Learning".replace(/\s+/g, '').normalize();

console.log('Final equality check:', categoryValue === expectedValue);



// Log both values to debug the comparison);
    try {
        const projects = await Project.find();
        const difficultyMap = {
            'beginner': 'easy',
            'intermediate': 'medium',
            'advanced': 'hard'
        };

        const filteredProjects = projects.filter((project) =>
            project.techStack.some((tech) => userStack.includes(tech)) &&
            project.difficultyLevel.toLowerCase() === difficultyMap[experienceLevel.toLowerCase()]
            // && project.tag.toLowerCase() === categoryValue.toLowerCase()
        );
        // console.log(filteredProjects);
        if (filteredProjects.length === 0) {
            return res.status(200).json({ message: "No more projects to recommend" });
        }

        const randomIndex = Math.floor(Math.random() * filteredProjects.length);
        const recommendedProject = filteredProjects[randomIndex].toObject();

        recommendedProject.deadline =
            recommendedProject.difficultyLevel === "Easy" ? "1 week" :
            recommendedProject.difficultyLevel === "Medium" ? "2 weeks" : "3 weeks";

        res.status(200).json({ project: recommendedProject });
    } catch (err) {
        res.status(500).json({ message: "Error fetching project", error: err.message });
    }
};

exports.recommendProjects = async (req, res) => {
    const { techStack } = req.body;
    try {
        const projects = await Project.find();
        const recommendations = projects.map((project) => {
            const intersection = project.techStack.filter((tech) => techStack.includes(tech));
            const similarity = intersection.length / techStack.length;
            return { ...project.toObject(), similarity };
        });

        recommendations.sort((a, b) => b.similarity - a.similarity);
        res.status(200).json(recommendations.slice(0, 10));
    } catch (err) {
        res.status(500).json({ message: "Failed to generate recommendations" });
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

exports.submitProject = async (req, res) => {
    const { userId, username, projectId, githubLink, deploymentLink, summary, community } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: "Project not found" });

        const existingSubmission = await SubmittedProject.findOne({ projectId, userId });
        if (existingSubmission) {
            return res.status(400).json({ message: "You have already submitted this project." });
        }

        const submittedProject = new SubmittedProject({
            projectId,
            userId,
            username,
            githubLink,
            deploymentLink,
            summary,
            community,
            comments: [],
        });

        await submittedProject.save();
        res.status(201).json({ message: "Project submitted successfully", project: submittedProject });
    } catch (err) {
        res.status(500).json({ message: "Error submitting project", error: err.message });
    }
};

exports.verifyGithubRepo = async (req, res) => {
    try {
        const { repoUrl } = req.body;
        const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
        // console.log(match);
        if (!match) {
            return res.status(400).json({ verified: false, message: "Invalid GitHub URL." });
        }

        const [, owner, repo] = match;
        // console.log(owner, repo);
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

        // const response = await fetch(apiUrl, {
        //     headers: {
        //         "Accept": "application/vnd.github.v3+json",
        //         "User-Agent": "node-fetch"  // Adding User-Agent header which is required by GitHub API
        //     },
        // });
        // console.log(response); // Add this line to log the response for debugging purposes// Add this line to log the response JSON for debugging purposes

        // if (response.status === 404) {
        //     return res.status(404).json({ verified: false, message: "Repository not found." });
        // }

        // if (!response.ok) {
        //     return res.status(500).json({ verified: false, message: "GitHub API error." });
        // }

        // const data = await response.json();
        // res.json({ verified: !data.private });
        res.json({ verified: true });
    } catch (error) {
        res.status(500).json({ verified: false, message: error.message });
    }
};

exports.getCommunityProjects = async (req, res) => {
    const { category } = req.params;
    try {
        const projects = await Project.find({ category });
        res.json({ projects });
    } catch (error) {
        res.status(500).json({ message: "Error fetching community projects" });
    }
};

exports.getUserProjects = async (req, res) => {
    const { userId } = req.params;
    try {
        const projects = await Project.find({ userId });
        res.json({ projects });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user projects" });
    }
};

exports.createCommunityPost = async (req, res) => {
    const { title, techStack, level, summary, link, category } = req.body;
    try {
        const project = new Project({ title, techStack, level, summary, link, category });
        await project.save();
        res.json({ success: true, project });
    } catch (error) {
        res.status(500).json({ message: "Error creating community post" });
    }
};

exports.updateTaskProgress = async (req, res) => {
    const { userId, projectId, completedSteps } = req.body;
    console.log(completedSteps);
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const project = user.projects.find((p) => String(p.projectId) === String(projectId));
        if (!project) return res.status(404).json({ message: "Project not found" });
        // console.log(project);
        // Update completed steps
        for (const [stepId] of Object.entries(completedSteps)) {
            const task = project.tasks.find((t) => String(t.taskId) === String(stepId));
            if (task) {
                console.log(task);
              task.completed = true;
            }
          }

        await user.save();
        res.status(200).json({ message: "Task progress updated successfully", user });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};