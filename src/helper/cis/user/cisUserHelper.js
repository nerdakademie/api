const request = require('request');
const cheerio = require('cheerio');
const cheerioAdv = require('cheerio-advanced-selectors');
const utils = require('../../utils');
const cisUserAuthHelper = require('./auth/cisUserAuthHelper');

module.exports = (() => {
  'use strict';

  function getUserDetails(apikey, callback) {
    cisUserAuthHelper.getValidTypoCookieByApiKey(apikey, function(typoCookie) {
      const ar = request.jar();
      const cookie = request.cookie('fe_typo_user=' + typoCookie);
      const url = 'https://cis.nordakademie.de/nacommunity/mein-profil/?no_cache=1';
      ar.setCookie(cookie, url);
      request.get({url: url, jar: ar}, function (err, httpContent, body) {
        const $ = cheerio.load(body);
        callback(utils.parseTableDetails($, 'form table tr'));
      });
    });
  }

  function getGrades(apikey, callback) {
    cisUserAuthHelper.getValidTypoCookieByApiKey(apikey, function(typoCookie) {
      const ar = request.jar();
      const cookie = request.cookie('fe_typo_user=' + typoCookie);
      const url = 'https://cis.nordakademie.de/pruefungsamt/pruefungsergebnisse/?no_cache=1';
      ar.setCookie(cookie, url);
      request.get({url: url, jar: ar}, function (err, httpContent, body) {
        const $ = cheerio.load(body);
        const keys = ['modulenumber', 'description', 'exam_date', 'entry_date', 'grade', 'credits'];
        callback(utils.parseTable($, '#curricular table tbody tr', keys, keys.length));
      });
    });
  }

  function getSeminarsParticipated(userkey, callback) {
    cisUserAuthHelper.getValidTypoCookieByApiKey(userkey, function(typoCookie) {
      const ar = request.jar();
      const cookie = request.cookie('fe_typo_user=' + typoCookie);
      const url = 'https://cis.nordakademie.de/pruefungsamt/pruefungsergebnisse/?no_cache=1';
      ar.setCookie(cookie, url);
      request.get({url: url, jar: ar}, function (err, httpContent, body) {
        const $ = cheerio.load(body);
        const keys = ['description', 'period', 'grade', 'credits'];
        callback(utils.parseTable($, '#seminar table tbody tr', keys, keys.length));
      });
    });
  }

  function getSeminars(userkey, year, quarter, callback) {
    cisUserAuthHelper.getValidTypoCookieByApiKey(userkey, function (typoCookie) {
      if (typoCookie === false) {
        callback(false);
      } else {
        const ar = request.jar();
        const cookie = request.cookie('fe_typo_user=' + typoCookie);
        const url = 'https://cis.nordakademie.de/seminarwesen/?tx_nasemdb_pi1[action]=programm';
        //const form = {};
        //form['tx_nasemdb_pi1[quartal]'] = utils.getSeminarQuarterID(year,quarter);
        //const form = {'tx_nasemdb_pi1[quartal]' : utils.getSeminarQuarterID(year,quarter)};
        //console.log(form);
        ar.setCookie(cookie, url);
        request.get({url: url, jar: ar}, function (error, httpContent, body) {
          console.log(httpContent.post);
          const $ = cheerio.load(body);
          const keys = ['description', 'from', 'to', 'grade', 'credits'];
          callback(utils.parseAvailableSeminarsTable($, 'table',2 , 'tr',1));

        });
      }
    });
  }

  function getSeminarParticipants(userkey, seminarid, callback){
    cisUserAuthHelper.getValidTypoCookieByApiKey(userkey, function(typoCookie) {
      const ar = request.jar();
      const cookie = request.cookie('fe_typo_user=' + typoCookie);
      const url = 'https://cis.nordakademie.de/seminarwesen/?tx_nasemdb_pi1[action]=teilnehmerliste&tx_nasemdb_pi1[seminarnr]=' +seminarid;
      ar.setCookie(cookie, url);
      request.get({url: url, jar: ar}, function (err, httpContent, body) {
        const $ = cheerio.load(body);
        const keys = ['name', 'surname', 'centuria'];
        callback(utils.parseTableAdvanced($, 'blockquote table', 1, 'tr', keys, keys.length,1,1));
      });
    });
  }

  function getSeminarInfo(userkey, seminarid, callback){
    const returnObject = {};
    let counter=0;
    getSeminarDetails(userkey,seminarid,function (detailObject){
      returnObject.details = detailObject;
      counter = counter + 1;
      if(counter >1){
        callback(returnObject);
      }
    });
    getSeminarParticipants(userkey,seminarid,function (participantsArray){
      returnObject.participants = participantsArray;
      counter = counter + 1;
      if(counter >1){
        callback(returnObject);
      }
    })
  }


  function getSeminarDetails(userkey, seminarid, callback){
    cisUserAuthHelper.getValidTypoCookieByApiKey(userkey, function(typoCookie) {
      const ar = request.jar();
      const cookie = request.cookie('fe_typo_user=' + typoCookie);
      const url = 'https://cis.nordakademie.de/seminarwesen/?tx_nasemdb_pi1[action]=beschreibung&tx_nasemdb_pi1[seminarnr]=' +seminarid;
      ar.setCookie(cookie, url);
      request.get({url: url, jar: ar}, function (err, httpContent, body) {
        const $ = cheerio.load(body);
        const keys = ['title', 'lecturer', 'cv','content', 'script', 'goal', 'workload', 'contact_hours', 'credits', 'examination'];
        callback(utils.parseTableAdvancedColumn($, 'table', 1, 'tr', keys, keys.length,0,1));
      });
    });
  }

  function getSeminarsSwitchCase(userkey,callback){
    cisUserAuthHelper.getValidTypoCookieByApiKey(userkey, function (typoCookie) {
      if (typoCookie === false) {
        callback(false);
      } else {
        const ar = request.jar();
        const cookie = request.cookie('fe_typo_user=' + typoCookie);
        const url = 'https://cis.nordakademie.de/seminarwesen/?tx_nasemdb_pi1[action]=programm';
        ar.setCookie(cookie, url);
        request.get({url: url, jar: ar}, function (error, httpContent, body) {
          const $ = cheerio.load(body);
          //console.log($('table').eq(1).find('td').eq(2).find('option').html());
          console.log('switch(year_quarter){')
          $('table').eq(1).find('td').eq(2).find('select').each(function (id, elem) {
            const children = $(elem).children();
            for(let i=0;i<children.length;i++){
              console.log('   case \''+children.eq(i).text()+'\':')
              console.log('       return '+children.eq(i).attr('value')+';');
              console.log('       break;');
            }
          console.log('   default:');
          console.log('       break;');
          console.log('}');
          });
          callback(false);

        });
      }
    });
  }

  return {
    getUserDetails,
    getGrades,
    getSeminarsParticipated,
    getSeminars,
    getSeminarsSwitchCase,
    getSeminarInfo
  };
})();
