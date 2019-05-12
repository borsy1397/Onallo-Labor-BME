const User = require('../../models/User');
const bcrypt = require('bcrypt');
const emailValidator = require('email-validator');

module.exports = (req, res, next) => {
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
    
    
      // Ezt majd uj middlewareba!!!
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
    
}