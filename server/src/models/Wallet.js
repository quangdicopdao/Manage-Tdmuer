const mongoose = require('mongoose');

// Định nghĩa schema cho mục chi tiêu
const walletSchema = new mongoose.Schema({
  
  Initialbalance: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Tạo model từ schema
const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;
