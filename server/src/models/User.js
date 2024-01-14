// server/models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: { type: String, unique: true, minLength: 6, maxLength: 20 },
        password: { type: String, required: true, minLength: 6 },
        email: { type: String, unique: true },
        isAdmin: { type: Boolean, default: false },
    },
    { timestamps: true },
);

const User = mongoose.model('User', userSchema);

module.exports = User;
