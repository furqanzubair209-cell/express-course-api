const router = require('express').Router();
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');

router.route('/').get(getCategories).post(protect, createCategory);

router
  .route('/:id')
  .get(getCategory)
  .put(protect, updateCategory)
  .delete(protect, deleteCategory);

module.exports = router;
