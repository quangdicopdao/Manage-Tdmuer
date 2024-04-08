const mongoose = require('mongoose');

const listJoinSchema = new mongoose.Schema(
    {
        studentId: { type: String, required: true },
        fullName: { type: String, required: true },
        classId: { type: String, required: true },
        department: { type: String, required: true },
        email: { type: String, required: true },
        imageUrl: { type: String, default: 'No image' },
        isPresent: { type: Boolean, default: false },
        mark: { type: Number, default: 0 },
        userId: { type: mongoose.Schema.ObjectId, ref: 'User' },
        postId: { type: mongoose.Schema.ObjectId, ref: 'Posts' },
    },
    { timestamps: true },
);
const ListJoin = mongoose.model('ListJoin', listJoinSchema);

module.exports = ListJoin;
