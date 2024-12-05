const express = require('express')
const router = express.Router()
const {
    verifyUser,
} = require('../controller/userCont')

router.get('/verify/:verificationToken', verifyUser)

module.exports = router