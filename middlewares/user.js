const User = require('../models/User');
const secretKeys = require('../assets/secret').secretKeys;
const jwt = require('jsonwebtoken');
const emailValidator = require('email-validator');
const bcrypt = require('bcrypt');

module.exports.authorizationMW = (req, res, next) => {
    const data = {
      token: req.headers.authorization.split(" ")[1]
    };

    const decoded = jwt.verify(data.token, secretKeys.tokenSecret, (err, decoded) => {
      
      if(err) {
        return res.status(404).json({
          message: "nem jo"
      })
      }
      
      req.userData = decoded;
      console.log(decoded);
    });
    next();
};

module.exports.loginMW = (req, res, next) => {
    const data = {
        username: req.body.username,
        password: req.body.password
    };

    User.findOne({username: data.username})
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
            message: "Auth failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              username: user.username
            },
            secretKeys.tokenSecret,
            {
                expiresIn: "1h"
            }
          );
          
          return res.status(200).json({
            message: "Auth successful",
            token: token
          });
        }
        res.status(401).json({
          message: "Felhasznalonev vagy jelszo nem megfelelo2"
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

module.exports.logoutMW = (req, res, next) => {
    // kell ez?
};

module.exports.signupMW = (req, res, next) => {
    const data = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    };

    if(!emailValidator.validate(data.email)){
        return res.status(500).json({
            message: "Mail is incorrect"
        });
    }

    User.findOne({email: data.email})
    .exec()
    .then(user => {
        if (user) {
            return res.status(409).json({
              message: "Mail exists"
            });
          } else {
            bcrypt.hash(data.password, 10, (err, hash) => {
              if (err) {
                return res.status(500).json({
                  error: err
                });
              } else {
                const newUser = new User({
                  //_id: new mongoose.Types.ObjectId(),
                  email: data.email,
                  username: data.username,
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

module.exports.deleteUserMW = (req, res, next) => {

};

module.exports.updateUserMW = (req, res, next) => {

};

module.exports.getAllUsersMW = (req, res, next) => {

};

module.exports.getUserMW = (req, res, next) => {

};


/**
 * Amik kellhetnek:
 * 
 * addUserToGame
 * removeUserFromGame?
 */