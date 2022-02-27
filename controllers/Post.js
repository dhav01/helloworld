const Post = require('../models/Post')
const User = require('../models/User')

exports.createPost = async (req, res) => {
  try {
    const newPostData = {
      title: req.body.title,
      description: req.body.description,
      user: req.user._id,
    }

    const newPost = await Post.create(newPostData)

    //adding the new post to user's document
    const user = await User.findById(req.user._id)
    user.posts.push(newPost._id)

    await user.save()

    res.status(200).json({
      status: 'success',
      newPost,
    })
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    })
  }
}
