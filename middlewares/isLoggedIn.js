const User = require('../models/User')
const jwt = require('jsonwebtoken')

exports.isloggedIn = async (req, res, next) => {
  try {
    const { token } = req.cookies
    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'login first to continue!',
      })
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET)
    console.log(decoded)
    const user = await User.findById(decoded.id)

    //incase user deleted the account or someone modified the cookie
    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' })
    }
    req.user = user
    next()
  } catch (error) {
    res.status(500).json({ status: 'fail', error: error.message })
  }
}
