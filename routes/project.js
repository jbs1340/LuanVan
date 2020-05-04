const authController = require('../controllers/authController');
const express = require('express');
const router  = express.Router();
const projectController = require('../controllers/projectController')

router.post('/create',authController.verifyToken,projectController.create)
router.get('/mine_is_active',authController.verifyToken,projectController.getMyProjectsIsActive)
router.get('/mine',authController.verifyToken,projectController.getMyProjects)
router.get('/by_id',authController.verifyToken,projectController.getProjectByID)
router.put('/add_members',authController.verifyToken,projectController.updateMembers)
router.put('/status',authController.verifyToken,projectController.updateStatus)
router.delete('/remove_members',authController.verifyToken,projectController.removeMembers)


module.exports = router