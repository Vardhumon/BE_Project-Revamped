const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Get chat history for a community
router.get('/:communityName/messages', chatController.getCommunityMessages);

// Mark messages as read
router.post('/:projectId/read', chatController.markMessagesAsRead);

// router.post('/:communityName/messages', chatController.postCommunityMessage);

module.exports = router;