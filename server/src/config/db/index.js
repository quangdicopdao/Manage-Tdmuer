const mongoose = require('mongoose');
async function connect() {
    try {
        mongoose.connect('mongodb://127.0.0.1:27017/manager_tdmuer_dev');
        console.log('database Connected!');
    } catch (error) {
        console.log('Connection failure: ' + error);
    }
}

module.exports = { connect };
