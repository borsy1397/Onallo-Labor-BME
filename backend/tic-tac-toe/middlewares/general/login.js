const User = require('../../models/User');
const bcrypt = require('bcrypt');
const RefreshToken = require('../../models/RefreshToken');
const secretKeys = require('../../utils/secret').secretKeys;
const jwt = require('jsonwebtoken');
const randToken = require('rand-token');

module.exports = (req, res, next) => {
    User.findOne({ username: req.body.username })
        .populate({
            path: 'games',
            model: 'GameResult',
            populate: {
                path: 'enemy',
                model: 'User'
            }
        })
        .exec()
        .then(user => {
            if (!user) {
                return res.status(400).json({
                    message: "You have entered an invalid username or password1"
                });
            } else {
                res.locals.user = user;
                return next();
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}