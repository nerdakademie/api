const cisUserHelper = require('../../../helper/cis/user/cisUserHelper');
const cisUserAuthHelper = require('../../../helper/cis/user/auth/cisUserAuthHelper');
const Client = require('mongoose').model('client');

module.exports = (() => {


  function getNAKAuthCookie(request, response) {
    if (request.body.username === null || request.body.password === null) {
      response.status(404).json({success: false, message: 'error wrong data specified'});
      response.end();
    } else {
      cisUserHelper.getNAKAuthCookie(request.body.username, request.body.password, function (result) {
        if (result === false) {
          response.status(200).json({fe_typo_user: '', message: 'error: could not find cookie'});
          response.end();
        } else {
          response.json({cookie: result});
        }
      });
    }
  }

  function getUserDetails(request, response) {
    console.log(request.authInfo);
    increaseApiCalls(request.authInfo.client_id);
    if (request.authInfo.scope.indexOf(cisUserAuthHelper.scopes.user_read) !== -1) {
      cisUserAuthHelper.getValidNAKCookie(request.user, function (nak_cookie) {
        if (!nak_cookie) {
          //TODO: Correct error response
          response.status(404).json({success: false, message: 'error wrong data specified'});
        } else {
          cisUserHelper.getUserDetails(nak_cookie, function (userTable) {
            if (!userTable) {
              //TODO: Correct error response
              response.status(404).json({success: false, message: 'error wrong data specified'});
            }
            response.json(userTable);
          });
        }
      });
    } else {
      //TODO: Correct error response
      response.status(404).json({success: false, message: 'scope not authorized'});
    }

  }

  function getGrades(request, response) {
    if (request.authInfo.scope.indexOf(cisUserAuthHelper.scopes.grade_read) !== -1) {
      cisUserAuthHelper.getValidNAKCookie(request.user, function (nak_cookie) {
        if (!nak_cookie) {
          //TODO: Correct error response
          response.status(404).json({success: false, message: 'error wrong data specified'});
        } else {
          cisUserHelper.getGrades(nak_cookie, function (userTable) {
            if (userTable === false) {
              response.json({success: false});
            } else {
              response.json(userTable);
            }
          });
        }
      });
    } else {
      //TODO: Correct error response
      response.status(404).json({success: false, message: 'scope not authorized'});
    }
  }

  function getExamDetails(request, response) {
    if (request.params.examid === null) {
      response.status(404).json({success: false, message: 'error wrong data specified'});
      response.end();
    } else {
      if (request.authInfo.scope.indexOf(cisUserAuthHelper.scopes.grade_read) !== -1) {
        cisUserAuthHelper.getValidNAKCookie(request.user, function (nak_cookie) {
          if (!nak_cookie) {
            //TODO: Correct error response
            response.status(404).json({success: false, message: 'error wrong data specified'});
          } else {
            cisUserHelper.getExamDetails(nak_cookie, request.params.examid, function (userTable) {
              if (userTable === false) {
                response.json({success: false});
              } else {
                response.json(userTable);
              }
            });
          }
        });
      } else {
        //TODO: Correct error response
        response.status(404).json({success: false, message: 'scope not authorized'});
      }
    }
  }

  function getSeminarsParticipated(request, response) {
    if (request.authInfo.scope.indexOf(cisUserAuthHelper.scopes.seminar_read) !== -1) {
      cisUserAuthHelper.getValidNAKCookie(request.user, function (nak_cookie) {
        if (!nak_cookie) {
          //TODO: Correct error response
          response.status(404).json({success: false, message: 'error wrong data specified'});
        } else {
          cisUserHelper.getSeminarsParticipated(nak_cookie, function (userTable) {
            if (!userTable) {
              //TODO: Correct error response
              response.status(404).json({success: false, message: 'error wrong data specified'});
            } else {
              response.json(userTable);
            }
          });
        }
      });
    } else {
      //TODO: Correct error response
      response.status(404).json({success: false, message: 'scope not authorized'});
    }
  }

  function getSeminarsRegistered(request, response) {
    if (request.authInfo.scope.indexOf(cisUserAuthHelper.scopes.seminar_read) !== -1) {
      cisUserAuthHelper.getValidNAKCookie(request.user, function (nak_cookie) {
        if (!nak_cookie) {
          //TODO: Correct error response
          response.status(404).json({success: false, message: 'error wrong data specified'});
        } else {
          cisUserHelper.getSeminarsRegistered(nak_cookie, function (userTable) {
            if (!userTable) {
              //TODO: Correct error response
              response.status(404).json({success: false, message: 'error wrong data specified'});
            } else {
              response.json(userTable);
            }
          });
        }
      });
    } else {
      //TODO: Correct error response
      response.status(404).json({success: false, message: 'scope not authorized'});
    }
  }


  function getSeminarInfo(request, response) {
    if (request.params.seminarid === null) {
      response.status(404).json({success: false, message: 'error wrong data specified'});
      response.end();
    } else {
      if (request.authInfo.scope.indexOf(cisUserAuthHelper.scopes.seminar_read) !== -1) {
        cisUserAuthHelper.getValidNAKCookie(request.user, function (nak_cookie) {
          if (!nak_cookie) {
            //TODO: Correct error response
            response.status(404).json({success: false, message: 'error wrong data specified'});
          } else {
            cisUserHelper.getSeminarInfo(request.query.userkey, request.params.seminarid, function (userTable) {
              response.json(userTable);
            });
          }
        });
      } else {
        //TODO: Correct error response
        response.status(404).json({success: false, message: 'scope not authorized'});
      }
    }
  }

  function registerForSeminar(request, response) {
    if (request.params.seminarid === undefined) {
      response.status(404).json({success: false, message: 'error wrong data specified'});
      response.end();
    } else {
      if (request.authInfo.scope.indexOf(cisUserAuthHelper.scopes.seminar_write) !== -1) {
        cisUserAuthHelper.getValidNAKCookie(request.user, function (nak_cookie) {
          if (!nak_cookie) {
            //TODO: Correct error response
            response.status(404).json({success: false, message: 'error wrong data specified'});
          } else {
            cisUserHelper.registerForSeminar(nak_cookie, request.params.seminarid, function (userTable) {
              response.json(userTable);
            });
          }
        });
      } else {
        //TODO: Correct error response
        response.status(404).json({success: false, message: 'scope not authorized'});
      }
    }
  }


  function deleteRegistrationForSeminar(request, response) {
    if (request.params.seminarid === undefined) {
      response.status(404).json({success: false, message: 'error wrong data specified'});
      response.end();
    } else {
      if (request.authInfo.scope.indexOf(cisUserAuthHelper.scopes.seminar_write) !== -1) {
        cisUserAuthHelper.getValidNAKCookie(request.user, function (nak_cookie) {
          if (!nak_cookie) {
            //TODO: Correct error response
            response.status(404).json({success: false, message: 'error wrong data specified'});
          } else {
            cisUserHelper.deleteRegistrationForSeminar(request.body.userkey, request.params.seminarid, function (userTable) {
              response.json(userTable);
            });
          }
        });
      } else {
        //TODO: Correct error response
        response.status(404).json({success: false, message: 'scope not authorized'});
      }
    }
  }

  function increaseApiCalls(client_id){
    Client.findOne({id:client_id}).exec((err,client) => {
      if(!err && client){
        if(client.apiCalls === undefined){
          client.apiCalls = 1;
        }else {
          client.apiCalls++;
        }
        client.save((err) => {
          if(err){
            console.log('increseApiCall error');
          }
        });
      }
    });
  }

  return {
    getNAKAuthCookie,
    getUserDetails,
    getGrades,
    getExamDetails,
    getSeminarsParticipated,
    getSeminarsRegistered,
    getSeminarInfo,
    registerForSeminar,
    deleteRegistrationForSeminar
  };
})
();
