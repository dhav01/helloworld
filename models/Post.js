const mongoose = require('mongoose')

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'post should contain title'],
    },
    description: {
      type: String,
      required: [true, 'post should contain description'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

postSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'postId',
  localField: '_id',
})

postSchema.virtual('likeCount').get(function () {
  return this.likes.length
})

module.exports = mongoose.model('Post', postSchema)
