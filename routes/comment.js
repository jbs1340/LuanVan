const express = require('express');
const router  = express.Router();
const commentController = require('../controllers/commentController')
const authController = require('../controllers/authController');

router.post("/post",authController.verifyToken, commentController.create)
router.get("/any",authController.verifyToken, commentController.getComments)

module.exports = router