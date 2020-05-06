const express = require('express');
const router  = express.Router();
const chatRoomController = require('../controllers/chatRoomController')
const authController = require('../controllers/authController');

router.post("/create",authController.verifyToken,chatRoomController.create)
router.get("/my_room",authController.verifyToken,chatRoomController.getMyChatRoom)
module.exports = router