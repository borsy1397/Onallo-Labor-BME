const RefreshToken = require('../../models/RefreshToken');
const secretKeys = require('../../assets/secret').secretKeys;
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => { // Ezt rendesen at kellesz majd irni....
    const userData = {
        username: req.body.username,
        refreshToken: req.body.refreshToken
    }

    RefreshToken.findOne({ token: userData.refreshToken })
        .exec()
        .then(refToken => {
            if (refToken) {
                if (refToken.username === userData.username) {

                    const token = jwt.sign({ username: userData.username }, secretKeys.tokenSecret, { expiresIn: "30m" }); //EXPIRE
                    // userid??
                    return res.status(200).json({
                        message: "Access token refresh is successful. itt az uj access tokened",
                        token: token
                    });
                }
                return res.status(409).json({
                    message: "Nem a userhez tartozo refresh token"
                });
            } else {
                return res.status(401).json({
                    message: "Invalid refresh token22"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
                message: "Error token serach"
            });
        });
 


}