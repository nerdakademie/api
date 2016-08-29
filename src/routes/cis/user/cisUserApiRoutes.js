const cisUserApiController = require('../../../controller/cis/user/cisUserApiController');
const cisUserAuthApiRoutes = require('./auth/cisUserAuthApiRoutes');
const router = require('express').Router();

router.post('/getAuthCookie', cisUserApiController.getNAKAuthCookie);
router.get('/getUserDetails', cisUserApiController.getUserDetails);
router.get('/grades', cisUserApiController.getGrades);
router.get('/getSeminarsParticipated', cisUserApiController.getSeminarsParticipated);
router.get('/seminars', cisUserApiController.getAvailableSeminars);
router.get("/seminars/:seminarid", cisUserApiController.getSeminarInfo);
router.use('/auth', cisUserAuthApiRoutes);

module.exports = router;
