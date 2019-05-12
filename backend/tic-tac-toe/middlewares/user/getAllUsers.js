const User = require('../../models/User');
const UsersListDTO = require('../../models/dto/UsersListDTO');

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
                let usersDTO = [];

                users.forEach(user => {
                    usersDTO.push(UsersListDTO(user));
                })

                return res.status(200).json({
                    users: usersDTO,
                    myPosition: req.position
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: 'Users did not found'
            });
        });
}