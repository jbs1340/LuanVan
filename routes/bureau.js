const express = require('express');
const router = express.Router();
const bureauController = require('../controllers/bureauController');
const authController = require('../controllers/authController');

router.post("/create", authController.verifyToken, bureauController.create)
router.get("/any", authController.verifyToken, bureauController.getAny)

module.exports = router;