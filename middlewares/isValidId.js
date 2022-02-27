const mongoose = require('mongoose')

//if someone uses invalid objectId

exports.isValidId = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({
      status: 'fail',
      message: 'please enter valid objectId',
    })
  next()
}
