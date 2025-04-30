const express = require('express');
const router = express.Router();
const { 
  getTasks, 
  createTask, 
  getTask, 
  updateTask, 
  deleteTask 
} = require('../controllers/taskController');
const validateRequest = require('../middleware/validateRequest');
const {
  createTaskSchema,
  updateTaskSchema,
  taskIdSchema
} = require('../validations/taskValidation');

// GET all tasks
router.get('/', getTasks);

// POST create new task
router.post('/', validateRequest(createTaskSchema), createTask);

// GET single task
router.get('/:id', validateRequest(taskIdSchema), getTask);

// PUT update task
router.put('/:id', validateRequest(updateTaskSchema), updateTask);

// DELETE task
router.delete('/:id', validateRequest(taskIdSchema), deleteTask);

module.exports = router; 