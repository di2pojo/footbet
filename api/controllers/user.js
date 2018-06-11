require('../config/config'); 
const User = require('../models').User;
const Op = require('sequelize').Op;
const bcrypt 			= require('bcrypt');
const jwt = require("jsonwebtoken");

exports.user_get_all = (req, res, next) => {
  
  User.find().then(function (users) {
      res.json(users);
  }).catch(function(err) {
      res.err(404);
  });

};

exports.user_signup = (req, res, next) => {
  User.find({
    where: {
      [Op.or]: [{ username: req.body.username }, { email: req.body.username }]
    }
  })
  .then(user => {
    if (user) {
      return res.status(409).json({
        message: "User exists"
      });
    } else {
      User.create(req.body)
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "User created"
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
    }
  });
};

exports.user_login = (req, res, next) => {
  User.findOne({
    where: {
      [Op.or]: [{ username: req.body.username }, { email: req.body.username }]
    }
  })
  .then(user => {
    if (!user) {
      return res.status(401).json({
        message: "Auth failed2"
      });
    }
    console.log(req.body.password);
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (err) {
        return res.status(401).json({
          message: "Auth failed - wrong pwd1"
        });
      }
      if (result) {
        const token = jwt.sign(
          {
            username: user.username,
            email: user.email,
            userId: user.id
          },
          CONFIG.jwt_encryption,
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
        message: "Auth failed - wrong pwd"
      });
    });
  })
};

exports.user_delete = (req, res, next) => {
  User.destroy({
    where: {
      id: req.params.userId
    }
  })
  .then(result => {
    res.status(200).json({
      message: "User deleted"
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
};

exports.user_change_password = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, CONFIG.jwt_encryption);
  var userToChange = req.body.username;
  if ('admin' !== decoded.username) {
    userToChange = decoded.username;
  }
  User.findOne({
    where: {
      username: userToChange
    }
  })
  .then(user => {
    if (!user) {
      return res.status(401).json({
        message: "User not found"
      });
    }
    console.log(req.body.password);
    bcrypt.compare(req.body.currentPassword, user.password, (err, result) => {
      if (err) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      if (result) {
        User.update({
          password: req.body.newPassword,
        }, {
          where: {
            id: user.id
          }, individualHooks: true
        });
        return res.status(200).json({
          message: "Password changed successfully"
        });
      }
      res.status(401).json({
        message: "Auth failed"
      });
    });
  });  
};