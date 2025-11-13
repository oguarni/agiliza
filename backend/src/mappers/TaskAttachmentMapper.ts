import { TaskAttachment } from '../domain/entities/TaskAttachment';
import TaskAttachmentModel from '../models/TaskAttachment';

export class TaskAttachmentMapper {
  static toDomain(model: TaskAttachmentModel): TaskAttachment {
    return new TaskAttachment(
      model.id,
      model.task_id,
      model.user_id,
      model.filename,
      model.filepath,
      model.filesize,
      model.mimetype,
      model.created_at
    );
  }

  static toDomainList(models: TaskAttachmentModel[]): TaskAttachment[] {
    return models.map(model => this.toDomain(model));
  }
}
