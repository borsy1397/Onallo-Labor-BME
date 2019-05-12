const bcrypt = require('bcrypt');
const RefreshToken = require('../../models/RefreshToken');
const secretKeys = require('../../utils/secret').secretKeys;
const jwt = require('jsonwebtoken');
const randToken = require('rand-token');
const UserDTO = require('../../models/dto/UserDTO');

module.exports = (req, res, next) => {

    bcrypt.compare(req.body.password, res.locals.user.password, (err, result) => {
        if (err) {
            return res.status(400).json({
                message: "You have entered an invalid username or password2"
            });
        }

        if (result) {

            // ezt is uj middlewarebe!!!!
            const token = jwt.sign({ username: res.locals.user.username, id: res.locals.user._id }, secretKeys.tokenSecret, { expiresIn: "30m" }); // EXPIREEEEEEEEE
            // userid??
            const refreshToken = randToken.uid(256);

            const refreshTokenDB = new RefreshToken({
                token: refreshToken,
                username: res.locals.user.username,
            });

            refreshTokenDB
                .save()
                .then(result => { })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err,
                        message: "There is a refresh token yet this id"
                    });
                });

                

            return res.status(200).json({
                message: "Authentication is successful",
                token: token,
                refreshToken: refreshToken,
                user: UserDTO(res.locals.user, true)
            });
        } else {
            return res.status(400).json({
                message: "You have entered an invalid username or password3"
            });
        }
    });
}