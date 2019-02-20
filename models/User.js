const mongoose = require('../config').mongoose;

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    points: Number
});

const User = new mongoose.model('User', userSchema);

module.exports = User;