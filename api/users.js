const express = require('express')
const router = express.Router()
const {
    auth,
    loginUser,
    registerUser,
    logoutUser,
    getCurrentUser
} = require('../controller/userCont')

router.get('/logout', auth, logoutUser)

router.get('/current', auth, getCurrentUser)

router.post('/login', loginUser)

router.post('/signup', registerUser)

module.exports = router