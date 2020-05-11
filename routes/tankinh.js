const express = require('express');
const router  = express.Router();
const authController = require('../controllers/authController');
const tanKinhController = require('../controllers/tanKinhController')

router.post('/create', authController.verifyToken,tanKinhController.create)
router.get('/any',authController.verifyToken, tanKinhController.get)
router.put('/add_books',authController.verifyToken,tanKinhController.add_books)

module.exports = router