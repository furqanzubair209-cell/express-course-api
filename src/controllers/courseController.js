const mongoose = require('mongoose');
const Course = require('../models/Course');
const Category = require('../models/Category');
const asyncHandler = require('../middleware/asyncHandler');

// Checks the category id is valid and exists. Returns an error response or null.
const checkCategory = async (categoryId, res) => {
  if (!mongoose.isValidObjectId(categoryId)) {
    res.status(400).json({ success: false, message: 'category must be a valid ID' });
    return true;
  }
  const exists = await Category.exists({ _id: categoryId });
  if (!exists) {
    res.status(404).json({ success: false, message: 'Category not found' });
    return true;
  }
  return false;
};

// POST /api/courses
exports.createCourse = asyncHandler(async (req, res) => {
  const { title, description, price, category } = req.body || {};

  const missing = ['title', 'category'].filter((f) => !req.body?.[f]);
  if (missing.length) {
    return res
      .status(400)
      .json({ success: false, message: `${missing.join(', ')} is required` });
  }

  if (await checkCategory(category, res)) return;

  const course = await Course.create({ title, description, price, category });
  const populated = await course.populate('category', 'name description');

  res.status(201).json({
    success: true,
    message: 'Course created successfully',
    data: populated,
  });
});

// GET /api/courses   (optional filter: ?category=<id>)
exports.getCourses = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;

  const courses = await Course.find(filter)
    .populate('category', 'name description')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: courses.length, data: courses });
});

// GET /api/courses/:id
exports.getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate(
    'category',
    'name description'
  );
  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found' });
  }
  res.status(200).json({ success: true, data: course });
});

// PUT /api/courses/:id
exports.updateCourse = asyncHandler(async (req, res) => {
  const { title, description, price, category } = req.body || {};
  const update = {};
  if (title !== undefined) update.title = title;
  if (description !== undefined) update.description = description;
  if (price !== undefined) update.price = price;
  if (category !== undefined) {
    if (await checkCategory(category, res)) return;
    update.category = category;
  }

  if (Object.keys(update).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Provide at least one field to update (title, description, price, category)',
    });
  }

  const course = await Course.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
  }).populate('category', 'name description');

  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found' });
  }
  res.status(200).json({
    success: true,
    message: 'Course updated successfully',
    data: course,
  });
});

// DELETE /api/courses/:id
exports.deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found' });
  }
  res.status(200).json({ success: true, message: 'Course deleted successfully' });
});
