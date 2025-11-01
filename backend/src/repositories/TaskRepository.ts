import { Task } from '../models';
import TaskModel from '../models/Task';

// Task data transfer object for creation
interface CreateTaskDTO {
  user_id: number;
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  due_date?: Date;
}

// Task data transfer object for update
interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: 'pending' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  due_date?: Date;
}

// TaskRepository class - Data Access Layer
class TaskRepository {
  /**
   * Find a task by ID
   * @param id - Task's ID
   * @returns Task instance or null if not found
   */
  async findById(id: number): Promise<TaskModel | null> {
    try {
      const task = await Task.findByPk(id);
      return task;
    } catch (error) {
      throw new Error(`Error finding task by ID: ${error}`);
    }
  }

  /**
   * Find all tasks for a specific user
   * @param userId - User's ID
   * @returns Array of task instances
   */
  async findAllByUserId(userId: number): Promise<TaskModel[]> {
    try {
      const tasks = await Task.findAll({
        where: { user_id: userId },
        order: [['created_at', 'DESC']],
      });
      return tasks;
    } catch (error) {
      throw new Error(`Error finding tasks by user ID: ${error}`);
    }
  }

  /**
   * Create a new task
   * @param taskData - Task creation data
   * @returns Created task instance
   */
  async create(taskData: CreateTaskDTO): Promise<TaskModel> {
    try {
      const task = await Task.create(taskData);
      return task;
    } catch (error) {
      throw new Error(`Error creating task: ${error}`);
    }
  }

  /**
   * Update a task
   * @param id - Task's ID
   * @param taskData - Task update data
   * @returns Updated task instance or null if not found
   */
  async update(id: number, taskData: UpdateTaskDTO): Promise<TaskModel | null> {
    try {
      const task = await Task.findByPk(id);
      if (!task) {
        return null;
      }

      await task.update(taskData);
      return task;
    } catch (error) {
      throw new Error(`Error updating task: ${error}`);
    }
  }

  /**
   * Delete a task
   * @param id - Task's ID
   * @returns true if deleted, false if not found
   */
  async delete(id: number): Promise<boolean> {
    try {
      const task = await Task.findByPk(id);
      if (!task) {
        return false;
      }

      await task.destroy();
      return true;
    } catch (error) {
      throw new Error(`Error deleting task: ${error}`);
    }
  }
}

export default TaskRepository;
