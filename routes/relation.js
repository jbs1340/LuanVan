const express = require('express');
const router  = express.Router();
const authController = require('../controllers/authController');
const relationController = require('../controllers/relationController');

router.post('/add_trainee',authController.verifyToken,relationController.add_trainee)
router.post('/add_mentor',authController.verifyToken,relationController.add_mentor)

module.exports = router