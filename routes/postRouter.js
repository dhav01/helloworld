const express = require('express')
const { createPost } = require('../controllers/post')
const { register, login } = require('../controllers/user')

const router = express.Router()

// router.route('/all_posts').get(getAllPosts)
// router.route('/posts').post(createPost)

router.route('/register').post(register)
router.route('/authenticate').post(login)

// router.route('/posts/:id').get(getPost).delete(deletePost)

module.exports = router
