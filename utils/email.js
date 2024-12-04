const nodemailer = require('nodemailer');
require('dotenv').config();

const { USER, PASS } = process.env;

const mail = nodemailer.createTransport({
  host: "smtp.mailgun.org",
  port: 587,
  secure: false,
  auth: {
    user: USER,
    pass: PASS,
  },
});

module.exports = mail