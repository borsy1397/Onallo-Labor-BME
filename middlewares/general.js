const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const secretKeys = require('../assets/secret').secretKeys;
const jwt = require('jsonwebtoken');
const randToken = require('rand-token');
const emailValidator = require('email-validator');
const bcrypt = require('bcrypt');

module.exports.refreshTokenMW = (req, res, next) => {
  const userData = {
    username: req.body.username,
    refreshToken: req.body.refreshToken
  }

  RefreshToken.findOne({ token: userData.refreshToken })
    .exec()
    .then(refToken => {
      if (refToken) {
        if (refToken.username === userData.username) {

          const token = jwt.sign({ username: userData.username }, secretKeys.tokenSecret, { expiresIn: "1m" }); //EXPIRE
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

module.exports.authorizationMW = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, secretKeys.tokenSecret, (err, decoded) => {
      if (err) {
        return res.status(404).json({
          message: "Invalid token"
        })
      }
      
      req.userData = decoded;
      console.log(req.userData);
      next();

      // uj token kell?
    });
  } else {
    res.status(404).json({
      message: "You have to login."
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
        console.log(user)
        return res.status(401).json({
          message: "A felhasznalonev vagy jelszo nem megfelelo13"
        });
      }

      bcrypt.compare(data.password, user.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "A felhasznalonev vagy jelszo nem megfelelo12"
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
            .then(result => {})
            .catch(err => {
              console.log(err);
              res.status(500).json({
                error: err,
                message: "There is a refresh token yet this id"
              });
            });

          return res.status(200).json({
            message: "Auth successful",
            token: token,
            refreshToken: refreshToken //ES6-tol nem kell kiirni a propertyt? olvashatosag
          });
        } else {
            return res.status(401).json({
                message: "A felhasznalonev vagy jelszo nem megfelelo2"
              });
        }
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
