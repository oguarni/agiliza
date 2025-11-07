import request from 'supertest';
import express, { Application } from 'express';
import TaskService from '../services/TaskService';
import authMiddleware from '../middlewares/authMiddleware';
import { Task } from '../domain/entities/Task';

// Mock dependencies
jest.mock('../services/TaskService');
jest.mock('../middlewares/authMiddleware');
jest.mock('../repositories/TaskRepository');

describe('TaskController Integration Tests', () => {
  let app: Application;
  let mockTaskService: jest.Mocked<TaskService>;

  beforeEach(() => {
    // Clear module cache to ensure fresh imports
    jest.resetModules();

    // Create mock service with all methods
    mockTaskService = {
      getTasks: jest.fn(),
      createTask: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
      completeTask: jest.fn(),
    } as any;

    // Mock TaskService constructor to return our mock
    const TaskServiceMock = require('../services/TaskService').default;
    TaskServiceMock.mockImplementation(() => mockTaskService);

    // Mock authMiddleware to inject fake user
    const authMiddlewareMock = require('../middlewares/authMiddleware').default;
    authMiddlewareMock.mockImplementation((req: any, _res: any, next: any) => {
      req.user = { id: 1, email: 'test@example.com' };
      next();
    });

    // Create Express app
    app = express();
    app.use(express.json());

    // Load routes after mocks are set up
    const taskRoutes = require('../routes/taskRoutes').default;
    app.use('/api/tasks', taskRoutes);

    // Add error handler
    const errorHandlerMock = require('../middlewares/errorHandler').default;
    app.use(errorHandlerMock);
  });

  describe('GET /api/tasks', () => {
    it('should return 200 and list of tasks for authenticated user', async () => {
      // Arrange
      const now = new Date();
      const mockTasks = [
        new Task(1, 1, 'Task 1', 'Description 1', 'pending', 'high', null, now, now),
        new Task(2, 1, 'Task 2', 'Description 2', 'completed', 'low', null, now, now),
      ];

      mockTaskService.getTasks = jest.fn().mockResolvedValue(mockTasks);

      // Act
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', 'Bearer mock_token');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Tasks retrieved successfully');
      expect(response.body.data).toBeDefined();
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0]).toMatchObject({
        id: 1,
        userId: 1,
        title: 'Task 1',
        description: 'Description 1',
        status: 'pending',
        priority: 'high',
      });
      expect(mockTaskService.getTasks).toHaveBeenCalledWith(1);
    });

    it('should return 401 if user is not authenticated', async () => {
      // Arrange - Create new app with rejecting authMiddleware
      jest.resetModules();
      const authMiddlewareMock = require('../middlewares/authMiddleware').default;
      authMiddlewareMock.mockImplementation((_req: any, res: any) => {
        res.status(401).json({
          error: 'Unauthorized',
          message: 'No authorization header provided',
        });
      });

      const express = require('express');
      const testApp = express();
      testApp.use(express.json());
      const taskRoutes = require('../routes/taskRoutes').default;
      testApp.use('/api/tasks', taskRoutes);
      const errorHandlerMock = require('../middlewares/errorHandler').default;
      testApp.use(errorHandlerMock);

      // Act
      const response = await request(testApp).get('/api/tasks');

      // Assert
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });
  });

  describe('POST /api/tasks', () => {
    it('should return 201 and create a new task', async () => {
      // Arrange
      const newTaskData = {
        title: 'New Task',
        description: 'Task description',
        priority: 'medium',
      };

      const mockCreatedTask = {
        id: 1,
        user_id: 1,
        ...newTaskData,
        status: 'pending',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockTaskService.createTask = jest.fn().mockResolvedValue(mockCreatedTask);

      // Act
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', 'Bearer mock_token')
        .send(newTaskData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Task created successfully');
      expect(response.body.data).toMatchObject({
        id: 1,
        user_id: 1,
        title: 'New Task',
        description: 'Task description',
        priority: 'medium',
        status: 'pending',
      });
      expect(response.body.data.created_at).toBeDefined();
      expect(response.body.data.updated_at).toBeDefined();
    });

    it('should return 400 if title is missing', async () => {
      // Arrange
      const invalidTaskData = {
        description: 'Task without title',
      };

      // Act
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', 'Bearer mock_token')
        .send(invalidTaskData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('PATCH /api/tasks/:id/complete', () => {
    it('should return 200 and mark task as completed', async () => {
      // Arrange
      const taskId = 1;
      const mockCompletedTask = {
        id: taskId,
        user_id: 1,
        title: 'Task',
        status: 'completed',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockTaskService.completeTask = jest.fn().mockResolvedValue(mockCompletedTask);

      // Act
      const response = await request(app)
        .patch(`/api/tasks/${taskId}/complete`)
        .set('Authorization', 'Bearer mock_token');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Task marked as completed');
      expect(response.body.data.status).toBe('completed');
      expect(mockTaskService.completeTask).toHaveBeenCalledWith(1, taskId);
    });

    it('should return 400 if task ID is invalid', async () => {
      // Act
      const response = await request(app)
        .patch('/api/tasks/invalid/complete')
        .set('Authorization', 'Bearer mock_token');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid task ID');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should return 200 and update task', async () => {
      // Arrange
      const taskId = 1;
      const updateData = {
        title: 'Updated Task',
        priority: 'high',
      };

      const mockUpdatedTask = {
        id: taskId,
        user_id: 1,
        ...updateData,
        status: 'pending',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockTaskService.updateTask = jest.fn().mockResolvedValue(mockUpdatedTask);

      // Act
      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', 'Bearer mock_token')
        .send(updateData);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Task updated successfully');
      expect(response.body.data).toMatchObject({
        id: taskId,
        user_id: 1,
        title: 'Updated Task',
        priority: 'high',
        status: 'pending',
      });
      expect(response.body.data.created_at).toBeDefined();
      expect(response.body.data.updated_at).toBeDefined();
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should return 200 and delete task', async () => {
      // Arrange
      const taskId = 1;
      mockTaskService.deleteTask = jest.fn().mockResolvedValue(true);

      // Act
      const response = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', 'Bearer mock_token');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Task deleted successfully');
      expect(mockTaskService.deleteTask).toHaveBeenCalledWith(1, taskId);
    });
  });
});
