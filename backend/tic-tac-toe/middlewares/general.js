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

module.exports.authorizationMW = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, secretKeys.tokenSecret, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "Invalid or expired token. Unauthorized"
        })
      }

      req.userData = decoded;
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
        return res.status(400).json({
          message: "You have entered an invalid username or password1"
        });
      } else {
        bcrypt.compare(data.password, user.password, (err, result) => {
          if (err) {
            return res.status(400).json({
              message: "You have entered an invalid username or password2"
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
              .then(result => { })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err,
                  message: "There is a refresh token yet this id"
                });
              });

            return res.status(200).json({
              message: "Authentication is successful",
              token: token,
              refreshToken: refreshToken, //ES6-tol nem kell kiirni a propertyt? olvashatosag
              username: data.username
            });
          } else {
            return res.status(400).json({
              message: "You have entered an invalid username or password3"
            });
          }
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

module.exports.signupMW = (req, res, next) => {
  const userData = {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    passwordRe: req.body.passwordRe
  };

  if (!emailValidator.validate(userData.email)) {
    return res.status(406).json({
      message: "Please enter a valid email address."
    });
  }

  if (userData.username.length < 4) {
    return res.status(406).json({
      message: "Username is too short. Minimum length is 4 characters"
    });
  }

  if (userData.password.length < 8) {
    return res.status(406).json({
      message: "Password is too short. Minimum length is 8 characters"
    });
  }

  if (userData.password !== userData.passwordRe) {
    return res.status(406).json({
      message: "The password and confirmation password do not match."
    });
  }


  User.findOne({ email: userData.email })
    .exec()
    .then(user => {
      if (user) {
        return res.status(409).json({
          message: "This email already exists."
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
              email: userData.email,
              username: userData.username,
              password: hash,
              games: [],
              joined: Date.now(),
              points: 0
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
                  message: "This username already exists. Choose another one!"
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
