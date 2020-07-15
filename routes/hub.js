const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const hubController = require('../controllers/hubController')

router.get("/any", authController.verifyToken, hubController.getAllSortByLevel)
router.put("/use", authController.verifyToken, hubController.use)

module.exports = router