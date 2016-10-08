const request = require('request');
const cisUserHelper = require('../cisUserHelper');
const User = require('mongoose').model('user');

module.exports = (() => {
  'use strict';

  const scopes = {
    user_write: 'user:write',
    user_read: 'user:read',
    grade_write : 'grade:write',
    grade_read: 'grade:read',
    seminar_read: 'seminar:read',
    seminar_write: 'seminar:write'
  };

  function parseSetCookies(cookieArray) {
    const list = {};
    cookieArray.forEach(function (cookieItem) {
      cookieItem.split(';').forEach(function (cookie) {
        const parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
      });
    });
    return list;
  }

  function getNAKAuthCookie(username, password, callback) {
    request.post({
      url: 'https://cis.nordakademie.de/startseite/?no_cache=1',
      form: {logintype: "login", pid: 0, user: username, pass: password}
    }, function (err, httpResponse, body) {
      if (httpResponse.statusCode === 404) {
        callback(false);
      } else if (httpResponse.statusCode === 303) {
        // We are being redirected
        const cookies = httpResponse.headers['set-cookie'];
        if (cookies === null) {
          callback(false);
        } else {
          const cookieList = parseSetCookies(cookies);
          if (cookieList.fe_typo_user === null) {
            callback(false);
          } else {
            callback(cookieList.fe_typo_user);
          }
        }
      }
    });
  }

  function createUser(username, password, callback) {
    isNAKUser(username, password, function (isNakusr) {
      if (isNakusr) {
        getNAKAuthCookie(username, password, function (cookie) {
          if (cookie === false) {
            callback(false);
          } else {
            const user = new User({
              username:  username,
              password:  password,
              nak_cookie: cookie
            });
            user.save((error) => {
              if (error) {
                callback(false);
              } else {
                callback(true);
              }
            });
          }
        });
      } else {
        callback(false);
      }
    });
  }

  function getValidNAKCookie(apiUser, callback) {
    isCookieValid(apiUser.nak_cookie, function(valid) {
      if (valid === true) {
        callback(apiUser.nak_cookie);
      } else {
        getNAKAuthCookie(apiUser.username, apiUser.password, function (newCookie) {
          if (newCookie === false) {
            callback(newCookie);
          } else {
            apiUser.nak_cookie = newCookie;
            apiUser.save((error) => {
              if (error) {
                callback(false);
              } else {
                callback(newCookie);
              }
            });
          }
        });
      }
    });
  }


  function isCookieValid(nak_cookie, callback) {
    const ar = request.jar();
    const cookie = request.cookie('fe_typo_user=' + nak_cookie);
    const url = 'https://cis.nordakademie.de/startseite/?no_cache=1';
    ar.setCookie(cookie, url);
    request.get({url: url, jar: ar}, function (err, httpResponse, body) {
      if (httpResponse.statusCode === 404) {
        callback(false);
      } else if (httpResponse.statusCode === 200) {
        // all good cookie valid
        callback(true);
      }
    });
  }

  function isNAKUser(username, password, callback) {
    request.post({
      url: 'https://cis.nordakademie.de/startseite/?no_cache=1',
      form: {logintype: "login", pid: 0, user: username, pass: password}
    }, function (err, httpResponse, body) {
      if (httpResponse.statusCode === 404) {
        callback(false);
      } else if (httpResponse.statusCode === 303) {
        // We are being redirected
        callback(true);
      }
    });
  }

  return {
    isNAKUser,
    getValidNAKCookie,
    getNAKAuthCookie,
    createUser,
    scopes
  };
})();
