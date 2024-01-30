// models/Posts.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    Chatusers:{
        type:Array, 
        require:true,
    },
    message:{
        type: String,
        require:true,
    },
    Sender:{
        type: mongoose.Schema.Types.ObjectId,
        require:true,
    }
}, {timestamps:true});

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;
