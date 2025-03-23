const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.get('/comments/:projectId', commentController.getComments);
router.post('/addcomment', commentController.addComment);

module.exports = router;