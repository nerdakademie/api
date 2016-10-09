const moment = require('moment');
const date_regex = /(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.(19|20)\d\d/;

module.exports = (() => {
  'use strict';
  function parseTableDetails(cheerioHandle, selection) {
    const tableDictionary = {};
    cheerioHandle(selection).each(function (id, elem) {
      const children = cheerioHandle(elem).children();
      const dictKey = removeWhitespace(children.eq(0).text());
      if (dictKey.indexOf('ändern') === -1 && dictKey !== '') {
        if(date_regex.test(removeWhitespace(children.eq(1).text()))){
            tableDictionary[dictKey] = moment(removeWhitespace(children.eq(1).text()),'DD.MM.YYYY').format('YYYY-MM-DD');
        } else {
          tableDictionary[dictKey] = removeWhitespace(children.eq(1).text());
        }
      }
    });
    return tableDictionary;
  }

  function parseTable(cheerioHandle, selection, keys, elementCount, offset) {
    const tableDictionary = [];
    cheerioHandle(selection).each(function (id, elem) {
      if (offset === undefined || id >= offset) {
        const eachEntry = {};
        const children = cheerioHandle(elem).children();
        for (let count = 0; count < elementCount; count++) {
          if(date_regex.test(removeWhitespace(children.eq(count).text()))){
            eachEntry[keys[count]] = moment(removeWhitespace(children.eq(count).text()),'DD.MM.YYYY').format('YYYY-MM-DD');
          } else {
            eachEntry[keys[count]] = removeWhitespace(children.eq(count).text());
          }
        }
        tableDictionary.push(eachEntry);
      }
    });
    return tableDictionary;
  }

  function parseTableRegex(cheerioHandle, selection, keys, elementCount, offset, regexObj) {
    const tableDictionary = [];
    cheerioHandle(selection).each(function (id, elem) {
      if (offset === undefined || id >= offset) {
        const eachEntry = {};
        const children = cheerioHandle(elem).children()
        for (let count = 0; count < elementCount; count++) {
          if (count.toString() in regexObj){
            if(removeWhitespace(children.eq(count).html()).length === 0){
              eachEntry[keys[count]] = "";
            }else{
              eachEntry[keys[count]] = removeWhitespace(children.eq(count).html().match(regexObj[count.toString()])[1]);
            }
          }else{
            if(date_regex.test(removeWhitespace(children.eq(count).text()))){
              eachEntry[keys[count]] = moment(removeWhitespace(children.eq(count).text()),'DD.MM.YYYY').format('YYYY-MM-DD');
            } else {
              eachEntry[keys[count]] = removeWhitespace(children.eq(count).text());
            }
          }
        }
        tableDictionary.push(eachEntry);
      }
    });
    return tableDictionary;
  }

  function parseTableAdvanced(cheerioHandle, selection, eqElement, afterEqSelection, keys, elementCount, rowoffset,columnoffset) {
    const tableDictionary = [];
    cheerioHandle(selection).eq(eqElement).find(afterEqSelection).each(function (id, elem) {
      if (rowoffset === null || id >= rowoffset) {
        const eachEntry = {};
        const children = cheerioHandle(elem).children();
        for (let count = columnoffset; count < elementCount + columnoffset; count++) {
          if(date_regex.test(removeWhitespace(children.eq(count).text()))){
            eachEntry[keys[count-columnoffset]] = moment(removeWhitespace(children.eq(count).text()),'DD.MM.YYYY').format('YYYY-MM-DD');
          } else {
            eachEntry[keys[count-columnoffset]] = removeWhitespace(children.eq(count).text());
          }
        }
        tableDictionary.push(eachEntry);
      }
    });
    return tableDictionary;
  }

  function parseTableAdvancedColumn(cheerioHandle, selection, eqElement, afterEqSelection, keys, elementCount, rowoffset, columndata) {
    const tableDictionary = {};
    let emptycolumns = 0;
    cheerioHandle(selection).eq(eqElement).find(afterEqSelection).each(function (id, elem) {
      if (rowoffset === null || id >= rowoffset) {
        const children = cheerioHandle(elem).children();
        if(removeWhitespace(children.eq(0).text()).length === 0){
          emptycolumns= emptycolumns + 1;
        }else{
          if(date_regex.test(removeWhitespace(children.eq(columndata).text()))){
            tableDictionary[keys[id -emptycolumns - rowoffset]] = moment(removeWhitespace(children.eq(columndata).text()),'DD.MM.YYYY').format('YYYY-MM-DD');
          } else {
            tableDictionary[keys[id -emptycolumns - rowoffset]] = removeWhitespace(children.eq(columndata).text());
          }
        }
      }
    });
    return tableDictionary;
  }

  function parseAvailableSeminarsTable(cheerioHandle, selection, eqElement, afterEqSelection, offset) {
    const tableDictionary = [];
    cheerioHandle(selection).eq(eqElement).find(afterEqSelection).each(function (id, elem) {
      //remove last line and start at offset
      if (id >= offset && id <= cheerioHandle(selection).eq(eqElement).find(afterEqSelection).length - 2) {
        const eachEntry = {};
        const children = cheerioHandle(elem).children();
        eachEntry.title = removeWhitespace(children.eq(0).find('b').text());
        eachEntry.lecturer = removeWhitespace(children.eq(0).find('i').text());
        eachEntry.from = moment(removeWhitespace(children.eq(1).find('b').text()),'DD.MM.YYYY').format('YYYY-MM-DD');
        eachEntry.to = moment(removeWhitespace(children.eq(2).find('b').text()),'DD.MM.YYYY').format('YYYY-MM-DD');
        eachEntry.description = removeWhitespace(children.eq(3).text());
        eachEntry.category = children.eq(4).find('img').attr('title');
        if(children.eq(5).find('a').eq(0).attr('href') !== undefined) {
          eachEntry.seminarid = parseInt(children.eq(5).find('a').eq(0).attr('href').match(/\d+$/)[0]);
        }
        tableDictionary.push(eachEntry);
      }
    });
    return tableDictionary;
  }

  function parseRegisteredSeminarsTable(cheerioHandle, selection, eqElement, afterEqSelection, rowoffset) {
    const tableDictionary = [];
    cheerioHandle(selection).eq(eqElement).find(afterEqSelection).each(function (id, elem) {
      //remove last line and start at rowoffset
      if (id >= rowoffset && id <= cheerioHandle(selection).eq(eqElement).find(afterEqSelection).length - 2 - rowoffset) {
        const eachEntry = {};
        const children = cheerioHandle(elem).children();
        const year_quarter = children.eq(1).text().split('-');
        eachEntry.year = parseInt(removeWhitespace(year_quarter[0]));
        eachEntry.quarter = parseInt(removeWhitespace(year_quarter[1]));
        const from_to = children.eq(2).find('b');
        eachEntry.from = moment(removeWhitespace(from_to.eq(0).text()),'DD.MM.YYYY').format('YYYY-MM-DD');
        eachEntry.to = moment(removeWhitespace(from_to.eq(1).text()),'DD.MM.YYYY').format('YYYY-MM-DD');
        eachEntry.title = removeWhitespace(children.eq(3).find('b').text());
        children.eq(3).find('b').remove();
        eachEntry.lecturer = removeWhitespace(children.eq(3).not('b').text());
        eachEntry.register_date = removeWhitespace(children.eq(4).text());
        eachEntry.register_approved = transformRegisterStatus(removeWhitespace(children.eq(5).text()));
        eachEntry.seminarid = parseInt(children.eq(6).find('a').eq(0).attr('href').match(/\d+$/)[0]);
        tableDictionary.push(eachEntry);
      }
    });
    return tableDictionary;
  }

  function transformRegisterStatus(status){
    return !!(status.indexOf('OK!') !== -1 && status.indexOf('Angemeldet!'));
  }

  function getSeminarQuarterID(year, quarter) {
    const year_quarter = '' + year + ' - ' + quarter;
    switch (year_quarter) {
      case '2016 - 4':
        return 95;
        break;
      case '2016 - 3':
        return 94;
        break;
      case '2016 - 2':
        return 93;
        break;
      case '2016 - 1':
        return 92;
        break;
      case '2015 - 4':
        return 88;
        break;
      case '2015 - 3':
        return 91;
        break;
      case '2015 - 2':
        return 90;
        break;
      case '2015 - 1':
        return 89;
        break;
      case '2014 - 4':
        return 87;
        break;
      case '2014 - 3':
        return 86;
        break;
      case '2014 - 2':
        return 85;
        break;
      case '2014 - 1':
        return 84;
        break;
      case '2013 - 4':
        return 82;
        break;
      case '2013 - 3':
        return 81;
        break;
      case '2013 - 2':
        return 80;
        break;
      case '2013 - 1':
        return 79;
        break;
      case '2012 - 4':
        return 78;
        break;
      case '2012 - 3':
        return 77;
        break;
      case '2012 - 2':
        return 76;
        break;
      case '2012 - 1':
        return 75;
        break;
      case '2011 - 4':
        return 74;
        break;
      case '2011 - 3':
        return 73;
        break;
      case '2011 - 2':
        return 72;
        break;
      case '2011 - 1':
        return 71;
        break;
      case '2010 - 4':
        return 70;
        break;
      case '2010 - 3':
        return 69;
        break;
      case '2010 - 2':
        return 68;
        break;
      case '2010 - 1':
        return 67;
        break;
      case '2009 - 4':
        return 66;
        break;
      case '2009 - 3':
        return 65;
        break;
      case '2009 - 2':
        return 64;
        break;
      case '2009 - 1':
        return 63;
        break;
      case '2008 - 4':
        return 62;
        break;
      case '2008 - 3':
        return 61;
        break;
      case '2008 - 2':
        return 60;
        break;
      case '2008 - 1':
        return 59;
        break;
      default:
        return null;
        break;
    }
  }

  function removeWhitespace(text) {
    return text.trim().replace(/\s\s+/g, '');
  }

  return {
    removeWhitespace,
    parseTableDetails,
    parseTable,
    parseTableRegex,
    parseAvailableSeminarsTable,
    parseRegisteredSeminarsTable,
    getSeminarQuarterID,
    parseTableAdvanced,
    parseTableAdvancedColumn
  };
})();
