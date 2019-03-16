const mongoose = require('../config').mongoose;

const userSchema = new mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    email: {type: String, unique: true, required: true },  
    username: {type: String, unique: true, required: true }, //trim
    password: {type: String, required: true },
    //firstName: { type: String, required: true },
    //lastName: { type: String, required: true },
    //createdDate: { type: Date, default: Date.now },
    //points: Number
});

// functions?

const User = new mongoose.model('User', userSchema);

module.exports = User;