const mongoose = require('../utils/db/mongo/mongoose').mongoose;

const refreshTokenSchema = new mongoose.Schema({
    token: {type: String, required: true },  
    username: {type: String, required: true }
});


const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

module.exports = RefreshToken;