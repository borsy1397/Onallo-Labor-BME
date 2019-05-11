const User = require('../../models/User');
const emailValidator = require('email-validator');
const bcrypt = require('bcrypt');

module.exports = (req, res, next) => {
    User.find({ _id: req.params.id })
        .exec()
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: "Usersdid not found"
                });
            } else {
                if (req.body.email != null) {
                    if (!emailValidator.validate(req.body.email)) {
                        return res.status(406).json({
                            message: "Please enter a valid email address."
                        });
                    }
                    user.email = req.body.email;
                    user
                        .save()
                        .then(result => {
                            console.log(result);
                            res.status(201).json({
                                message: "User updated"
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err,
                                message: "error while updating"
                            });
                        });
                }

                if (req.body.password != null) {
                    if (req.body.password.length < 8) {
                        return res.status(406).json({
                            message: "Password is too short. Minimum length is 8 characters"
                        });
                    }
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        if (err) {
                            return res.status(500).json({
                                error: err,
                                message: "Problem with hash"
                            });
                        } else {
                            user.password = hash;
                            user
                                .save()
                                .then(result => {
                                    console.log(result);
                                    res.status(201).json({
                                        message: "User updated"
                                    });
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json({
                                        error: err,
                                        message: "error while updating"
                                    });
                                });
                        }
                    });
                }
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: 'Users did not found'
            });
        });
};
