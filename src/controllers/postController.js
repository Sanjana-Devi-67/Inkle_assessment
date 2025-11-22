const Post = require('../models/Post');
const Activity = require('../models/Activity');
const User = require('../models/User');

// Create post
exports.createPost = async (req, res, next) => {
  try {
    const { content, mediaUrl } = req.body;

    const post = await Post.create({
      author: req.user._id,
      content,
      mediaUrl
    });

    await Activity.create({
      type: 'POST_CREATED',
      actor: req.user._id,
      targetPost: post._id,
      message: `${req.user.username} made a post`
    });

    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

// Like post
exports.likePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId).populate('author', 'username');

    if (!post || post.isDeleted) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!post.likes.includes(req.user._id)) {
      post.likes.push(req.user._id);
      await post.save();

      await Activity.create({
        type: 'POST_LIKED',
        actor: req.user._id,
        targetPost: post._id,
        targetUser: post.author._id,
        message: `${req.user.username} liked ${post.author.username}'s post`
      });
    }

    res.json({ message: 'Post liked successfully' });
  } catch (err) {
    next(err);
  }
};

// Unlike post
exports.unlikePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId).populate('author', 'username');

    if (!post || post.isDeleted) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.likes.includes(req.user._id)) {
      post.likes = post.likes.filter(
        (u) => String(u) !== String(req.user._id)
      );
      await post.save();

      await Activity.create({
        type: 'LIKE_REMOVED',
        actor: req.user._id,
        targetPost: post._id,
        targetUser: post.author._id,
        message: `${req.user.username} removed like from ${post.author.username}'s post`
      });
    }

    res.json({ message: 'Post unliked successfully' });
  } catch (err) {
    next(err);
  }
};

// Get feed posts with blocking respected
exports.getFeedPosts = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;

    // Find users who have blocked current user
    const usersBlockingMe = await User.find({
      blockedUsers: currentUserId
    }).select('_id');

    const blockedByIds = usersBlockingMe.map((u) => u._id);

    const posts = await Post.find({
      isDeleted: false,
      author: { $nin: blockedByIds }
    })
      .populate('author', 'username name')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(posts);
  } catch (err) {
    next(err);
  }
};
