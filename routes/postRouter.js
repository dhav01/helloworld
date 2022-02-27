const express = require('express')
const {
  createPost,
  getAllPosts,
  likePost,
  unlikePost,
} = require('../controllers/post')
const { register, login } = require('../controllers/user')
const { isloggedIn } = require('../middlewares/isLoggedIn')
const { isValidId } = require('../middlewares/isValidId')

const router = express.Router()

router.route('/posts').post(isloggedIn, createPost)
router.route('/all_posts').get(isloggedIn, getAllPosts)

router.route('/like/:id').post(isloggedIn, isValidId, likePost)
router.route('/unlike/:id').post(isloggedIn, isValidId, unlikePost)
// router
//   .route('/posts/:id')
//   .get(isloggedIn, getPost)
//   .delete(isloggedIn, deletePost)

router.route('/register').post(register)
router.route('/authenticate').post(login)

// router.route('/posts/:id').get(getPost).delete(deletePost)

module.exports = router
