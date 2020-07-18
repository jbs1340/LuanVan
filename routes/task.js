const authController = require('../controllers/authController');
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.post('/create', authController.verifyToken, taskController.create)
router.put('/status', authController.verifyToken, taskController.updateStatus)
router.put('/done', authController.verifyToken, taskController.done)
router.put('/add_members', authController.verifyToken, taskController.addMembers)
router.delete('/remove_members', authController.verifyToken, taskController.removeMembers)
router.get('/by_project*', authController.verifyToken, taskController.getListTaskByProject)
router.get('/by_id', authController.verifyToken, taskController.getTaskByID)
router.get('/by_date', authController.verifyToken, taskController.filter_by_date)

module.exports = router