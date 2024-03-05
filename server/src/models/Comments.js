const mongoose = require('mongoose');
const moment = require('moment-timezone');

const commentSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    content: { type: String, required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, default: null },
    createdAt: { type: Date, default: () => moment().tz('Asia/Ho_Chi_Minh').toDate() },
});

module.exports = mongoose.model('Comment', commentSchema);
