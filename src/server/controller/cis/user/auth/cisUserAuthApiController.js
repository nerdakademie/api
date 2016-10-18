const cisUserAuthHelper = require('../../../../helper/cis/user/auth/cisUserAuthHelper');

module.exports = (() => {
  function getUserKey(request, response) {
    if (request.body.username === null || request.body.password === null) {
      response.status(404).json({success: false});
      response.end();
    } else {
      cisUserAuthHelper.getUserKey(request.body.username, request.body.password, function(apiKey) {
        if (apiKey === false) {
          response.json({success: false});
        } else {
          response.json(apiKey);
        }
      });
    }
  }

  function loginCorrect(request, response) {
    if (request.body.username === null || request.body.password === null || request.body.password.length < 1 || request.body.username.length < 1) {
      response.json({success: false});
      response.end();
    } else {
      cisUserAuthHelper.loginCorrect(request.body.username, request.body.password, function(correct) {
        if (correct === false) {
          response.json({success: false});
        } else {
          response.json(correct);
        }
      });
    }
  }

  function isNAKUser(request, response) {
    if (request.body.username === null || request.body.password === null) {
      response.status(404).json({nakuser: false, message: 'error wrong data specified'});
      response.end();
    } else {
      cisUserAuthHelper.isNAKUser(request.body.username, request.body.password, function (result){
        if (result) {
          response.status(200).json({nakuser:true});
        } else {
          response.status(200).json({nakuser:false});
        }
      });
    }
  }

  return {
    getUserKey,
    isNAKUser,
    loginCorrect
  };
})();
