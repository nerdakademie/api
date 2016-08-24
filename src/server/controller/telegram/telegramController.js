const User = require('mongoose').model('User');
const TelegramHelper = require('../../helper/TelegramHelper');
const config = require('config');

module.exports = (() => {
  function receiveDataWebhook(request, response) {
    const telegramData = responsdy;
    Telegram
    response.end();
  }

  return {
    receiveDataWebhook
  };
})();
