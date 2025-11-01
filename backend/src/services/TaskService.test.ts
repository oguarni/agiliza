import TaskService from './TaskService';
import TaskRepository from '../repositories/TaskRepository';
import { AuthorizationError, UserNotFoundError } from '../errors';

// Mock TaskRepository
jest.mock('../repositories/TaskRepository');

describe('TaskService', () => {
  let taskService: TaskService;
  let mockTaskRepository: jest.Mocked<TaskRepository>;

  beforeEach(() => {
    mockTaskRepository = new TaskRepository() as jest.Mocked<TaskRepository>;
    taskService = new TaskService(mockTaskRepository);
    jest.clearAllMocks();
  });

  describe('getTasks', () => {
    it('should return all tasks for a user', async () => {
      // Arrange
      const userId = 1;
      const mockTasks = [
        {
          id: 1,
          user_id: userId,
          title: 'Task 1',
          status: 'pending',
        },
        {
          id: 2,
          user_id: userId,
          title: 'Task 2',
          status: 'completed',
        },
      ];

      mockTaskRepository.findAllByUserId.mockResolvedValue(mockTasks as any);

      // Act
      const result = await taskService.getTasks(userId);

      // Assert
      expect(mockTaskRepository.findAllByUserId).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockTasks);
    });
  });

  describe('createTask', () => {
    it('should create a new task for a user', async () => {
      // Arrange
      const userId = 1;
      const taskData = {
        title: 'New Task',
        description: 'Task description',
        priority: 'high' as const,
      };

      const mockCreatedTask = {
        id: 1,
        user_id: userId,
        ...taskData,
        status: 'pending',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockTaskRepository.create.mockResolvedValue(mockCreatedTask as any);

      // Act
      const result = await taskService.createTask(userId, taskData);

      // Assert
      expect(mockTaskRepository.create).toHaveBeenCalledWith({
        user_id: userId,
        ...taskData,
      });
      expect(result).toEqual(mockCreatedTask);
    });
  });

  describe('completeTask', () => {
    it('should successfully complete a task owned by the user', async () => {
      // Arrange
      const userId = 1;
      const taskId = 1;
      const mockTask = {
        id: taskId,
        user_id: userId,
        title: 'Task',
        status: 'pending' as const,
      };

      const mockUpdatedTask = {
        ...mockTask,
        status: 'completed' as const,
      };

      mockTaskRepository.findById.mockResolvedValue(mockTask as any);
      mockTaskRepository.update.mockResolvedValue(mockUpdatedTask as any);

      // Act
      const result = await taskService.completeTask(userId, taskId);

      // Assert
      expect(mockTaskRepository.findById).toHaveBeenCalledWith(taskId);
      expect(mockTaskRepository.update).toHaveBeenCalledWith(taskId, {
        status: 'completed',
      });
      expect(result).toEqual(mockUpdatedTask);
    });

    it('should throw AuthorizationError if task belongs to different user', async () => {
      // Arrange
      const userId = 1;
      const differentUserId = 2;
      const taskId = 1;

      const mockTask = {
        id: taskId,
        user_id: differentUserId, // Different user!
        title: 'Task',
        status: 'pending' as const,
      };

      mockTaskRepository.findById.mockResolvedValue(mockTask as any);

      // Act & Assert
      await expect(taskService.completeTask(userId, taskId)).rejects.toThrow(AuthorizationError);
      expect(mockTaskRepository.findById).toHaveBeenCalledWith(taskId);
      expect(mockTaskRepository.update).not.toHaveBeenCalled();
    });

    it('should throw UserNotFoundError if task does not exist', async () => {
      // Arrange
      const userId = 1;
      const taskId = 999;

      mockTaskRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(taskService.completeTask(userId, taskId)).rejects.toThrow(UserNotFoundError);
      expect(mockTaskRepository.findById).toHaveBeenCalledWith(taskId);
      expect(mockTaskRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('updateTask', () => {
    it('should successfully update a task owned by the user', async () => {
      // Arrange
      const userId = 1;
      const taskId = 1;
      const updateData = {
        title: 'Updated Task',
        priority: 'low' as const,
      };

      const mockTask = {
        id: taskId,
        user_id: userId,
        title: 'Original Task',
        status: 'pending' as const,
      };

      const mockUpdatedTask = {
        ...mockTask,
        ...updateData,
      };

      mockTaskRepository.findById.mockResolvedValue(mockTask as any);
      mockTaskRepository.update.mockResolvedValue(mockUpdatedTask as any);

      // Act
      const result = await taskService.updateTask(userId, taskId, updateData);

      // Assert
      expect(mockTaskRepository.findById).toHaveBeenCalledWith(taskId);
      expect(mockTaskRepository.update).toHaveBeenCalledWith(taskId, updateData);
      expect(result).toEqual(mockUpdatedTask);
    });

    it('should throw AuthorizationError if task belongs to different user', async () => {
      // Arrange
      const userId = 1;
      const differentUserId = 2;
      const taskId = 1;
      const updateData = { title: 'Updated Task' };

      const mockTask = {
        id: taskId,
        user_id: differentUserId, // Different user!
        title: 'Original Task',
      };

      mockTaskRepository.findById.mockResolvedValue(mockTask as any);

      // Act & Assert
      await expect(taskService.updateTask(userId, taskId, updateData)).rejects.toThrow(
        AuthorizationError
      );
      expect(mockTaskRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteTask', () => {
    it('should successfully delete a task owned by the user', async () => {
      // Arrange
      const userId = 1;
      const taskId = 1;

      const mockTask = {
        id: taskId,
        user_id: userId,
        title: 'Task to delete',
      };

      mockTaskRepository.findById.mockResolvedValue(mockTask as any);
      mockTaskRepository.delete.mockResolvedValue(true);

      // Act
      const result = await taskService.deleteTask(userId, taskId);

      // Assert
      expect(mockTaskRepository.findById).toHaveBeenCalledWith(taskId);
      expect(mockTaskRepository.delete).toHaveBeenCalledWith(taskId);
      expect(result).toBe(true);
    });

    it('should throw AuthorizationError if task belongs to different user', async () => {
      // Arrange
      const userId = 1;
      const differentUserId = 2;
      const taskId = 1;

      const mockTask = {
        id: taskId,
        user_id: differentUserId, // Different user!
        title: 'Task',
      };

      mockTaskRepository.findById.mockResolvedValue(mockTask as any);

      // Act & Assert
      await expect(taskService.deleteTask(userId, taskId)).rejects.toThrow(AuthorizationError);
      expect(mockTaskRepository.delete).not.toHaveBeenCalled();
    });
  });
});
