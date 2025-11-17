import { injectable, inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import TaskCommentService from '../services/TaskCommentService';

@injectable()
class TaskCommentController {
  private taskCommentService: TaskCommentService;

  constructor(@inject('TaskCommentService') taskCommentService: TaskCommentService) {
    this.taskCommentService = taskCommentService;
  }

  getComments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const taskId = parseInt(req.params.taskId, 10);

      if (isNaN(taskId)) {
        res.status(400).json({ error: 'Invalid task ID' });
        return;
      }

      const comments = await this.taskCommentService.getTaskComments(userId, taskId);

      res.status(200).json({
        message: 'Comments retrieved successfully',
        data: comments,
      });
    } catch (error) {
      next(error);
    }
  };

  createComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const userId = req.user!.id;
      const taskId = parseInt(req.params.taskId, 10);
      const { content } = req.body;

      if (isNaN(taskId)) {
        res.status(400).json({ error: 'Invalid task ID' });
        return;
      }

      const comment = await this.taskCommentService.createComment(userId, taskId, content);

      res.status(201).json({
        message: 'Comment created successfully',
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  };

  updateComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const userId = req.user!.id;
      const commentId = parseInt(req.params.commentId, 10);
      const { content } = req.body;

      if (isNaN(commentId)) {
        res.status(400).json({ error: 'Invalid comment ID' });
        return;
      }

      const comment = await this.taskCommentService.updateComment(userId, commentId, content);

      res.status(200).json({
        message: 'Comment updated successfully',
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const commentId = parseInt(req.params.commentId, 10);

      if (isNaN(commentId)) {
        res.status(400).json({ error: 'Invalid comment ID' });
        return;
      }

      await this.taskCommentService.deleteComment(userId, commentId);

      res.status(200).json({
        message: 'Comment deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default TaskCommentController;
