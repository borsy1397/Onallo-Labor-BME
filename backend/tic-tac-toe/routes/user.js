const authorizationMW = require('../middlewares/general').authorizationMW;
const getUserMW = require('../middlewares/user').getUserMW;


module.exports = app => {

    /*app.get('/user',
        authorizationMW,
        getUserMW
    );*/

    app.get('/users/{id}',
        authorizationMW,
        getUserMW
    );

    // app.get('/users/{id}');

    // app.put('/users/{id}');

    // app.delete('/users/{id}');

    // app.get('/users');

    // app.post('/users');


};