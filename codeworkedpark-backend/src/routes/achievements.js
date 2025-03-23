const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');

router.get('/:userId', achievementController.getUserAchievements);

module.exports = router;