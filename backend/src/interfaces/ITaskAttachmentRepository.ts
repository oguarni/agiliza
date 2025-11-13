import { TaskAttachment } from '../domain/entities/TaskAttachment';

export interface CreateTaskAttachmentDTO {
  task_id: number;
  user_id: number;
  filename: string;
  filepath: string;
  filesize: number;
  mimetype: string;
}

export interface ITaskAttachmentRepository {
  findById(id: number): Promise<TaskAttachment | null>;
  findByTaskId(taskId: number): Promise<TaskAttachment[]>;
  create(data: CreateTaskAttachmentDTO): Promise<TaskAttachment>;
  delete(id: number): Promise<boolean>;
}
