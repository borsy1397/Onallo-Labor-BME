const authorizationMW = require('../middlewares/general').authorizationMW;
const getUserMW = require('../middlewares/user').getUserMW;


module.exports = app => {

    /**
     * Get all users
     */
    app.get('/user/all', );


    /**
     * Profile
     */
    app.get('/user',
        authorizationMW,
        getUserMW
    );

    app.put('/user', );

    app.delete('/user', );
};