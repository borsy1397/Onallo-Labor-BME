const mongoose = require('../utils/db/mongo/mongoose').mongoose;

const userSchema = new mongoose.Schema({
    email: {type: String, unique: true, required: true, trim: true},  
    username: {type: String, unique: true, required: true, trim: true},
    password: {type: String, required: true, trim: true},
    games: [{type: mongoose.Schema.Types.ObjectId, ref: 'GameResult'}],
    joined: { type: Date},
    points: Number
});

const User = mongoose.model('User', userSchema);

module.exports = User;