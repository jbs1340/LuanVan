var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('', function(req, res) {
    return res.send("YUH started").status(200)
})

module.exports = router;