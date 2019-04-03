const mongoose = require('../config').mongoose;

const gameResultSchema = new mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    // vagy ez legyen? users: [],
    // vagy a winner es loser is legyen tomb, ahol a szimbolumot is taroljuk?
    // lepesek: ha nem 3x3 lenne, akkor lehetnenek lepesek is (amugy is, csak nem izgalmas)
    // mennyi ideig jatszottak
    win: { type: Boolean },
    draw: { type: Boolean },
    enemy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } //vagy csak stringkent taroljuk a nevet? Elegansabb lenne, ha maga a user lenne, es akkor lehet navigalni a profiljara
    //enemy: { type: String }
    //finishedDate: { type: Date, default: Date.now },
    //roomName: {type: String},
    //moves: {type: Number}
    //playtime
    // whostart
    // createdDate
    //type
    // roomname

});

const GameResult = new mongoose.model('GameResult', gameResultSchema);

module.exports = GameResult;