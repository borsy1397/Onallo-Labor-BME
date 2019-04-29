const User = require('../../models/User');

module.exports = (req, res, next) => {
    User
        .remove({ _id: req.params.id })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}