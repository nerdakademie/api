const User = require('mongoose').model('User');
const userHelper = require('../../../helper/userHelper');

module.exports = (() => {

  function login(request, response) {
    if (request.body.username == null || request.body.password == null) {
      response.json({success: false});
      response.end();
    } else {
      userHelper.getUserByName(request.body.username, function(user) {
        if (user == null) {
          response.status(404).json({success: false});
        }
        userHelper.isPasswordCorrect(user,request.body.password, function(result){
          if(result){
            request.session.user = user.nak_user;
            response.json({success: true});
          }else{
            response.json({success: false});
          }
        });
      });
    }
  }

  function logout(request, response) {
    request.session.regenerate(function (err) {
      if (err) {
        response.json({success: false});
      } else {
        response.json({success: true});
      }
    });
  }

  return {
    login,
    logout
  };
})();
