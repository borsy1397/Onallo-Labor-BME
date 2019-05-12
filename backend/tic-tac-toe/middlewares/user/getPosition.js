const User = require('../../models/User');

module.exports = (req, res, next) => {
    User.find()
        .sort({ points: -1 })
        .exec()
        .then(users => {
            if (!users) {
                return res.status(404).json({
                    message: "Users did not found"
                });
            } else {
                const position = indexOf(users, req.userData.username);
                req.position = position;

                next();
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: 'Users did not found'
            });
        });
}

function indexOf(users, username) {
    for(let i = 0; i < users.length; i++) {
        if(users[i].username == username) {
            return i+1;
        }
    }
    return -1;
}