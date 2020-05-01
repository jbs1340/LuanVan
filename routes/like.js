const express = require('express');
const router  = express.Router();
const likeController = require('../controllers/likeController')
const authController = require('../controllers/authController');

router.post("/like",authController.verifyToken,likeController.like)
router.delete("/unlike", authController.verifyToken, likeController.unLike)

module.exports = router

