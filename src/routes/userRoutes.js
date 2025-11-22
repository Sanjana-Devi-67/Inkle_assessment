const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getMe,
  updateMe,
  followUser,
  unfollowUser,
  blockUser,
  unblockUser
} = require('../controllers/userController');

router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);

router.post('/:id/follow', protect, followUser);
router.post('/:id/unfollow', protect, unfollowUser);

router.post('/:id/block', protect, blockUser);
router.post('/:id/unblock', protect, unblockUser);

module.exports = router;
