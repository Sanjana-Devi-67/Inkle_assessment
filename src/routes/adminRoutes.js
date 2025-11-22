const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const {
  deleteUser,
  deletePost,
  removeLikeAsAdmin,
  changeUserRole
} = require('../controllers/adminController');

// Admin & Owner
router.delete(
  '/users/:id',
  protect,
  requireRole('ADMIN', 'OWNER'),
  deleteUser
);

router.delete(
  '/posts/:id',
  protect,
  requireRole('ADMIN', 'OWNER'),
  deletePost
);

router.post(
  '/posts/:id/remove-like',
  protect,
  requireRole('ADMIN', 'OWNER'),
  removeLikeAsAdmin
);

// Owner only: make user ADMIN or USER
router.patch(
  '/users/:id/role',
  protect,
  requireRole('OWNER'),
  changeUserRole
);

module.exports = router;
