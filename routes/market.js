const express = require('express');
const router  = express.Router();
const authController = require('../controllers/authController');
const marketController = require('../controllers/marketController')

router.post('/add',authController.verifyToken,marketController.add)
router.get('/any',authController.verifyToken,marketController.getItem)
router.get('/self',authController.verifyToken,marketController.getItemByID)
router.put('/buy',authController.verifyToken,marketController.buy)

module.exports = router