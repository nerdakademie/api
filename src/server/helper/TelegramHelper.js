const Statistic = require('mongoose').model('Statistic');
const TelegramBot = require('node-telegram-bot-api');
const telegramBotToken = '120945382:AAFvCqF08ROSRUgEOTmhoXe_zco4_R38sEE';
const bot = new TelegramBot(telegramBotToken);

module.exports = (() => {
  'use strict';

  const botName = 'KadseBot';
  let ohKadseMap= new Map();
  function contains(origstring, compare) {
    return origstring.indexOf(compare) > -1;
  }

  function getCommand(inputData) {
    console.log(inputData);
    let command = inputData.toLowerCase();
    if (contains(inputData, ' ')) {
      command = command.split(' ')[0];
    }
    if (contains(command, '@'.concat(botName.toLowerCase()))) {
      return command.replace('@'.concat(botName.toLowerCase()), '');
    } else if (contains(command, ' @'.concat(botName.toLowerCase()))) {
      return command.replace(' @'.concat(botName.toLowerCase()), '');
    }
    return command;
  }

  function getParams(inputData) {
    const params = inputData.split(' ');
    if (contains(inputData, ' @'.concat(botName))) {
      return params.slice(2);
    } else {
      return params.slice(1);
    }
  }

  function executeCommand(JsonData) {
 //   incrementUsage(JsonData);
    let command;
    if (typeof JsonData.message.text === 'undefined') {
      command = 'undefined';
    } else {
      command = getCommand(JsonData.message.text);
    }
    console.log('after getCommand'.concat(command));
    switch (command) {
      case '/echo':
        bot.sendMessage(JsonData.message.chat.id, getParams(JsonData.message.text).join(' '));
        break;
      case '/debug':
        bot.sendMessage(JsonData.message.chat.id, JSON.stringify(JsonData));
        break;
      case '/decide':
        bot.sendMessage(JsonData.message.chat.id, decide(getParams(JsonData.message.text)));
        break;
      case '/ohkadsewasessenwirheute':
        ohKadseWasEssenWirHeute(JsonData.message.chat.id);
        //bot.sendMessage(JsonData.message.chat.id, decide(['Mensa', 'Fresh', 'Smileys', 'Penny', 'Dinos', 'Hack']));
        break;
      case '/engage':
        engage(JsonData.message.chat.id, getParams(JsonData.message.text).join(' '));
        break;
      case '/roulette':
        roulette(JsonData.message.chat.id);
        break;
      case 'undefined':
        bot.sendMessage(JsonData.message.chat.id, errorMessage('No message text supplied'));
        break;

      default:
        bot.sendMessage(JsonData.message.chat.id, 'Kadse verwirrt. Kadse kennt nicht');
        break;
    }
  }

  function decide(Params) {
    if (Params.length > 0) {
      return Params[generateRandomNumber(0, Params.length)];
    } else {
      return errorMessage('No options specified');
    }
  }

  function roulette(chatID){
    if(generateRandomNumber(1,5)===1){
      sendMessage(chatID, "Peng! Du bist Tod. Miau")
    }else {
      sendMessage(chatID, "Glück gehabt du Penner")
    }
  }

  function errorMessage(ErrorMessage) {
    return 'Error: '.concat(ErrorMessage);
  }

  function generateRandomNumber(min, max) {
    return Math.floor((Math.random() * max) + min);
  }

  function executeTest() {
    bot.sendMessage(49897717, 'haaaack');
  }

  function sendMessage(chatID, Message) {
    bot.sendMessage(chatID, Message);
  }

  function engage(chatID, message){
    let i = 1;
    function engageLoop () {
       setTimeout(function () {
          bot.sendMessage(chatID, 'Meow '.concat(message));
          i++;
          if (i < 6) {
             engageLoop();
          }
       }, 1000)
    }
    engageLoop();
  //    bot.sendMessage(chatID,message);
  }

  // Timeout in milliseconds
  function waitForMessage(userID, callback) {
    bot.on('message', function(msg) {
      const userId = msg.from.id;
      if (userId.equals(userID)) {
        callback(msg);
      }
    });
  }

  function ohKadseWasEssenWirHeute(chatID) {
    if (!ohKadseMap.has(chatID) || ohKadseMap.get(chatID) !== new Date().getDate()) {
      const decision = decide(['Mensa', 'Fresh', 'Smileys', 'Penny', 'Dinos', 'Hack']);
      if (decision !== 'Hack') {
        ohKadseMap.set(chatID, new Date().getDate());
      } else {
        ohKadseMap.delete(chatID);
      }
      bot.sendMessage(chatID, decision);
    } else {
      bot.sendMessage(chatID, 'Ob du behindert bist. Kadse hat entschieden!');
    }
  }


  function incrementUsage(inputData){
      Statistic.findOne({chat_id: inputdata.message.chat.id}, function(err, statisticEntry) {
          if (!err) {
            if (!statisticEntry) {
              statisticEntry = new Statistic();
              statisticEntry.chat_id = inputData.message.chat.id;
              statisticEntry.used = 0;
            }
            statisticEntry.used = statisticEntry.used + 1;
            statisticEntry.save(function(err) {
              if (!err) {
                // console.log("contact " + statisticEntry.phone + " created at " + statisticEntry.createdAt + " updated at " + statisticEntry.updatedAt);
              }
              else {
               // console.log("Error: could not save contact " + statisticEntry.phone);
              }
            });
          }
      });
  }

  return {
    executeCommand,
    executeTest,
    sendMessage,
    waitForMessage
  };
})();
