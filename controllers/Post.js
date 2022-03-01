const Post = require('../models/Post')
const User = require('../models/User')
const mongoose = require('mongoose')

exports.createPost = async (req, res) => {
  try {
    const newPostData = {
      title: req.body.title,
      description: req.body.description,
      user: req.user._id,
    }

    const newPost = await Post.create(newPostData)

    const postData = {
      id: newPost._id,
      title: req.body.title,
      desc: req.body.description,
      createdAt: newPost.createdAt,
    }

    res.status(200).json({
      status: 'success',
      postData,
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
    const postStats = await Post.find({ user: req.user._id })
      .populate('comments')
      .select('-user -__v ')
      .sort({ createdAt: 1 })

    var statsToShow = []
    postStats.map((el) => {
      const newData = {
        id: el._id,
        title: el.title,
        desc: el.description,
        createdAt: el.createdAt,
        comments: el.comments,
        likes: el.likeCount,
      }
      statsToShow.push(newData)
    })

    res.status(200).json({
      status: 'success',
      statsToShow,
    })
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: error.message,
    })
  }
}

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('comments')

    if (!post) {
      return res.status(404).json({
        status: 'fail',
        message: 'post not found!',
      })
    }

    const postData = {
      id: req.params.id,
      likes: post.likeCount,
      commentsCount: post.comments.length,
      comments: post.comments,
    }

    res.status(200).json({
      status: 'success',
      postData,
    })
  } catch (error) {
    res.status(500).json({
      status: 'fail',
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

    if (!post) {
      return res.status(404).json({
        status: 'fail',
        message: 'post not found',
      })
    }

    if (!post.likes.includes(req.user._id)) {
      return res.status(400).json({
        status: 'fail',
        message: 'post is unliked already!',
      })
    } else {
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

    res.status(204).json()
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    })
  }
}
