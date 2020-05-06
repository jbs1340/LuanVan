const express = require('express');
const router  = express.Router();
const missionController = require('../controllers/missionController')
const authController = require('../controllers/authController');

router.post('/create',authController.verifyToken,missionController.create)
router.get('/list',authController.verifyToken,missionController.getMission)
router.get('/any_by',authController.verifyToken,missionController.getBy)

module.exports = router