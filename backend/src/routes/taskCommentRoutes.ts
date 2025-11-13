import { Router } from 'express';
import { body } from 'express-validator';
import TaskCommentController from '../controllers/TaskCommentController';
import TaskCommentService from '../services/TaskCommentService';
import TaskCommentRepository from '../repositories/TaskCommentRepository';
import TaskRepository from '../repositories/TaskRepository';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

const taskCommentRepository = new TaskCommentRepository();
const taskRepository = new TaskRepository();
const taskCommentService = new TaskCommentService(taskCommentRepository, taskRepository);
const taskCommentController = new TaskCommentController(taskCommentService);

router.use(authMiddleware);

// GET /api/tasks/:taskId/comments - Get all comments for a task
router.get('/tasks/:taskId/comments', taskCommentController.getComments);

// POST /api/tasks/:taskId/comments - Create a comment
router.post(
  '/tasks/:taskId/comments',
  [
    body('content')
      .trim()
      .notEmpty()
      .withMessage('Content is required')
      .isLength({ max: 5000 })
      .withMessage('Content must be at most 5000 characters'),
  ],
  taskCommentController.createComment
);

// PUT /api/comments/:commentId - Update a comment
router.put(
  '/comments/:commentId',
  [
    body('content')
      .trim()
      .notEmpty()
      .withMessage('Content is required')
      .isLength({ max: 5000 })
      .withMessage('Content must be at most 5000 characters'),
  ],
  taskCommentController.updateComment
);

// DELETE /api/comments/:commentId - Delete a comment
router.delete('/comments/:commentId', taskCommentController.deleteComment);

export default router;
