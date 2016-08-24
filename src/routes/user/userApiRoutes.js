const userApiController = require('../../controller/user/userApiController');
const loginApiController = require('../../controller/user/loginApiController');
const router = require('express').Router();

router.post('/register', userApiController.register);
router.post('/login', loginApiController.login);
router.get('/logout', loginApiController.logout);

module.exports = router;
