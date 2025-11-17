import { injectable } from 'inversify';
import { TaskComment as TaskCommentModel } from '../models';
import { TaskComment } from '../domain/entities/TaskComment';
import { TaskCommentMapper } from '../mappers/TaskCommentMapper';
import { CreateTaskCommentDTO, UpdateTaskCommentDTO } from '../interfaces/ITaskCommentRepository';

@injectable()
class TaskCommentRepository {
  async findById(id: number): Promise<TaskComment | null> {
    try {
      const comment = await TaskCommentModel.findByPk(id);
      return comment ? TaskCommentMapper.toDomain(comment) : null;
    } catch (error) {
      throw new Error(`Error finding comment by ID: ${error}`);
    }
  }

  async findByTaskId(taskId: number): Promise<TaskComment[]> {
    try {
      const comments = await TaskCommentModel.findAll({
        where: { task_id: taskId },
        order: [['created_at', 'ASC']], // Chronological order
      });
      return TaskCommentMapper.toDomainList(comments);
    } catch (error) {
      throw new Error(`Error finding comments by task ID: ${error}`);
    }
  }

  async create(data: CreateTaskCommentDTO): Promise<TaskComment> {
    try {
      const comment = await TaskCommentModel.create(data);
      return TaskCommentMapper.toDomain(comment);
    } catch (error) {
      throw new Error(`Error creating comment: ${error}`);
    }
  }

  async update(id: number, data: UpdateTaskCommentDTO): Promise<TaskComment | null> {
    try {
      const comment = await TaskCommentModel.findByPk(id);
      if (!comment) {
        return null;
      }

      await comment.update(data);
      return TaskCommentMapper.toDomain(comment);
    } catch (error) {
      throw new Error(`Error updating comment: ${error}`);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result = await TaskCommentModel.destroy({
        where: { id },
      });
      return result > 0;
    } catch (error) {
      throw new Error(`Error deleting comment: ${error}`);
    }
  }
}

export default TaskCommentRepository;
