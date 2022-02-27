const User = require('../models/User')

const cookieOptions = {
  expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  httpOnly: true,
}
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({
        status: 'fail',
        message: 'User already exists!',
      })
    }

    user = await User.create({ name, email, password })

    const token = await user.generateToken(user._id)
    res.status(201).cookie('token', token, cookieOptions).json({
      status: 'success',
      user,
    })
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+password')

    //checking whether user exists
    if (!user)
      return res
        .status(400)
        .json({ status: 'fail', message: 'user does not exist!' })

    //if exists, validating the user password
    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'incorrect email or password!' })
    }

    const token = await user.generateToken(user._id)

    res.status(200).cookie('token', token, cookieOptions).json({
      status: 'success',
      user,
    })
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    })
  }
}
