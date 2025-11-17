import { Router } from 'express';
import { body } from 'express-validator';
import { container } from '../container';
import TaskCommentController from '../controllers/TaskCommentController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

// Resolve controller from DI container
const taskCommentController = container.get<TaskCommentController>('TaskCommentController');

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
