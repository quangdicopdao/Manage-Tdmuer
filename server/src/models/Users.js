// models/Users.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        authID: { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
    },
    {
        timestamps: true,
    },
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
