const mongoose = require('../config').mongoose;

const gameResultSchema = new mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    // vagy ez legyen? users: [],
    // vagy a winner es loser is legyen tomb, ahol a szimbolumot is taroljuk?
    // lepesek: ha nem 3x3 lenne, akkor lehetnenek lepesek is 
    winner: {type: String, unique: true },
    loser: {type: String, unique: true },
    finishedDate: { type: Date, default: Date.now },
    //points: Number
});

const GameResult = new mongoose.model('GameResult', gameResultSchema);

module.exports = GameResult;