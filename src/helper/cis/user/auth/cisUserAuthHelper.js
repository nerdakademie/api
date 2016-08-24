const request = require('request');
const cisUserHelper = require('../cisUserHelper');
const Api = require('mongoose').model('Api');
const uuid = require('node-uuid');

module.exports = (() => {
  'use strict';

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

  function getApiUserByApiKey(userKey, callback) {
    Api.findOne({user_key: userKey}).exec((error, apiUser) => {
      if (error) {
        callback(false);
      } else {
        callback(apiUser);
      }
    });
  }

  function getApiUserByName(username, callback) {
    Api.findOne({user: username}).exec((error, apiUser) => {
      if (error) {
        callback(false);
      } else {
        callback(apiUser);
      }
    });
  }

  function getTypoCookieByApiKey(userkey, callback) {
    getApiUserByApiKey(userkey, function (apiuser) {
      if (apiuser === false) {
        callback(false);
      } else {
        callback(apiuser.typo_cookie);
      }
    });
  }

  function getValidTypoCookieByApiKey(userKey, callback) {
    getApiUserByApiKey(userKey, function(apiUsr) {
      if (apiUsr === false) {
        callback(false);
      } else {
        getValidNAKCookie(apiUsr, function (cookie) {
          callback(cookie);
        });
      }
    });
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

  function getUserKey(username, password, callback) {
    Api.count({user: username}, function (err, count) {
      if (err) {
        callback(false);
      } else if (count === 0) {
        createUser(username, password, function (result) {
          callback(result);
        });
      } else if (count === 1) {
        getApiUserByName(username, function (apiUser) {
          if (password === apiUser.pass) {
            callback({success: true, apikey: apiUser.api_key});
          } else {
            callback(false);
          }
        });
      } else {
        callback(false);
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
            const userKey = uuid.v4();
            const api = new Api({
              user: username,
              pass: password,
              user_key: userKey,
              typo_cookie: cookie
            });
            api.save((error) => {
              if (error) {
                callback(false);
              } else {
                callback({sucess: true, userkey: userKey});
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
    isCookieValid(apiUser.typo_cookie, function(valid) {
      if (valid === true) {
        callback(apiUser.typo_cookie);
      } else {
        getNAKAuthCookie(apiUser.user, apiUser.pass, function (newCookie) {
          if (newCookie === false) {
            callback(newCookie);
          } else {
            apiUser.typo_cookie = newCookie;
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
    getUserKey,
    getTypoCookieByApiKey,
    getValidTypoCookieByApiKey,
    isNAKUser
  };
})();
