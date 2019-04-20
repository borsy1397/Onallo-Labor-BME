const User = require('../../models/User');
const UserDTO = require('../../models/dto/UserDTO');


module.exports = (req, res, next) => {
    User.findOne({ _id: req.params.username })
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
        return res.status(404).json({
          message: "User did not found"
        });
      } else {
        let own = false;
        if (req.userData.username === user.username) {
          own = true;
        }
        return res.status(200).json(UserDTO(user, own));
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: 'User did not found'
      });
    });
}