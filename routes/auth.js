const express = require('express');
const router  = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const rankController = require('../controllers/rankController');

router.post('/login/user', authController.loginUser);
router.post('/login/admin', authController.loginAdmin);
router.post('/register',authController.register);
router.get('/any',authController.verifyToken,userController.getUsersAny)
router.get('/all',authController.verifyToken,userController.getUsersAll)
router.get('/rank_all',rankController.rank_all)
router.get('/rank_self',authController.verifyToken,rankController.rank_self)
module.exports = router;