const TelegramHelper = require('../../../helper/TelegramHelper');
module.exports = (() => {
  function sendMessage(request, response) {
    const json = request.body;
    TelegramHelper.sendMessage(json.chatid, json.message);
    response.end();
  }
  function webHook(request, response) {
    const json = request.body;
    TelegramHelper.executeCommand(json);
    response.end();
  }
  return {
    sendMessage,
    webHook
  };
})();
