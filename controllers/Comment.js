const User = require('../models/User')
const Post = require('../models/Post')
const Comment = require('../models/Comment')

exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({
        status: 'fail',
        message: 'invalid post id!',
      })
    }

    const newCommentData = {
      comment: req.body.comment,
      userId: req.user.id,
      postId: req.params.id,
    }

    const newComment = await Comment.create(newCommentData)

    const commentData = {
      id: newComment._id,
    }

    res.status(200).json({
      status: 'success',
      commentData,
    })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error: error.message,
    })
  }
}
