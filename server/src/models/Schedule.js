const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const scheduleSchema = new Schema(
    {
        title: { type: String, required: true },
        start: { type: Date, required: true },
        end: { type: Date, required: true },
        description: { type: String },
        statusWork: { type: Number, default: 0, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    {
        timestamps: true,
    },
);

const Post = mongoose.model('Schedule', scheduleSchema);

module.exports = Post;
