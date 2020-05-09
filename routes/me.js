var express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

var router = express.Router();
/* GET users listing. */
router.get('/',authController.verifyToken,userController.me)
router.put('/update_info', authController.verifyToken, authController.updateInfo);


module.exports = router;