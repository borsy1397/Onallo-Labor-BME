const signUpUserMW = require('../middlewares/user').signupMW;
const loginMW = require('../middlewares/user').loginMW;
const authorizationMW = require('../middlewares/user').authorizationMW;
const refreshTokenMW = require('../middlewares/user').refreshTokenMW;
module.exports = app => {
    

    app.post('/login',
        loginMW
    );

    app.post('/token',
        refreshTokenMW
    );

    app.post('/logout', authorizationMW, (req, res, next) => {
        res.status(200).json({
            message: "fassssza"
        })
    });

    app.post('/signup',
        signUpUserMW
    );

    app.get('/', (req, res, next) => {
        res.send('<h1>Tic-Tac-Toe Game</h1>');
    });


}