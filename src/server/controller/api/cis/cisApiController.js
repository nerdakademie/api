const User = require('mongoose').model('User');
const Userhelper = require('../../../helper/userHelper');
const requestmodule = require('request');
const cheerio = require('cheerio');
const speiseplanHelper = require('../../../helper/cis/speiseplanHelper');
const moment = require('moment');

module.exports = (() => {
  'use strict';
  const grades_url = 'https://cis.nordakademie.de/pruefungsamt/pruefungsergebnisse/?no_cache=1';

  function getGrades(request, response) {
    Userhelper.getUserBySession(request, function(user) {
      user.nak_user;
    });
  }

  function login(request, response) {
    console.log(request.body);
    if (request.body.username == null || request.body.password == null) {
      response.json({success: false});
      response.end();
    } else {
      User.find({nak_user: request.body.username}).limit( 1 ).exec((error, users) => {
        users.map(function(user) {
          if (user === []) {
            response.json({success: false});
          }
          else if (error) {
            response.json({success: false});
          }
          else if (user.nak_pass === request.body.password) {
            request.session.user = user.nak_user;
            response.json({success: true});
          } else {
            response.json({success: false});
          }
        });
      });
    }
  }

  function logout(request, response) {
    request.session.regenerate(function(err) {
      if (err) {
        response.json({success: false});
      } else {
        response.json({success: true});
      }
    });
  }

  function getSpeiseplan(request, response) {
    let url = 'https://cis.nordakademie.de/service/tp-mensa/speiseplan.cmd';
    if (request.query.week !== undefined && request.query.year !== undefined) {
      // url= url + '?date=' + moment(''.concat(request.query.year, '-W', request.query.week, '-6')).unix() + '999&action=show';
      url = url + '?date=' + moment().day('Monday').year(request.query.year).week(request.query.week).unix() + '999&action=show';
    } else if (request.query.date !== undefined) {
      url= url + '?date=' + request.query.date + '999&action=show';

    }
    requestmodule(url, function(error, request_response, html) {
      if (!error && request_response.statusCode === 200) {
        const speisePlanPage = cheerio.load(html);
        response.json(speiseplanHelper.getMeals(speisePlanPage));
        response.end();
      } else {
        response.end();
      }
    });
  }

  return {
    login,
    logout,
    getSpeiseplan
  };
})();
