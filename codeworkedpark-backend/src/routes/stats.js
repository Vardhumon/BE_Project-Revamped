const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

router.get('/community/:communityName', statsController.getCommunityStats);

module.exports = router;