const cisUserAuthHelper = require('../../../../../helper/cis/user/auth/cisUserAuthHelper');

module.exports = (() => {
  function getUserKey(request, response) {
    if (request.body.username === null || request.body.password === null) {
      response.status(404).json({success: false});
      response.end();
    } else {
      cisUserAuthHelper.getUserKey(request.body.username, request.body.password, function(apiKey) {
        if (apiKey === false) {
          response.json({sucess: false});
        } else {
          response.json(apiKey);
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
    isNAKUser
  };
})();
