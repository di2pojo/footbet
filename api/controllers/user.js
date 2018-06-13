require('../config/config'); 
const User = require('../models').User;
const Op = require('sequelize').Op;
const bcrypt 			= require('bcrypt');
const bcrypt_p 	 = require('bcrypt-promise');
const jwt = require("jsonwebtoken");

exports.get = async (req, res) => {
  let err, user;
  [err, user] = await to(User.findById(req.params.userId));  
  if(err) return ReE(res, err, 422);
  if(user) {
    ReS(res, {user:user}, 201);
  }else{
    return ReE(res, 'User not found');
  }
};

exports.get_all = async (req, res) => {
  let err, users;
  [err, users] = await to(User.findAll());  
  console.log(users);
  if(err) return ReE(res, err, 422);
  if(users) {
    ReS(res, {users:users}, 201);
  }else{
    return ReE(res, 'No users found');
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
  
  if(err) return ReE(res, err, 422);

  if(user){
    return ReE(res, 'User already exists!');
  } else {
    [err, user] = await to(User.create(body));
    
    if(err) return ReE(res, err, 422);
    ReS(res, {message:'Successfully created new user.', token:user.getJWT()}, 201);
  }
};

exports.login = async (req, res) => {
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

    ReS(res, {message:'Login successful!', user, token:user.getJWT()});
  }
};

exports.delete = async (req, res) => {  
  let err, user;
  [err, user] = await to(User.findById(req.params.userId));  
  if(err) return done(err, false);
  if(user) {
    [err, user] = await to(user.destroy());
    if(err) return ReE(res, 'error occured trying to delete user');
  }else{
    return ReE(res, 'User not found');
  }
  ReS(res, {message:'Deleted User'});
};

exports.update = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, CONFIG.jwt_encryption);
  let err, user, data, pass
  user = req.user;
  data = req.body;
  var userToChange = data.userId;
  if ('admin' !== decoded.username) {
    if (decoded.userId !== data.userId){
      return ReE(res, 'Not Authorized');
    }
    userToChange = decoded.userId;
  }
  [err, user] = await to(User.findById(userToChange));
  if(err) return ReE(res, err, 422);
  if(user) {
    if ('admin' !== decoded.username) {
      [err, pass] = await to(user.comparePassword(data.currentPassword));
      if(err) return ReE(res, err, 422);
      if(!pass) TE('invalid password');
    }
    user.set(data);
    console.log(user);
    [err, user] = await to(user.save());
    if(err){
        if(err.message=='Validation error') err = 'The email address is already in use';
        return ReE(res, err);
    }
    ReS(res, {message :'Updated User: '+user.email});
  } else {
    return ReE(res, 'User not found');
  }
};