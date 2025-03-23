const User = require('../models/User');
const SubmittedProject = require('../models/SubmittedProject');

exports.getUserAchievements = async (req, res) => {
    try {
        const { userId } = req.params;
        const submittedProjects = await SubmittedProject.find({ userId }).populate('projectId');
        
        const achievements = {
            totalProjects: submittedProjects.length,
            projectsByDifficulty: {
                easy: submittedProjects.filter(p => p.projectId.difficultyLevel === 'Easy').length,
                medium: submittedProjects.filter(p => p.projectId.difficultyLevel === 'Medium').length,
                hard: submittedProjects.filter(p => p.projectId.difficultyLevel === 'Hard').length
            },
            techStackUsed: [...new Set(submittedProjects.flatMap(p => p.projectId.techStack))]
        };

        res.json(achievements);
    } catch (error) {
        res.status(500).json({ message: "Error fetching achievements" });
    }
};