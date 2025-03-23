const Community = require('../models/Community');
const User = require('../models/User');
const Project = require('../models/Project');
const SubmittedProject = require('../models/SubmittedProject');

exports.joinCommunity = async (req, res) => {
    const { userId, communityName } = req.body;
    console.log(userId, communityName);
    try {
        let community = await Community.findOne({ name: communityName });
        console.log(community);
        // If community doesn't exist, create it
        if (!community) {
            community = new Community({
                name: communityName,
                members: [userId]
            });
        } else {
            // Check if user is already a member
            if (!community.members.includes(userId)) {
                console.log("User is not a member");
                community.members.push(userId);
            } else {
                return res.status(400).json({ message: "Already a member of this community" });
            }
        }
        
        await community.save();
        res.status(200).json({ message: "Joined community successfully" });
    } catch (error) {
        console.error("Error joining community:", error);
        res.status(500).json({ message: "Error joining community" });
    }
};

exports.leaveCommunity = async (req, res) => {
    const { userId, communityName } = req.body;
    try {
        const community = await Community.findOne({ name: communityName });
        if (!community) {
            return res.status(404).json({ message: "Community not found" });
        }

        community.members = community.members.filter(id => id.toString() !== userId);
        await community.save();
        
        res.status(200).json({ message: "Left community successfully" });
    } catch (error) {
        console.error("Error leaving community:", error);
        res.status(500).json({ message: "Error leaving community" });
    }
};

exports.getMembers = async (req, res) => {
    try {
        const community = await Community.findOne({ name: req.params.name });
        // console.log("hi2",community);
        if (!community) {
            return res.status(404).json({ message: "Community not found" });
        }

        const members = await User.find(
            { _id: { $in: community.members } },
            'name techStack -_id'
        );
        // console.log("hi2",members);
        res.json(members);
    } catch (error) {
        console.error("Error fetching community members:", error);
        res.status(500).json({ message: "Error fetching community members" });
    }
};

exports.getMembershipStatus = async (req, res) => {
    const { name, userId } = req.params;
    try {
        const community = await Community.findOne({ name });
        const isMember = community ? community.members.includes(userId) : false;
        res.json({ isMember });
    } catch (error) {
        console.error("Error checking membership status:", error);
        res.status(500).json({ message: "Error checking membership status" });
    }
};

exports.getCommunityProjects = async (req, res) => {
    try {
        const { community } = req.params;
        console.log(community);
        const projects = await SubmittedProject.find({ community })
            .populate("projectId")
            .populate("comments");
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ message: "Error fetching community posts", error: err.message });
    }
};

exports.getUserProjects = async (req, res) => {
    const { userId } = req.params;
    // console.log(userId); // Add this line to check the userId value in the console
    try {
        const projects = await User.findById(userId).populate("projects.projectId");;
        // console.log(projects.projects);
        res.json({ projects: projects.projects });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user projects" });
    }
};

exports.createCommunityPost = async (req, res) => {
    const { userId, username, projectId, githubLink, deploymentLink, summary, community } = req.body;
    console.log(userId, username, projectId, githubLink, deploymentLink, summary, community);
    try {
        // Validate User
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Validate Project
        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: "Project not found" });

        // Check if project is already submitted by this user
        const existingSubmission = await SubmittedProject.findOne({ projectId, userId });
        if (existingSubmission) {
            return res.status(400).json({ message: "You have already submitted this project." });
        }

        // Create a new submission
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