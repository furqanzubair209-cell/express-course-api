const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('./asyncHandler');

// Protects routes: requires "Authorization: Bearer <token>"
const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';

  if (!header.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ success: false, message: 'Not authorized, token missing' });
  }

  const token = header.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: 'Not authorized, token invalid or expired' });
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: 'Not authorized, user no longer exists' });
  }

  req.user = user;
  next();
});

module.exports = { protect };
