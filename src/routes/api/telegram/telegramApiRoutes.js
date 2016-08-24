const telegramApiController = require('../../../controller/api/telegram/telegramApiController');
const router = require('express').Router();

router.post('/send', telegramApiController.sendMessage);
router.post('/webhook', telegramApiController.webHook);

module.exports = router;
