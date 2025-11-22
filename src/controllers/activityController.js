const Activity = require('../models/Activity');

exports.getActivityWall = async (req, res, next) => {
  try {
    const activities = await Activity.find({})
      .populate('actor', 'username')
      .populate('targetUser', 'username')
      .populate('targetPost', 'content')
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    res.json(activities);
  } catch (err) {
    next(err);
  }
};
