const express = require('express');
const router  = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

router.post('/login/user', authController.loginUser);
router.options('/login/user', (req,res)=>res.status(200));
router.post('/login/admin', authController.loginAdmin);
router.options('/login/admin', (req,res)=>res.status(200));
router.post('/register',authController.register);
router.get('/any',authController.verifyToken,userController.getUsersAny)
router.get('/all',authController.verifyToken,userController.getUsersAll)

module.exports = router;