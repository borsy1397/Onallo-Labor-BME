const signUpUserMW = require('../middlewares/user').signupMW;
const loginMW = require('../middlewares/user').loginMW;
const authorizationMW = require('../middlewares/user').authorizationMW;
module.exports = app => {
    

    app.post('/login',
        loginMW
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