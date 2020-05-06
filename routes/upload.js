const express = require('express');
const router  = express.Router();
var uploadController = require("../controllers/uploadController");

router.post('',uploadController.uploads)

module.exports = router