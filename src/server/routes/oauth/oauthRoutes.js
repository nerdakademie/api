const oauth2 = require('../../helper/oauth');
const router = require('express').Router();
const oauthController = require('../../controller/oauth/oauthController');

router.get('/dialog/authorize', oauth2.authorization);
router.post('/dialog/authorize/decision', oauth2.decision);


router.post('/token', oauth2.token);


module.exports = router;
