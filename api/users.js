const express = require('express')
const router = express.Router()
const {
    loginUser,
    registerUser,
    logoutUser,
    getCurrentUser
} = require('../controller/userCont')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/logout', logoutUser)

router.get('/current', authMiddleware, getCurrentUser)

router.post('/login', loginUser)

router.post('/signup', registerUser)

module.exports = router