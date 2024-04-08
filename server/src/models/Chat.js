// models/Posts.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    group: {
        type: mongoose.Schema.Types.ObjectId, 
        require:true,
        ref: 'Group' 
    },
    Chatusers:{
        type:Array, 
        require:true,
        ref: 'User'
    },
    message:{
        type: String,
        require:true,
    },
    Sender:{
        type: mongoose.Schema.Types.ObjectId,
        require:true,
        ref: 'User'
    }
}, {timestamps:true});

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;

