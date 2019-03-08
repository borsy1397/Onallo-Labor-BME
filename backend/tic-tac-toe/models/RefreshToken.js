const mongoose = require('../config').mongoose;

const refreshTokenSchema = new mongoose.Schema({
    token: {type: String, required: true },  
    username: {type: String, required: true }
});


const RefreshToken = new mongoose.model('RefreshToken', refreshTokenSchema);

module.exports = RefreshToken;