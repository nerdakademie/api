const oauth2 = require('../../helper/oauth');
const router = require('express').Router();
const oauthController = require('../../controller/oauth/oauthController');
const multer  = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './resources/public/applicationImages');
  },
  filename: function (req, file, callback) {
    console.log(req.body);
    callback(null, file.fieldname + '-' + Date.now());
  }
});
const upload = multer({ storage : storage}).single('clientPhoto');


router.get('/dialog/authorize', oauth2.authorization);
router.post('/dialog/authorize/decision', oauth2.decision);
router.get('/createClient',oauthController.createClient);
router.post('/createClient',upload, oauthController.insertClient);
router.post('/token', oauth2.token);
router.get('/scopes',oauthController.scopes);


module.exports = router;
