// models/Posts.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        imageURL: { type: String, required: true },
        userPost: { type: String, required: true },
    },
    {
        timestamps: true,
    },
);

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
