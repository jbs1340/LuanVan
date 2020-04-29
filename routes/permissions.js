const express = require('express');
const router  = express.Router();
const permissionController = require('../controllers/permissionController')

router.post('/create', permissionController.create);

module.exports = router