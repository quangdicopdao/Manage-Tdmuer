const mongoose = require('mongoose');

// Định nghĩa schema cho mục chi tiêu
const spendingSchema = new mongoose.Schema({
  // title: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, required: true },
});

// Tạo model từ schema
const Spending = mongoose.model('Spending', spendingSchema);

module.exports = Spending;
