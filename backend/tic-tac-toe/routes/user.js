const authorizeMW = require('../middlewares/general/authorize');
const getUserByIdMW = require('../middlewares/user/getUserById');
const getUserByUsernameMW = require('../middlewares/user/getUserByUsername');
const getAllUsersMW = require('../middlewares/user/getAllUsers');
const getPositionMW = require('../middlewares/user/getPosition');
const createUserMW = require('../middlewares/user/createUser');
const deleteUserMW = require('../middlewares/user/deleteUser');


module.exports = app => {
    app.get('/users/:id',
        authorizeMW,
        getUserByIdMW
    );

    app.get('/users/search/:username',
        authorizeMW,
        getUserByUsernameMW
    );

    app.get('/users',
        authorizeMW,
        getPositionMW,
        getAllUsersMW
    );

    app.delete('/users/:id',
        authorizeMW,
        deleteUserMW
    );

    // update

    app.post('/users',
        createUserMW
    );
};