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

    // app.post('/logout', authorizationMW, (req, res, next) => {
    //     res.status(200).json({
    //         message: "fassssza"
    //     })
    // });

    app.post('/signup',
        signUpUserMW
    );

    app.get('/', (req, res, next) => {
        res.send('<h1>Tic-Tac-Toe Game</h1>');
    });


}