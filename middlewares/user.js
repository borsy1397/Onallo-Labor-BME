const User = require('../models/User');
const secretKeys = require('../assets/secret').secretKeys;
const jwt = require('jsonwebtoken');
const emailValidator = require('email-validator');
const bcrypt = require('bcrypt');

module.exports.authorizationMW = (req, res, next) => {
  if(req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, secretKeys.tokenSecret, (err, decoded) => {
      if (err) {
        return res.status(404).json({
          message: "Invalid token1"
        })
      }
  
      req.userData = decoded;
      next();

      // uj token kell?
    });
  } else {
    res.status(404).json({
      message: "Invalid token2"
    });
  }
};

module.exports.loginMW = (req, res, next) => {
  const data = {
    username: req.body.username,
    password: req.body.password
  };

  User.findOne({ username: data.username })
    .exec()
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "A felhasznalonev vagy jelszo nem megfelelo1"
        });
      }

      bcrypt.compare(data.password, user.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "A felhasznalonev vagy jelszo nem megfelelo2"
          });
        }

        if (result) {
          const token = jwt.sign({ username: user.username }, secretKeys.tokenSecret, {expiresIn: "1h"}); // EXPIREEEEEEEEE
                                      // userid??
          return res.status(200).json({
            message: "Auth successful",
            token: token
          });
        }

        return res.status(401).json({
          message: "A felhasznalonev vagy jelszo nem megfelelo3"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

module.exports.signupMW = (req, res, next) => {
  const userData = {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  };

  if (!emailValidator.validate(userData.email)) {
    return res.status(400).json({
      message: "Wrong email format"
    });
  }

  User.findOne({ email: userData.email })
    .exec()
    .then(user => {
      if (user) {
        return res.status(409).json({
          message: "Email exists. Choose another one"
        });
      } else {
        bcrypt.hash(userData.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
              message: "Problem with hash"
            });
          } else {
            const newUser = new User({
              //_id: new mongoose.Types.ObjectId(),
              email: userData.email,
              username: userData.username,
              password: hash
            });

            newUser
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User created"
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err,
                  message: "There is a user with this username"
                });
              });
          }
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err,
        message: "Error email search"
      });
    });
};

// module.exports.logoutMW = (req, res, next) => {
//     // kell ez? token...
// };

// module.exports.deleteUserMW = (req, res, next) => {

// };

// module.exports.updateUserMW = (req, res, next) => {

// };

// module.exports.getAllUsersMW = (req, res, next) => {

// };

// module.exports.getUserMW = (req, res, next) => {

// };


/**
 * Amik kellhetnek:
 *
 * addUserToGame
 * removeUserFromGame?
 */