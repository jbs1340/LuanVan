const express = require('express');
const router  = express.Router();
const bureauController = require('../controllers/bureauController');
const authController = require('../controllers/authController');

router.post("/create",authController.verifyToken,bureauController.create)

module.exports = router;