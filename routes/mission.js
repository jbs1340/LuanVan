const express = require('express');
const router = express.Router();
const missionController = require('../controllers/missionController')
const authController = require('../controllers/authController');

router.post('/create', authController.verifyToken, missionController.create)
router.get('/list', authController.verifyToken, missionController.getMission)
router.get('/any_by', authController.verifyToken, missionController.getBy)
router.get('/my_logs', authController.verifyToken, missionController.getMissionsLogCurrentUser)
router.get('/by_date', authController.verifyToken, missionController.filter_by_date)
router.put('/done', authController.verifyToken, missionController.done)

router.post('/verify_jobs', missionController.create_verify_job)
router.get('/verify_jobs', authController.verifyToken, missionController.find_funcs)

module.exports = router