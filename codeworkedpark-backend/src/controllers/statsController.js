const Project = require('../models/Project');
const SubmittedProject = require('../models/SubmittedProject');

exports.getCommunityStats = async (req, res) => {
    try {
        const { communityName } = req.params;
        
        const totalProjects = await SubmittedProject.countDocuments({ community: communityName });
        const projectsByTech = await SubmittedProject.aggregate([
            { $match: { community: communityName } },
            { $lookup: { from: 'projects', localField: 'projectId', foreignField: '_id', as: 'project' } },
            { $unwind: '$project' },
            { $unwind: '$project.techStack' },
            { $group: { _id: '$project.techStack', count: { $sum: 1 } } }
        ]);

        res.json({
            totalProjects,
            projectsByTech,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching community statistics" });
    }
};