const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getActivityWall } = require('../controllers/activityController');

router.get('/wall', protect, getActivityWall);

module.exports = router;
