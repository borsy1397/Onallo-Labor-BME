const authorizationMW = require('../middlewares/general').authorizationMW;
const getUserMW = require('../middlewares/user').getUserMW;


module.exports = app => {

    app.get('/user',
        authorizationMW,
        getUserMW
    );


    // app.get('/user/all');

    // app.put('/user');

    // app.delete('/user');
};