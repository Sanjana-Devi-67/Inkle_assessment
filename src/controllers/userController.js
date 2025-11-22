const User = require('../models/User');
const Activity = require('../models/Activity');

// Get current user profile
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .lean();
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// Update current user profile
exports.updateMe = async (req, res, next) => {
  try {
    const { name, bio } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// Follow user
exports.followUser = async (req, res, next) => {
  try {
    const targetId = req.params.id;

    if (targetId === String(req.user._id)) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const target = await User.findById(targetId);
    if (!target || target.isDeleted) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!req.user.following.includes(targetId)) {
      req.user.following.push(targetId);
      await req.user.save();
    }

    if (!target.followers.includes(req.user._id)) {
      target.followers.push(req.user._id);
      await target.save();
    }

    await Activity.create({
      type: 'USER_FOLLOWED',
      actor: req.user._id,
      targetUser: targetId,
      message: `${req.user.username} followed ${target.username}`
    });

    res.json({ message: 'Followed user successfully' });
  } catch (err) {
    next(err);
  }
};

// Unfollow user
exports.unfollowUser = async (req, res, next) => {
  try {
    const targetId = req.params.id;
    const target = await User.findById(targetId);
    if (!target || target.isDeleted) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user.following = req.user.following.filter(
      (u) => String(u) !== String(targetId)
    );
    target.followers = target.followers.filter(
      (u) => String(u) !== String(req.user._id)
    );

    await req.user.save();
    await target.save();

    res.json({ message: 'Unfollowed user successfully' });
  } catch (err) {
    next(err);
  }
};

// Block user
exports.blockUser = async (req, res, next) => {
  try {
    const targetId = req.params.id;

    if (!req.user.blockedUsers.includes(targetId)) {
      req.user.blockedUsers.push(targetId);
      await req.user.save();
    }

    res.json({ message: 'User blocked successfully' });
  } catch (err) {
    next(err);
  }
};

// Unblock user
exports.unblockUser = async (req, res, next) => {
  try {
    const targetId = req.params.id;

    req.user.blockedUsers = req.user.blockedUsers.filter(
      (u) => String(u) !== String(targetId)
    );
    await req.user.save();

    res.json({ message: 'User unblocked successfully' });
  } catch (err) {
    next(err);
  }
};
