const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please specify your name'],
    },
    email: {
      type: String,
      unique: [true, 'email already exists!'],
      required: [true, 'Please specify your email id'],
      validate: [validator.isEmail, 'please enter valid email address'],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please enter a valid password'],
      minLength: [6, 'password length should be more than 5 characters'],
      select: false,
    },
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

//using virtual property to avoid saving post ids in user document
userSchema.virtual('posts', {
  ref: 'Post',
  foreignField: 'user',
  localField: '_id',
})

userSchema.virtual('followersCount').get(function () {
  return this.followers.length
})

userSchema.virtual('followingCount').get(function () {
  return this.following.length
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
