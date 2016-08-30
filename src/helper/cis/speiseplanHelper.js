const utils = require('./../utils');
const moment = require('moment');
module.exports = (() => {
  'use strict';

  const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

  function getDates(cheerioHandle) {
    const arr = [];
    cheerioHandle('td.speiseplan-head').each(function() {
      arr.push(utils.removeWhitespace(cheerioHandle(this).text()).split(',')[1]);
    });
    return arr;
  }

  function getMeals(cheerioHandle) {
    const arr = [];
    let dayCounter = 0;
    const Dates = getDates(cheerioHandle);
    cheerioHandle('td.speiseplan-tag-container').each(function() {
      const eachDayContent = {};
      const meals = [];
      eachDayContent.date = moment(Dates[dayCounter] + moment().year(),'DD.MM.YYYY').format('YYYY-MM-DD');
      eachDayContent.day = weekdays[dayCounter];
      cheerioHandle('td.speiseplan-tag', this).each(function(id, elem) {
        meals.push(meal(cheerioHandle, elem));
      });
      eachDayContent.meals = meals;
      arr.push(eachDayContent);
      dayCounter += 1;
    });
    return arr;
  }

  function meal(parserContext, element) {
    return {
      description: utils.removeWhitespace(parserContext('.speiseplan-kurzbeschreibung', element).text()),
      price: utils.removeWhitespace(parserContext('.speiseplan-preis', element).text()).slice(0, 4)
    };
  }
  return {
    getMeals
  };
})();
