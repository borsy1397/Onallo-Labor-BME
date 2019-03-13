const authorizationMW = require('../middlewares/general').authorizationMW;
const getGamesMW = require('../middlewares/game').getGamesMW;
const createRoomMW = require('../middlewares/game').createRoomMW;
const joinRoomMW = require('../middlewares/game').joinRoomMW;

module.exports = (app) => {

    // app.get('/games', 
    //     authorizationMW,
    //     getGamesMW
    // );

    // app.post('/create',
    //     authorizationMW,
    //     createRoomMW
    // );
    
    // app.post('/game',
    //     authorizationMW,
    //     joinRoomMW
    // );

}