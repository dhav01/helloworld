const User = require('../models/User')

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
    res.status(200).json({
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
        .json({ status: fail, message: 'user does not exist!' })

    //if exists, validating the user password
    const isMatch = user.matchPassword(password, user.password)

    if (!isMatch)
      return res
        .status(400)
        .json({ status: fail, message: 'incorrect email or password!' })

    const token = await user.generateToken(user._id)

    res.status(200).cookie('token', token).json({
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
