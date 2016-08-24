const User = require('mongoose').model('User');
const bcrypt = require('bcrypt');
const saltRounds = 12;

module.exports = (() => {
  'use strict';

  function getUserBySession(request, callback) {
    User.findOne({nak_user: request.session.user}).exec((error, user) => {
        callback (user);
    });
  }

  function getUserByName(name, callback) {
    User.findOne({nak_user: name}).exec((error, user) => {
      callback( user );
    });
  }

  function getHashFromPassword(password) {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) {
        return '';
      } else {
        return hash;
      }
    });
  }

  function isPasswordCorrect(user, password, callback) {
    bcrypt.compare(password, user.nak_pass, function (err, res) {
      if (err) {
        callback(false);
      } else {
        callback(res);
      }
    });
  }

  function registerUser(username, password, callback) {
    User.count({nak_user: username}, function (err, count) {
      if (err) {
        callback('error: database error');
      } else if (count === 0) {
        const user = new User({user: username, pass: bcrypt.hashSync(password, saltRounds)});
        user.save((error) => {
          if (error) {
            callback('error: data does not match schema');
          } else {
            callback('success');
          }
        });
      } else {
        callback('error: user already exists');
      }
    });
  }

  return {
    getUserBySession,
    getUserByName,
    getHashFromPassword,
    isPasswordCorrect,
    registerUser
  };
})();
