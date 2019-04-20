const secretKeys = require('../../assets/secret').secretKeys;
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, secretKeys.tokenSecret, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: "Invalid or expired token. Unauthorized"
                });
            }
            req.userData = decoded;
            console.log('miafaszvan');
            next();
            // uj token kell?
        });
    } else {
        res.status(404).json({
            message: "You have to login."
        });
    }

}