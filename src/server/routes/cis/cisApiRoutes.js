const cisApiController = require('../../controller/cis/cisApiController');
const cisUserApiRoutes = require('./user/cisUserApiRoutes');
const router = require('express').Router();
const passport = require('passport');

router.get('/speiseplan', passport.authenticate('bearer', { session: false }), cisApiController.getSpeiseplan);
router.use('/user',passport.authenticate('bearer', { session: false }), cisUserApiRoutes);

module.exports = router;
