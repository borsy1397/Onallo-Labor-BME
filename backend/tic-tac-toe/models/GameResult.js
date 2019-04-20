const mongoose = require('../utils/db/mongo/mongoose').mongoose;

// lehetne enumot hasznalni a win es draw helyett: result = WON || DRAW || LOST

const gameResultSchema = new mongoose.Schema({
    win: { type: Boolean },
    draw: { type: Boolean },
    enemy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } ,
    shape: { type: String},
    playTime: {type: Number} 
});

const GameResult = mongoose.model('GameResult', gameResultSchema);

module.exports = GameResult;