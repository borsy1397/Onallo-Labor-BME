const loginMW = require('../middlewares/general/login');
const hashPasswordMW = require('../middlewares/general/hashPassword');
const refreshTokenMW = require('../middlewares/general/token');

module.exports = app => {
    app.post('/login',
        loginMW,
        hashPasswordMW,
    );

    app.post('/token',
        refreshTokenMW
    );

    // majd ha eljutok odaig, akkor password reset es emailes account megerosites
}