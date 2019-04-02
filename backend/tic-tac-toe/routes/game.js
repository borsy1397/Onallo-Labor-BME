const authorizationMW = require('../middlewares/general').authorizationMW;
const getGames = require('../middlewares/game').getGames;

module.exports = (app, redisDB) => {

    app.get('/getGames',
        authorizationMW,
        getGames(redisDB)
    );	
}