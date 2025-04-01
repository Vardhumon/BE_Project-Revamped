const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// Toggle star status
router.post('/projects/:projectId/star', async (req, res) => {
    try {
        const { projectId } = req.params;
        const { userId } = req.body;
        console.log("Star request:", projectId, userId);
        
        const project = await Project.findById(projectId);
        
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const starIndex = project.stars.indexOf(userId);
        
        if (starIndex === -1) {
            // Add star
            project.stars.push(userId);
        } else {
            // Remove star
            project.stars.splice(starIndex, 1);
        }

        await project.save();

        res.json({ 
            starCount: project.stars.length,
            isStarred: starIndex === -1
        });
    } catch (error) {
        console.error("Star error:", error);
        res.status(500).json({ message: "Error updating star status" });
    }
});

module.exports = router;