// Add these routes to your existing projectRoutes.js
router.post('/projects/:projectId/star', async (req, res) => {
    try {
        const { projectId } = req.params;
        const { userId } = req.body;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        const starIndex = project.stars.indexOf(userId);
        const isStarred = starIndex === -1;

        if (isStarred) {
            project.stars.push(userId);
        } else {
            project.stars.splice(starIndex, 1);
        }

        await project.save();

        res.json({
            success: true,
            isStarred,
            starCount: project.stars.length,
            message: isStarred ? "Project starred successfully" : "Project unstarred successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating project stars" });
    }
});

router.get('/projects/stars/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const projects = await Project.find();
        
        const starData = projects.map(project => ({
            projectId: project._id,
            starCount: project.stars.length,
            isStarred: project.stars.includes(userId)
        }));

        res.json(starData);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching star status" });
    }
});