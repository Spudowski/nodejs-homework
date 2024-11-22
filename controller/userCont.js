const jwt = require('jsonwebtoken')
const Joi = require('joi')
const User = require('../service/schema/user')
const bcrypt = require('bcryptjs')

const userValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
})

async function loginUser(req, res) {
  const { email, password } = req.body;

  const { error } = userValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Email or password is incorrect' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Email or password is incorrect' });
  }

  const token = jwt.sign({ id: user._id }, process.env.SECRET, {
    expiresIn: '1h',
  });

  user.token = token;
  await user.save();

  res.status(200).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

async function registerUser(req, res) {
  const { email, password } = req.body;

  const { error } = userValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: 'Email in use' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

async function logoutUser(req, res) {
    const { _id } = req.user

    await User.findByIdAndUpdate(_id, { token: null })

    res.status(204).send()
}

async function getCurrentUser(req, res) {
    const { _id, email, subscription } = req.user

    res.status(200).json({ id:_id, email, subscription })
}


module.exports = {
    loginUser,
    registerUser,
    logoutUser,
    getCurrentUser,
}