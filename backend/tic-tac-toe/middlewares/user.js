const User = require('../models/User');

// module.exports.deleteUserMW = (req, res, next) => {

// };

// module.exports.updateUserMW = (req, res, next) => {

// };

// module.exports.getAllUsersMW = (req, res, next) => {

// };

module.exports.getUserMW = (req, res, next) => {

    User.findOne({ username: req.userData.username})
    .exec()
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: "A felhasznalo nem talalhato"
        });
      } else {
        return res.status(200).json({
            username: user.username,
            email: user.email
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
