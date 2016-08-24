const userApiRoutes = require('./user/userApiRoutes');
const cisApiRoutes = require('./cis/cisApiRoutes.js');
const router = require('express').Router();

router.use('/user', userApiRoutes);
router.use('/cis', cisApiRoutes);

module.exports = router;
