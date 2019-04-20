const authorizeMW = require('../middlewares/general/authorize');
const getGamesMW = require('../middlewares/game/getGames');

module.exports = (app, redisDB) => {

    app.get('/games',
        authorizeMW,
        getGamesMW(redisDB)
    );	
}