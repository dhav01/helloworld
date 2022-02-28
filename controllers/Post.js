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

exports.getAllPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('posts')
    res.status(200).json({
      status: 'success',
      data: { user },
    })
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: error.message,
    })
  }
}

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    //incorrect id or post deleted before liking
    if (!post) {
      return res.status(404).json({
        status: 'fail',
        message: 'post not found',
      })
    }

    //if post is already liked
    if (post.likes.includes(req.user._id)) {
      return res.status(400).json({
        status: 'fail',
        message: 'post already liked',
      })
    } else {
      post.likes.push(req.user._id)

      await post.save()

      res.status(200).json({
        status: 'success',
        message: 'post liked',
      })
    }
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    })
  }
}

exports.unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    //incorrect id or post deleted before liking
    if (!post) {
      return res.status(404).json({
        status: 'fail',
        message: 'post not found',
      })
    }

    //if post is not liked
    if (!post.likes.includes(req.user._id)) {
      return res.status(400).json({
        status: 'fail',
        message: 'post is unliked already!',
      })
    } else {
      //removing the liked post from the user document
      const index = post.likes.indexOf(req.user._id)
      post.likes.splice(index, 1)
      await post.save()

      res.status(200).json({
        status: 'success',
        message: 'post unliked successfully',
      })
    }
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    })
  }
}

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    //invalid post id
    if (!post) {
      return res.status(404).json({
        status: 'fail',
        message: 'post not found',
      })
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not authorised to delete this post!',
      })
    }

    await post.remove()

    //removing the post from user document as well
    const user = await User.findById(req.user._id)
    const index = user.posts.indexOf(req.params.id)
    user.posts.splice(index, 1)
    await user.save()

    res.status(204).json()
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    })
  }
}
