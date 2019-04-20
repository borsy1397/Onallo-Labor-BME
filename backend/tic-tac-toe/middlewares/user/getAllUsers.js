const User = require('../../models/User');
const UsersListDTO = require('../../models/dto/UsersListDTO');

// azert visszakuldeni a poziciot, mert ha lapozas van, akkor nem tudjuk kliensoldalon, hogy hanyadik
// max 20-at visszakuldeni, vagy lapozhatoan megcsinalni? Legyen lapozhato, ha lesz ido ra
// ugyhogy frontenden is majd implementalni a paginget (skip())

module.exports = (req, res, next) => {
    User.find()
        .sort({ points: -1 })
        .limit(5)
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