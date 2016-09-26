const cisApiRoutes = require('./cis/cisApiRoutes.js');
const router = require('express').Router();

router.use('/cis', cisApiRoutes);

module.exports = router;
