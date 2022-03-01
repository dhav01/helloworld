const User = require('../models/User')

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    const userData = {
      name: user.name,
      followers: user.followersCount,
      following: user.followingCount,
    }

    res.status(200).json({
      status: 'success',
      userData,
    })
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      error: error.message,
    })
  }
}

exports.followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id)
    const loggedUser = await User.findById(req.user._id)

    if (!userToFollow) {
      return res.status(404).json({
        status: 'fail',
        error: 'User not found!',
      })
    }

    if (loggedUser.following.includes(userToFollow._id)) {
      return res.status(400).json({
        status: 'fail',
        message: 'User already followed',
      })
    }

    loggedUser.following.push(userToFollow)
    userToFollow.followers.push(loggedUser)

    await loggedUser.save()
    await userToFollow.save()

    res.status(200).json({
      status: 'success',
      message: 'user followed successfully!',
    })
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      error: error.message,
    })
  }
}
exports.unFollowUser = async (req, res) => {
  try {
    const userToUnFollow = await User.findById(req.params.id)
    const loggedUser = await User.findById(req.user._id)

    if (!userToUnFollow) {
      return res.status(404).json({
        status: 'fail',
        error: 'User not found!',
      })
    }

    if (!loggedUser.following.includes(userToUnFollow._id)) {
      return res.status(400).json({
        status: 'fail',
        message: 'User not followed already!',
      })
    }

    const followingIndex = loggedUser.following.indexOf(userToUnFollow._id)
    loggedUser.following.splice(followingIndex, 1)

    const followerIndex = userToUnFollow.followers.indexOf(loggedUser._id)
    userToUnFollow.followers.splice(followerIndex, 1)

    await loggedUser.save()
    await userToUnFollow.save()

    res.status(200).json({
      status: 'success',
      message: 'user unfollowed successfully!',
    })
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      error: error.message,
    })
  }
}
