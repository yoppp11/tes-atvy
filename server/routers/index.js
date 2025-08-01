const express = require('express');
const UserController = require('../controllers/userController');
const { authenticationMidlleware } = require('../middlewares/authMiddleware');
const TaskController = require('../controllers/taskController');
const router = express.Router();

router.post('/register', UserController.routeRegister)
router.post('/login', UserController.routeLogin)
router.use(authenticationMidlleware)

router.post('/tasks', TaskController.routeCreateTask)
router.get('/tasks', TaskController.routeGetAllTasks)
router.get('/tasks/:id', TaskController.routeGetTaskById)
router.put('/tasks/:id', TaskController.routeEditTask)
router.delete('/tasks/:id', TaskController.routeDeleteTask)


module.exports = router