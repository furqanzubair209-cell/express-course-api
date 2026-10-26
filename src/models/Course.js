const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'title is required'], trim: true },
    description: { type: String, trim: true, default: '' },
    price: { type: Number, min: [0, 'price cannot be negative'], default: 0 },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'category is required'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
