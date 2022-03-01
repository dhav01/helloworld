const mongoose = require('mongoose')
const commentSchema = mongoose.Schema({
  comment: { type: String, required: [true, 'comment cannot be empty'] },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, 'please enter valid postId'],
  },
})

module.exports = mongoose.model('Comment', commentSchema)
