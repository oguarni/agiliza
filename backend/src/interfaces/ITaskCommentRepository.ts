import { TaskComment } from '../domain/entities/TaskComment';

export interface CreateTaskCommentDTO {
  task_id: number;
  user_id: number;
  content: string;
}

export interface UpdateTaskCommentDTO {
  content: string;
}

export interface ITaskCommentRepository {
  findById(id: number): Promise<TaskComment | null>;
  findByTaskId(taskId: number): Promise<TaskComment[]>;
  create(data: CreateTaskCommentDTO): Promise<TaskComment>;
  update(id: number, data: UpdateTaskCommentDTO): Promise<TaskComment | null>;
  delete(id: number): Promise<boolean>;
}
