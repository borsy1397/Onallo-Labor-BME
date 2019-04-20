const User = require('../../models/User');
const bcrypt = require('bcrypt');
const RefreshToken = require('../../models/RefreshToken');
const secretKeys = require('../../assets/secret').secretKeys;
const jwt = require('jsonwebtoken');
const randToken = require('rand-token');

module.exports = (req, res, next) => {
    const data = {
        username: req.body.username,
        password: req.body.password
    };

    User.findOne({ username: data.username })
        .exec()
        .then(user => {
            if (!user) {
                return res.status(400).json({
                    message: "You have entered an invalid username or password1"
                });
            } else {
                bcrypt.compare(data.password, user.password, (err, result) => {
                    if (err) {
                        return res.status(400).json({
                            message: "You have entered an invalid username or password2"
                        });
                    }

                    if (result) {
                        const token = jwt.sign({ username: user.username }, secretKeys.tokenSecret, { expiresIn: "30m" }); // EXPIREEEEEEEEE
                        // userid??
                        const refreshToken = randToken.uid(256);

                        const refreshTokenDB = new RefreshToken({
                            token: refreshToken,
                            username: user.username,
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
                            refreshToken: refreshToken, //ES6-tol nem kell kiirni a propertyt? olvashatosag
                            username: data.username
                        });
                    } else {
                        return res.status(400).json({
                            message: "You have entered an invalid username or password3"
                        });
                    }
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}