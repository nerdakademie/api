const cisUserAuthApiController = require('../../../../controller/cis/user/auth/cisUserAuthApiController');
const router = require('express').Router();

router.post('/getUserKey', cisUserAuthApiController.getUserKey);
router.post('/isNakUser', cisUserAuthApiController.isNAKUser);

module.exports = router;
