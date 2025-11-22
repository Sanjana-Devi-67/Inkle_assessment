const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        'POST_CREATED',
        'POST_DELETED',
        'USER_FOLLOWED',
        'POST_LIKED',
        'LIKE_REMOVED',
        'USER_DELETED',
        'ROLE_CHANGED'
      ],
      required: true
    },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    targetPost: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    message: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Activity', activitySchema);
