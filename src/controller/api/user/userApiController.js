const User = require('mongoose').model('User');
const $ = require('jquery');
const userHelper = require('../../../helper/userHelper');

module.exports = (() => {

  function register(request, response) {
    if (request.body.username == null || request.body.password == null) {
      response.status(404).json({message: "error wrong data specified"});
      response.end();
    }else{
      userHelper.isNAKUser(request.body.username,request.body.password,function(result){
        if(result){
          userHelper.getNAKUserDetails(request.body.username,request.body.password)
          userHelper.registerUser(request.body.username, request.body.password,function(message){
              response.status(200).json({message: message});
          });
        }else{
          response.status(200).json({message: "no NAK user or wrong login data"});
        }
      });
    }
  }


  return {
    register,
  };
})();
