// Central error handler: turns errors into clean JSON responses
module.exports = (err, req, res, next) => {
  // Invalid JSON body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Invalid JSON body' });
  }

  // Invalid ObjectId format (e.g. /api/categories/abc)
  if (err.name === 'CastError') {
    return res
      .status(404)
      .json({ success: false, message: 'Resource not found (invalid ID)' });
  }

  // Mongoose validation errors (missing required field, etc.)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res
      .status(400)
      .json({ success: false, message: messages.join(', '), errors: messages });
  }

  // Duplicate key (unique field)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res
      .status(400)
      .json({ success: false, message: `${field} already exists` });
  }

  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server error',
  });
};
