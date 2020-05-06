const express = require('express');
const router  = express.Router();
const authController = require('../controllers/authController');
const messController = require('../controllers/messageController');

router.get('/any_by_id_room',authController.verifyToken,messController.getMessByIDRoom)

module.exports = router