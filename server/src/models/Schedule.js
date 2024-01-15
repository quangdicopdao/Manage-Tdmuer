const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const scheduleSchema = new Schema(
    {
        title: { type: String, required: true },
        timeStart: { type: Date, required: true },
        timeEnd: { type: Date, required: true },
        description: { type: String, required: true },
        uid: { type: String, required: true },
    },
    {
        timestamps: true,
    },
);

const Post = mongoose.model('Schedule', scheduleSchema);

module.exports = Post;
