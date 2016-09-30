const internalController = require('../../controller/test/testController');
const router = require('express').Router();

router.get('/', internalController.index);
router.get('/html', internalController.getHTML);

module.exports = router;
