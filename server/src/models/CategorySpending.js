const mongoose = require('mongoose');

const categorySpendingSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

const CategorySpending = mongoose.model('CategorySpending', categorySpendingSchema);

module.exports = CategorySpending;