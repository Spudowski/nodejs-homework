const express = require('express')
const router = express.Router()
const {
    loginUser,
    registerUser,
    logoutUser,
    getCurrentUser
} = require('../controller/userCont')

router.get('/logout', logoutUser)

router.get('/current', getCurrentUser)

router.post('/login', loginUser)

router.post('/signup', registerUser)

module.exports = router