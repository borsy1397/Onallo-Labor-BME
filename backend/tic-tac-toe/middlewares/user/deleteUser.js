const User = require('../../models/User');

module.exports = (req, res, next) => {

    console.log("TORLUNK??");
    console.log(req.userData.id);
    console.log(req.params.id);

    if (req.userData.id === req.params.id) {
        User.deleteOne({
            _id: req.params.id
        }, err => {
            if (err) {
                console.log(err);
                res.json({
                    errorMessage2: err
                })
            } else {
                console.log("TORLUNK??????");
                res.status(200).json("OK");
            }
        });
    }
}