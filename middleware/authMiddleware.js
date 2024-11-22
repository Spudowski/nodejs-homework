const jwt = require('jsonwebtoken');
const User = require('../service/schema/user');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.token !== token) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized' });
  }
};

module.exports = authMiddleware;
