const Category = require('../models/Category');
const Course = require('../models/Course');
const asyncHandler = require('../middleware/asyncHandler');

// POST /api/categories
exports.createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body || {};

  if (!name || !String(name).trim()) {
    return res.status(400).json({ success: false, message: 'name is required' });
  }

  const category = await Category.create({ name, description });
  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: category,
  });
});

// GET /api/categories
exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories,
  });
});

// GET /api/categories/:id
exports.getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }
  res.status(200).json({ success: true, data: category });
});

// PUT /api/categories/:id
exports.updateCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body || {};
  const update = {};
  if (name !== undefined) update.name = name;
  if (description !== undefined) update.description = description;

  if (Object.keys(update).length === 0) {
    return res
      .status(400)
      .json({ success: false, message: 'Provide name or description to update' });
  }

  const category = await Category.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
  });
  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }
  res.status(200).json({
    success: true,
    message: 'Category updated successfully',
    data: category,
  });
});

// DELETE /api/categories/:id
exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }

  const inUse = await Course.countDocuments({ category: category._id });
  if (inUse > 0) {
    return res.status(400).json({
      success: false,
      message: `Cannot delete: ${inUse} course(s) use this category`,
    });
  }

  await category.deleteOne();
  res.status(200).json({ success: true, message: 'Category deleted successfully' });
});
