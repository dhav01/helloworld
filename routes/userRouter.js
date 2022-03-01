const express = require('express')
const { login } = require('../controllers/Auth')
const router = express.Router()
const { isloggedIn } = require('../middlewares/isLoggedIn')
const { isValidId } = require('../middlewares/isValidId')
const { followUser, unFollowUser, getUser } = require('../controllers/User')

router.route('/authenticate').post(login)
router.route('/user').get(isloggedIn, getUser)
router.route('/follow/:id').post(isloggedIn, isValidId, followUser)
router.route('/unfollow/:id').post(isloggedIn, isValidId, unFollowUser)

module.exports = router
