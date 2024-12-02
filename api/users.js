const express = require('express')
const router = express.Router()
const upload = require('../middleware/upload')
const {
    loginUser,
    registerUser,
    logoutUser,
    getCurrentUser,
    updateAvatar,
} = require('../controller/userCont')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/logout', authMiddleware, logoutUser)

router.get('/current', authMiddleware, getCurrentUser)

router.post('/login', loginUser)

router.post('/signup', registerUser)

router.patch('/avatars', authMiddleware, upload.single('avatar'), updateAvatar)

module.exports = router