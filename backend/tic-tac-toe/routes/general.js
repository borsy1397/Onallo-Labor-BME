const loginMW = require('../middlewares/general/login');
const refreshTokenMW = require('../middlewares/general/token');

module.exports = app => {
    app.post('/login',
        loginMW
    );

    app.post('/token',
        refreshTokenMW
    );

    // majd ha eljutok odaig, akkor password reset es emailes account megerosites
}