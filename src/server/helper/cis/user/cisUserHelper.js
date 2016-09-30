const request = require('request');
const cheerio = require('cheerio');
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
      if( typoCookie === false) {
        callback(false);
      } else {
        const ar = request.jar();
        const cookie = request.cookie('fe_typo_user=' + typoCookie);
        const url = 'https://cis.nordakademie.de/pruefungsamt/pruefungsergebnisse/?no_cache=1';
        ar.setCookie(cookie, url);
        request.get({url: url, jar: ar}, function (err, httpContent, body) {
          const $ = cheerio.load(body);
          const keys = ['modulenr', 'description', 'exam_date', 'entry_date', 'grade', 'credits', 'examnr'];
          callback(utils.parseTableRegex($, '#curricular table tbody tr', keys, keys.length,0,{6 : /performanceId%5D=(\d+)/}));
        });
      }
    });
  }

  function getExamDetails(userkey, examnr, callback){
    cisUserAuthHelper.getValidTypoCookieByApiKey(userkey, function(typoCookie){
      if (typoCookie === false) {
        callback(false);
      } else {
        const ar = request.jar();
        const cookie = request.cookie('fe_typo_user=' + typoCookie);
        const url = 'https://cis.nordakademie.de/pruefungsamt/pruefungsergebnisse/?no_cache=1&tx_nahrgrades_nahrgradesmodules%5BperformanceId%5D='+examnr+'&tx_nahrgrades_nahrgradesmodules%5Baction%5D=statistic&tx_nahrgrades_nahrgradesmodules%5Bcontroller%5D=Notenverwaltung';
        ar.setCookie(cookie, url);
        request.get({url: url, jar: ar}, function (err, httpContent, body) {
          let gradeTable = body.match(/[\d\,]{22}/g)[0].split(',');
          gradeTable = gradeTable.filter(function(n){ return n !== ''});
          const keys = ['1,0', '1,3', '1,7', '2,0', '2,3', '2,7', '3,0',	'3,3', '3,7',	'4,0', '5,0'];
          const returnJSON = {}
          for(let element = 0; element < gradeTable.length; element++ ){
            returnJSON[keys[element]] = parseInt(gradeTable[element]);
          }
          callback(returnJSON);
        });

      }
    })
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

  function getSeminarsRegistered(userkey, callback){
    cisUserAuthHelper.getValidTypoCookieByApiKey(userkey, function (typoCookie) {
      if (typoCookie === false) {
        callback(false);
      } else {
        const ar = request.jar();
        const cookie = request.cookie('fe_typo_user=' + typoCookie);
        const url = 'https://cis.nordakademie.de/seminarwesen/?tx_nasemdb_pi1[action]=status';
        ar.setCookie(cookie, url);
        request.get({url: url, jar: ar}, function (err, httpContent, body) {
          const $ = cheerio.load(body);
          callback(utils.parseRegisteredSeminarsTable($, 'table',1, 'tr', 1));
        });
      }
    });
  }

  function getSeminars(userkey, year, quarter, callback) {
    cisUserAuthHelper.getValidTypoCookieByApiKey(userkey, function (typoCookie) {
      if (typoCookie === false) {
        callback(false);
      } else {
        const ar = request.jar();
        const cookie = request.cookie('fe_typo_user=' + typoCookie);
        ar.setCookie(cookie, 'https://cis.nordakademie.de/seminarwesen/');
        const options = { method: 'POST',
          url: 'https://cis.nordakademie.de/seminarwesen/',
          qs: { 'tx_nasemdb_pi1[action]': 'programm' },
          jar: ar,
          headers:
          { 'content-type': 'application/x-www-form-urlencoded',
          'cache-control': 'no-cache' },
          form: { 'tx_nasemdb_pi1[quartal]': utils.getSeminarQuarterID(year,quarter) }
        };

        request(options, function (error, httpContent, body) {
          const $ = cheerio.load(body);
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

  function registerForSeminar(userkey, seminarid, callback){
    cisUserAuthHelper.getValidTypoCookieByApiKey(userkey, function(typoCookie) {
      if (typoCookie === false){
        callback(false);
      } else {
        const ar = request.jar();
        const cookie = request.cookie('fe_typo_user=' + typoCookie);
        ar.setCookie(cookie, 'https://cis.nordakademie.de/seminarwesen/');
        const options = { method: 'POST',
          url: 'https://cis.nordakademie.de/seminarwesen/',
          headers: { 'content-type': 'application/x-www-form-urlencoded',
                    'cache-control': 'no-cache' },
         jar: ar,
         form: { 'tx_nasemdb_pi1[seminarnr]': seminarid,
          'tx_nasemdb_pi1[go]': 'Ja, ich will mich anmelden',
          'tx_nasemdb_pi1[action]': 'anmelden_ok' } };

          request(options, function (error, response, body) {
            console.log(response.statusCode);
            if (error){
                callback(false);
            } else if(response.statusCode === 200){
              callback({success:true})
            }
          });
      }
    });
  }

  function deleteRegistrationForSeminar(userkey, seminarid, callback){
    cisUserAuthHelper.getValidTypoCookieByApiKey(userkey, function(typoCookie) {
      if (typoCookie === false){
        callback(false);
      } else {
        const ar = request.jar();
        const cookie = request.cookie('fe_typo_user=' + typoCookie);
        const url = 'https://cis.nordakademie.de/seminarwesen/?tx_nasemdb_pi1[action]=abmelden&tx_nasemdb_pi1[seminarnr]='+seminarid;
        ar.setCookie(cookie, url);
        request.get({url: url, jar: ar}, function (err, httpContent, body) {
          if (httpContent.statusCode === 404) {
            callback(false);
          } else if (httpContent.statusCode === 200) {
            // all good cookie valid
            callback({sucess: true});
          }
        });
      }
    });
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
    getExamDetails,
    getSeminarsParticipated,
    getSeminars,
    getSeminarsRegistered,
    getSeminarsSwitchCase,
    getSeminarInfo,
    registerForSeminar,
    deleteRegistrationForSeminar
  };
})();