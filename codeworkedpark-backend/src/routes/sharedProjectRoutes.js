const express = require('express');
const router = express.Router();
const sharedProjectController = require('../controllers/sharedProjectController');

// Get all shared projects for a community
router.get('/:community/shared-projects', sharedProjectController.getSharedProjects);

// Create a new shared project
router.post('/:community/shared-projects', sharedProjectController.createSharedProject);

// Join a shared project
router.post('/:community/shared-projects/:projectId/join', sharedProjectController.joinProject);

// Update project status
router.patch('/:community/shared-projects/:projectId/status', sharedProjectController.updateProjectStatus);

module.exports = router;