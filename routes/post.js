const express = require('express');
const router  = express.Router();
const postController = require('../controllers/postController')
const authController = require('../controllers/authController');

router.post("/create",authController.verifyToken,postController.create)
router.get("/any",authController.verifyToken,postController.getPosts)

module.exports = router