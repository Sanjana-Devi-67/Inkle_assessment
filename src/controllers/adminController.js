const User = require('../models/User');
const Post = require('../models/Post');
const Activity = require('../models/Activity');

// Soft delete user (Admin or Owner)
exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user || user.isDeleted) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isDeleted = true;
    await user.save();

    const msg =
      req.user.role === 'OWNER'
        ? `User deleted by Owner`
        : `User deleted by Admin`;

    await Activity.create({
      type: 'USER_DELETED',
      actor: req.user._id,
      targetUser: userId,
      message: msg
    });

    res.json({ message: 'User deleted successfully (soft delete)' });
  } catch (err) {
    next(err);
  }
};

// Delete post (Admin or Owner)
exports.deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId).populate('author', 'username');

    if (!post || post.isDeleted) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.isDeleted = true;
    await post.save();

    const msg =
      req.user.role === 'OWNER'
        ? `Post deleted by Owner`
        : `Post deleted by Admin`;

    await Activity.create({
      type: 'POST_DELETED',
      actor: req.user._id,
      targetPost: postId,
      targetUser: post.author._id,
      message: msg
    });

    res.json({ message: 'Post deleted successfully (soft delete)' });
  } catch (err) {
    next(err);
  }
};

// Admin/Owner removes a like from a post
exports.removeLikeAsAdmin = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const { userId } = req.body;

    const post = await Post.findById(postId).populate('author', 'username');

    if (!post || post.isDeleted) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!post.likes.includes(userId)) {
      return res.status(400).json({ message: 'User has not liked this post' });
    }

    post.likes = post.likes.filter((u) => String(u) !== String(userId));
    await post.save();

    await Activity.create({
      type: 'LIKE_REMOVED',
      actor: req.user._id,
      targetPost: post._id,
      targetUser: userId,
      message: `Like removed by ${req.user.role}`
    });

    res.json({ message: 'Like removed by admin/owner' });
  } catch (err) {
    next(err);
  }
};

// Owner changes role (create/delete admin)
exports.changeUserRole = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { role } = req.body; // 'USER' or 'ADMIN'

    if (!['USER', 'ADMIN'].includes(role)) {
      return res
        .status(400)
        .json({ message: 'Role must be USER or ADMIN' });
    }

    const user = await User.findById(userId);
    if (!user || user.isDeleted) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    await Activity.create({
      type: 'ROLE_CHANGED',
      actor: req.user._id,
      targetUser: userId,
      message: `Owner changed role of ${user.username} to ${role}`
    });

    res.json({ message: `User role changed to ${role}` });
  } catch (err) {
    next(err);
  }
};
