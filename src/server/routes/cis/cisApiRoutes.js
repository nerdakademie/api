const cisApiController = require('../../controller/cis/cisApiController');
const cisUserApiRoutes = require('./user/cisUserApiRoutes');
const router = require('express').Router();
const passport = require('passport');

router.get('/speiseplan', cisApiController.getSpeiseplan);
router.get('/seminars',cisApiController.getAvailableSeminars);
router.use('/user',passport.authenticate('bearer', { session: false }), cisUserApiRoutes);

module.exports = router;
