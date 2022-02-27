const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
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
userSchema.pre('save', async function (next) {
  //only run the func if password is modified or added
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12) //encrypting the password
  }
  next()
})

userSchema.methods.matchPassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password)
}

userSchema.methods.generateToken = async function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })
}

module.exports = mongoose.model('User', userSchema)
