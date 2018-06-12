require('../config/config'); 
const User = require('../models').User;
const Op = require('sequelize').Op;
const bcrypt 			= require('bcrypt');
const bcrypt_p 	 = require('bcrypt-promise');
const jwt = require("jsonwebtoken");

exports.get = async (req, res) => {
  let err, user;
  [err, user] = await to(User.findById(req.params.userId));  
  if(err) return done(err, false);
  if(user) {
    ReS(res, {user:user}, 201);
  }else{
    ReE(res, 'User not found');
  }
}

exports.get_all = async (req, res) => {
  let err, users;
  [err, users] = await to(User.findAll());  
  console.log(users);
  if(err) ReE(res, err, 422);
  if(users) {
    ReS(res, {users:users}, 201);
  }else{
    ReE(res, 'No users found');
  }
};

exports.create = async (req, res) => {
  const body = req.body;

  let err, user;
  [err, user] = await to(User.find({
    where: {
      [Op.or]: [{ username: body.username }, { email: body.username }]
    }
  }));
  
  if(err) ReE(res, err, 422);

  if(user){
    ReE(res, 'User already exists!');
  } else {
    [err, user] = await to(User.create(body));
    
    if(err) ReE(res, err, 422);
    ReS(res, {message:'Successfully created new user.', token:user.getJWT()}, 201);
  }
};

exports.login = async function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  const body = req.body;

  let err, user;
  [err, user] = await to(User.findOne({
    where: {
      [Op.or]: [{ username: body.username }, { email: body.username }]
    }
  }));
  
  if(err) return ReE(res, err, 422);

  if(!user){
    return ReE(res, 'Not Registered!');
  } else {
    [err, pass] = await to(user.comparePassword(req.body.password));
    if(err) return ReE(res, err, 422);
    if(!pass) TE('invalid password');

    return ReS(res, {message:'Login successful!', user, token:user.getJWT()});
  }
};

exports.delete = async (req, res) => {  
  let err, user;
  [err, user] = await to(User.findById(req.params.userId));  
  if(err) return done(err, false);
  if(user) {
    [err, user] = await to(user.destroy());
    if(err) ReE(res, 'error occured trying to delete user');
  }else{
    ReE(res, 'User not found');
  }
  ReS(res, {message:'Deleted User'}, 204);
}

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