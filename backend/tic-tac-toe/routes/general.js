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

    app.post('/signup',
        signUpUserMW
    );

}