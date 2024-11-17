const jwt = require('jsonwebtoken')
const Joi = require('joi')
const User = require('../service/schema/user')
const bcrypt = require('bcryptjs')
const secret = process.env.SECRET

const userValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
})

async function auth(req, res, next) {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.replace('Bearer ', '')

    if (!token) {
        return res.status(401).json({ message: 'Not authorized' })
    }

    try {
        const decoded = jwt.verify(token, secret)
        const user = await User.findById(decoded.id)

        if (!user || user.token !== token) {
            throw new Error('Not authorized')
        }

        req.user = user
        next()
    } catch (error) {
        res.status(401).json({ message: 'Not authorized' })
    }
}

async function loginUser (req, res) {
    const { email, password } = req.body
    const { error } = userValidationSchema.validate(req.body)
    if (error) {
        return res.status(400).json({ message: error.message })
    }

    const user = await User.findOne({ email })
    if (user) {
        return res.status(401).json({ message: 'Email or password is incorrect' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Email or password is incorrect' })
    }

    const token = jwt.sign({ id: user._id }, secret, {
        expiresIn: '1h'
    })

    user.token = token
    await user.save()

    res.status(200).json({
        token,
        user: {
            email: user.email,
            subscription: user.subscription,
        },
    })
}

async function registerUser(req, res) {
    const { email, password } = req.body
    const { error } = userValidationSchema.validate(req.body)
    if (error) {
        return res.status(400).json({ message: error.message })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
        return res.status(409).json({ message: 'Email in use' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({ email, password: hashedPassword })

    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
        }
    })
}

async function logoutUser(req, res) {
    const { _id } = req.user

    await User.findByIdAndUpdate(_id, { token: null })

    res.status(204).send()
}

async function getCurrentUser(req, res) {
    const { email, subscription } = req.user

    res.status(200).json({ email, subscription })
}


module.exports = {
    auth,
    loginUser,
    registerUser,
    logoutUser,
    getCurrentUser,
}