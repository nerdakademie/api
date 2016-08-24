const userApiRoutes = require('./user/userApiRoutes');
const telegramApiRoutes = require('./telegram/telegramApiRoutes.js');
const cisApiRoutes = require('./cis/cisApiRoutes.js');
const router = require('express').Router();

router.use('/user', userApiRoutes);
router.use('/telegram', telegramApiRoutes);
router.use('/cis', cisApiRoutes);

module.exports = router;
