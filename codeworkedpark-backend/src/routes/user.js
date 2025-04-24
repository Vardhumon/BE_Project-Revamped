const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User profile routes
router.post('/profile', userController.getUser);
router.post('/update', userController.updateUser);

// User projects routes
router.post('/getUserProjects', userController.getUserProjects);
router.post('/progress', userController.getUserProgress);
router.post('/accept-project', userController.acceptProject);
router.post('/update-progress', userController.updateTaskProgress);
router.get('/:userId/profile', userController.getUserProfile);


module.exports = router;