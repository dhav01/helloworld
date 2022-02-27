const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please specify your name'],
  },
  email: {
    type: String,
    unique: [true, 'email already exists!'],
    required: [true, 'Please specify your email id'],
  },
  password: {
    type: String,
    required: [true, 'Please enter a valid password'],
    minLength: [6, 'password length should be more than 5 characters'],
    select: false,
  },
  posts: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
    },
  ],

  followers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
  following: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
})

module.exports = mongoose.model('User', userSchema)
