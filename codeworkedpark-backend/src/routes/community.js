const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');

// Community membership routes
router.post('/joinCommunity', communityController.joinCommunity);
router.post('/leave', communityController.leaveCommunity);
router.get('/:name/members', communityController.getMembers);
router.get('/:name/status/:userId', communityController.getMembershipStatus);

// Community projects routes
router.get('/:community/projects', communityController.getCommunityProjects);
router.get('/user/:userId/projects', communityController.getUserProjects);
router.post('/post', communityController.createCommunityPost);

module.exports = router;