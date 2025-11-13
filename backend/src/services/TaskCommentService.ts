import TaskCommentRepository from '../repositories/TaskCommentRepository';
import TaskRepository from '../repositories/TaskRepository';
import { TaskComment } from '../domain/entities/TaskComment';
import { AuthorizationError, UserNotFoundError } from '../errors';

class TaskCommentService {
  private taskCommentRepository: TaskCommentRepository;
  private taskRepository: TaskRepository;

  constructor(taskCommentRepository: TaskCommentRepository, taskRepository: TaskRepository) {
    this.taskCommentRepository = taskCommentRepository;
    this.taskRepository = taskRepository;
  }

  async getTaskComments(userId: number, taskId: number): Promise<TaskComment[]> {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new UserNotFoundError('Task not found');
    }

    // User must own the task to see comments
    if (!task.isOwnedBy(userId)) {
      throw new AuthorizationError('You are not authorized to view comments for this task');
    }

    return await this.taskCommentRepository.findByTaskId(taskId);
  }

  async createComment(userId: number, taskId: number, content: string): Promise<TaskComment> {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new UserNotFoundError('Task not found');
    }

    // User must own the task to comment
    if (!task.isOwnedBy(userId)) {
      throw new AuthorizationError('You are not authorized to comment on this task');
    }

    return await this.taskCommentRepository.create({
      task_id: taskId,
      user_id: userId,
      content,
    });
  }

  async updateComment(userId: number, commentId: number, content: string): Promise<TaskComment> {
    const comment = await this.taskCommentRepository.findById(commentId);
    if (!comment) {
      throw new UserNotFoundError('Comment not found');
    }

    // Only the comment author can edit it
    if (!comment.isAuthoredBy(userId)) {
      throw new AuthorizationError('You can only edit your own comments');
    }

    const updated = await this.taskCommentRepository.update(commentId, { content });
    if (!updated) {
      throw new Error('Failed to update comment');
    }

    return updated;
  }

  async deleteComment(userId: number, commentId: number): Promise<boolean> {
    const comment = await this.taskCommentRepository.findById(commentId);
    if (!comment) {
      throw new UserNotFoundError('Comment not found');
    }

    // Only the comment author can delete it
    if (!comment.isAuthoredBy(userId)) {
      throw new AuthorizationError('You can only delete your own comments');
    }

    return await this.taskCommentRepository.delete(commentId);
  }
}

export default TaskCommentService;
