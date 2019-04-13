const mongoose = require('../config').mongoose;

const gameResultSchema = new mongoose.Schema({
    win: { type: Boolean },
    draw: { type: Boolean },
    enemy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } ,
    shape: { type: String},
    playTime: {type: Number} // play time in sec
});

const GameResult = new mongoose.model('GameResult', gameResultSchema);

module.exports = GameResult;