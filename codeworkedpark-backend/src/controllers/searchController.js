const Project = require('../models/Project');
const User = require('../models/User');

exports.searchProjects = async (req, res) => {
    try {
        const { query, tech, difficulty } = req.query;
        let searchQuery = {};

        if (query) {
            searchQuery.$or = [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ];
        }

        if (tech) {
            searchQuery.techStack = { $in: tech.split(',') };
        }

        if (difficulty) {
            searchQuery.difficultyLevel = difficulty;
        }

        const projects = await Project.find(searchQuery);
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: "Error searching projects" });
    }
};