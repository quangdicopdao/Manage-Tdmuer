// models/Posts.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        start: { type: Date, required: true },
        end: { type: Date, required: true },
        tagId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tag', required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    {
        timestamps: true,
    },
);

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
