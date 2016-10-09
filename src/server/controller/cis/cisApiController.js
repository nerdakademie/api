const requestModule = require('request');
const cheerio = require('cheerio');
const cisHelper = require('../../helper/cis/cisHelper');
const cisUserAuthHelper = require('../../helper/cis/user/auth/cisUserAuthHelper');
const moment = require('moment');

module.exports = (() => {
  'use strict';

  function getSpeiseplan(request, response) {
    let url = 'https://cis.nordakademie.de/service/tp-mensa/speiseplan.cmd';
    if (request.query.week !== undefined && request.query.year !== undefined) {
      // url= url + '?date=' + moment(''.concat(request.query.year, '-W', request.query.week, '-6')).unix() + '999&action=show';
      url = url + '?date=' + moment().day('Monday').year(request.query.year).week(request.query.week).unix() + '999&action=show';
    } else if (request.query.date !== undefined) {
      url = url + '?date=' + request.query.date + '999&action=show';

    }
    requestModule(url, function (error, request_response, html) {
      if (!error && request_response.statusCode === 200) {
        const speisePlanPage = cheerio.load(html);
        response.json(cisHelper.getMeals(speisePlanPage));
        response.end();
      } else {
        response.end();
      }
    });
  }

  function getAvailableSeminars(request, response) {
    if (request.query.year === undefined || request.query.quarter === undefined) {
      response.status(404).json({success: false, message: 'error wrong data specified'});
      response.end();
    } else {
      cisHelper.getSeminars(request.query.year, request.query.quarter, function (userTable) {
        response.json(userTable);
      });
    }
  }


  return {
    getSpeiseplan,
    getAvailableSeminars
  };
})();
