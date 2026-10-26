const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body || {};

  const missing = ['name', 'email', 'password'].filter((f) => !req.body?.[f]);
  if (missing.length) {
    return res
      .status(400)
      .json({ success: false, message: `${missing.join(', ')} is required` });
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    return res
      .status(400)
      .json({ success: false, message: 'Email already registered' });
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    token: signToken(user._id),
    user: { id: user._id, name: user.name, email: user.email },
  });
});

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: 'email and password are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res
      .status(401)
      .json({ success: false, message: 'Invalid email or password' });
  }

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token: signToken(user._id),
    user: { id: user._id, name: user.name, email: user.email },
  });
});

// GET /api/auth/me  (protected)
exports.getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: { id: req.user._id, name: req.user.name, email: req.user.email },
  });
});
