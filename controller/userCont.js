const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const mail = require('../utils/email')
const fs = require('fs/promises')
const path = require('path')
const Jimp = require("jimp")
const Joi = require('joi')
const User = require('../service/schema/user')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const avatarsDir = path.join(__dirname, '../public/avatars')

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
  const verificationToken = uuidv4()
  const avatarURL = gravatar.url(email, { s: '250', d: 'identicon' }, true);

  const newUser = await User.create({
    email,
    password: hashedPassword,
    avatarURL,
    verificationToken,
  });

  console.log('Generated veri toekn:', verificationToken)

  const verificationRoute = `/auth/verify/${verificationToken}`
  const verificationLink = `${process.env.BASE_URL}${verificationRoute}`

  await mail.sendMail({
    from: 'Adrian D. <noreply@fakecompany.com>',
    to: [email],
    subject: 'Email Verification',
    html: `
    <p>Please verify your email by clicking the link below:</p>
    <a href="${verificationLink}">${verificationLink}</a>`,
  })

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
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

async function updateAvatar(req, res) {
  
  if (!req.file) {
  return res.status(400).json({ message: 'No file uploaded' });
  }
  
  const { path: temporaryPath, originalname } = req.file;
  const { _id } = req.user;

  try {
    const avatarName = `${_id}-${originalname}`;
    const resultPath = path.join(avatarsDir, avatarName);

    const image = await Jimp.read(temporaryPath);
    await image.resize(250, 250).write(resultPath);

    await fs.unlink(temporaryPath);

    const avatarURL = `/avatars/${avatarName}`;
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.status(200).json({ avatarURL });
  } catch (error) {
    await fs.unlink(temporaryPath);
    res.status(500).json({ message: error.message });
  }
}

async function verifyUser(req, res) {
  const { verificationToken } = req.params

  const user = await User.findOne({ verificationToken })
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  user.verify = true
  await user.save()

  res.status(200).json({ message: 'Verification successful' })
}

async function resendVeriEmail(req, res) {
  const { email } = req.body
  const { verificationToken } = req.params

  if (!email) {
    return res.status(400).json({ message: 'Missing required field email' })
  }

  const user = await User.findOne({ email })
  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }

  if (user.verify) {
    return res.status(400).json({ message: 'Verification has already been passed' })
  }

  const verificationRoute = `/auth/verify/${verificationToken}`
  const verificationLink = `${process.env.BASE_URL}${verificationRoute}`

  await mail.sendMail({
    from: 'Adrian D. <noreply@fakecompany.com>',
    to: [email],
    subject: 'Email Verification',
    html: `
    <p>Please verify your email by clicking the link below:</p>
    <a href="${verificationLink}">${verificationLink}</a>`,
  })

  res.status(200).json({ message: 'Verification email sent' })
}


module.exports = {
    loginUser,
    registerUser,
    logoutUser,
    getCurrentUser,
    updateAvatar,
    verifyUser,
    resendVeriEmail,
}