const signUpUserMW = require('../middlewares/general').signupMW;
const loginMW = require('../middlewares/general').loginMW;
const refreshTokenMW = require('../middlewares/general').refreshTokenMW;

module.exports = app => {
    
    app.post('/login',
        loginMW
    );

    app.post('/token',
        refreshTokenMW
    );

    // nem kell olyan, hogy sign up, hanem ezt a userhez kell rakni, hogy post legyen
    app.post('/signup',
        signUpUserMW
    );

}