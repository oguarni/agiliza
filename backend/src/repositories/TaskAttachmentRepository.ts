import { TaskAttachment as TaskAttachmentModel } from '../models';
import { TaskAttachment } from '../domain/entities/TaskAttachment';
import { TaskAttachmentMapper } from '../mappers/TaskAttachmentMapper';
import { CreateTaskAttachmentDTO } from '../interfaces/ITaskAttachmentRepository';

class TaskAttachmentRepository {
  async findById(id: number): Promise<TaskAttachment | null> {
    try {
      const attachment = await TaskAttachmentModel.findByPk(id);
      return attachment ? TaskAttachmentMapper.toDomain(attachment) : null;
    } catch (error) {
      throw new Error(`Error finding attachment by ID: ${error}`);
    }
  }

  async findByTaskId(taskId: number): Promise<TaskAttachment[]> {
    try {
      const attachments = await TaskAttachmentModel.findAll({
        where: { task_id: taskId },
        order: [['created_at', 'DESC']],
      });
      return TaskAttachmentMapper.toDomainList(attachments);
    } catch (error) {
      throw new Error(`Error finding attachments by task ID: ${error}`);
    }
  }

  async create(data: CreateTaskAttachmentDTO): Promise<TaskAttachment> {
    try {
      const attachment = await TaskAttachmentModel.create(data);
      return TaskAttachmentMapper.toDomain(attachment);
    } catch (error) {
      throw new Error(`Error creating attachment: ${error}`);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result = await TaskAttachmentModel.destroy({
        where: { id },
      });
      return result > 0;
    } catch (error) {
      throw new Error(`Error deleting attachment: ${error}`);
    }
  }
}

export default TaskAttachmentRepository;
