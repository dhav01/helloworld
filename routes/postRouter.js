const express = require('express')
const {
  createPost,
  getAllPosts,
  likePost,
  unlikePost,
  deletePost,
  getPost,
} = require('../controllers/post')

const { isloggedIn } = require('../middlewares/isLoggedIn')
const { isValidId } = require('../middlewares/isValidId')
const userRouter = require('../routes/userRouter')
const { addComment } = require('../controllers/Comment')

const router = express.Router()

router.route('/posts').post(isloggedIn, createPost)
router.route('/all_posts').get(isloggedIn, getAllPosts)

router.route('/like/:id').post(isloggedIn, isValidId, likePost)
router.route('/unlike/:id').post(isloggedIn, isValidId, unlikePost)
router
  .route('/posts/:id')
  .delete(isloggedIn, isValidId, deletePost)
  .get(isloggedIn, isValidId, getPost)
router.route('/comment/:id').post(isloggedIn, isValidId, addComment)

router.route('*').all(userRouter)

module.exports = router
