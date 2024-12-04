const Joi = require('joi');

const emailSchema = Joi.object({
  email: Joi.string().email().required(),
});

const validateEmail = (req, res, next) => {
  const { error } = emailSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

module.exports = validateEmail;