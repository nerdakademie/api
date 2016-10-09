const cisUserApiController = require('../../../controller/cis/user/cisUserApiController');
const cisUserAuthApiRoutes = require('./auth/cisUserAuthApiRoutes');
const passport = require('passport');
const router = require('express').Router();

router.get('/', cisUserApiController.getUserDetails);
router.get('/exams', cisUserApiController.getGrades);
router.get('/exams/:examid', cisUserApiController.getExamDetails);
router.get('/seminars', cisUserApiController.getSeminarsParticipated);
router.get('/seminars/registered',cisUserApiController.getSeminarsRegistered);
router.get("/seminars/:seminarid", cisUserApiController.getSeminarInfo);
router.put("/seminars/:seminarid", cisUserApiController.registerForSeminar);
router.delete("/seminars/:seminarid", cisUserApiController.deleteRegistrationForSeminar);
router.use('/auth', cisUserAuthApiRoutes);

module.exports = router;
