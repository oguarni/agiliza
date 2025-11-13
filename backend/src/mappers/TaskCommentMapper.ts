import { TaskComment } from '../domain/entities/TaskComment';
import TaskCommentModel from '../models/TaskComment';

export class TaskCommentMapper {
  static toDomain(model: TaskCommentModel): TaskComment {
    return new TaskComment(
      model.id,
      model.task_id,
      model.user_id,
      model.content,
      model.created_at,
      model.updated_at
    );
  }

  static toDomainList(models: TaskCommentModel[]): TaskComment[] {
    return models.map(model => this.toDomain(model));
  }
}
