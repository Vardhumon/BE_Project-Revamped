const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// Project routes
router.get('/', projectController.getProjects);
router.post('/getProject', projectController.getProject);
router.post('/recommend', projectController.recommendProjects);
router.post('/acceptProject', projectController.acceptProject);
router.post('/submit', projectController.submitProject);
router.post('/verifyGithubRepo', projectController.verifyGithubRepo);
router.get('/community/:category', projectController.getCommunityProjects);
router.get('/user/:userId', projectController.getUserProjects);
router.post('/community', projectController.createCommunityPost);
router.post('/update-tasks', projectController.updateTaskProgress);

module.exports = router;