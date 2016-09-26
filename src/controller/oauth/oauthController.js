const passport = require('passport');
const db = require('../../model/oauth');

module.exports = (() => {
  'use strict';

  function token(req, res) {
    if (req.query.access_token) {
      db.accessTokens.find(req.query.access_token, function (err, token) {
        if (err || !token) {
          res.status(400);
          res.json({error: "invalid_token"});
        } else if (new Date() > token.expirationDate) {
          res.status(400);
          res.json({error: "invalid_token"});
        }
        else {
          db.clients.find(token.clientID, function (err, client) {
            if (err || !client) {
              res.status(400);
              res.json({error: "invalid_token"});
            } else {
              if (token.expirationDate) {
                var expirationLeft = Math.floor((token.expirationDate.getTime() - new Date().getTime()) / 1000);
                if (expirationLeft <= 0) {
                  res.json({error: "invalid_token"});
                } else {
                  res.json({audience: client.clientId, expires_in: expirationLeft});
                }
              } else {
                res.json({audience: client.clientId});
              }
            }
          });
        }
      });
    } else {
      res.status(400);
      res.json({error: "invalid_token"});
    }
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 

  return {
    token
  };
})();
