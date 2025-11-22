const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createPost,
  likePost,
  unlikePost,
  getFeedPosts
} = require('../controllers/postController');

router.post('/', protect, createPost);
router.post('/:id/like', protect, likePost);
router.post('/:id/unlike', protect, unlikePost);
router.get('/feed', protect, getFeedPosts);

module.exports = router;
