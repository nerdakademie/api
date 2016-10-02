const cisUserAuthApiController = require('../../controller/cis/user/auth/cisUserAuthApiController');
const authController = require('../../controller/auth/authController');
const router = require('express').Router();
const passport = require('passport');

router.get('/login',authController.login);
//router.post('/loginCorrect', cisUserAuthApiController.loginCorrect);
router.post('/login', passport.authenticate('local', {successReturnToOrRedirect: '/', failureRedirect: '/auth/login'}));

module.exports = router;
