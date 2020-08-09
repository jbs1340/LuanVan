const express = require('express');
const router = express.Router();
const notifyController = require('../controllers/notifyController')
const authController = require('../controllers/authController');

router.get('/any', authController.verifyToken, notifyController.getAny)
router.get('/mine', authController.verifyToken, notifyController.getMyNotifies)

module.exports = router