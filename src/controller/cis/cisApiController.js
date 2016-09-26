const requestmodule = require('request');
const cheerio = require('cheerio');
const speiseplanHelper = require('../../helper/cis/speiseplanHelper');
const moment = require('moment');

module.exports = (() => {
  'use strict';
  const grades_url = 'https://cis.nordakademie.de/pruefungsamt/pruefungsergebnisse/?no_cache=1';

  function getGrades(request, response) {
    Userhelper.getUserBySession(request, function(user) {
      user.nak_user;
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
    getSpeiseplan
  };
})();
