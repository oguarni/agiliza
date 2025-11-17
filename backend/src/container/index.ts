import 'reflect-metadata';
import { Container } from 'inversify';
import { ITaskRepository } from '../interfaces/ITaskRepository';
import { IUserRepository } from '../interfaces/IUserRepository';
import { ILogger } from '../utils/logger';
import TaskRepository from '../repositories/TaskRepository';
import UserRepository from '../repositories/UserRepository';
import ProjectRepository from '../repositories/ProjectRepository';
import TaskCommentRepository from '../repositories/TaskCommentRepository';
import TaskAttachmentRepository from '../repositories/TaskAttachmentRepository';
import TaskHistoryRepository from '../repositories/TaskHistoryRepository';
import TaskService from '../services/TaskService';
import AuthService from '../services/AuthService';
import ProjectService from '../services/ProjectService';
import TaskCommentService from '../services/TaskCommentService';
import TaskAttachmentService from '../services/TaskAttachmentService';
import { ConsoleLogger } from '../utils/logger';
import { CreateTaskUseCase } from '../usecases/CreateTaskUseCase';
import { UpdateTaskUseCase } from '../usecases/UpdateTaskUseCase';
import { DeleteTaskUseCase } from '../usecases/DeleteTaskUseCase';
import { GetTasksUseCase } from '../usecases/GetTasksUseCase';
import AuthController from '../controllers/AuthController';
import TaskController from '../controllers/TaskController';
import ProjectController from '../controllers/ProjectController';
import TaskCommentController from '../controllers/TaskCommentController';
import TaskAttachmentController from '../controllers/TaskAttachmentController';

// Dependency injection container
const container = new Container();

// Bind repositories
container.bind<ITaskRepository>('TaskRepository').to(TaskRepository).inSingletonScope();
container.bind<IUserRepository>('UserRepository').to(UserRepository).inSingletonScope();
container.bind('ProjectRepository').to(ProjectRepository).inSingletonScope();
container.bind('TaskCommentRepository').to(TaskCommentRepository).inSingletonScope();
container.bind('TaskAttachmentRepository').to(TaskAttachmentRepository).inSingletonScope();
container.bind('TaskHistoryRepository').to(TaskHistoryRepository).inSingletonScope();

// Bind services
container.bind('TaskService').to(TaskService).inSingletonScope();
container.bind('AuthService').to(AuthService).inSingletonScope();
container.bind('ProjectService').to(ProjectService).inSingletonScope();
container.bind('TaskCommentService').to(TaskCommentService).inSingletonScope();
container.bind('TaskAttachmentService').to(TaskAttachmentService).inSingletonScope();

// Bind logger factory
container.bind<ILogger>('Logger').toDynamicValue(() => {
  return new ConsoleLogger('App');
});

// Bind use cases
container.bind('CreateTaskUseCase').to(CreateTaskUseCase);
container.bind('UpdateTaskUseCase').to(UpdateTaskUseCase);
container.bind('DeleteTaskUseCase').to(DeleteTaskUseCase);
container.bind('GetTasksUseCase').to(GetTasksUseCase);

// Bind controllers
container.bind('AuthController').to(AuthController);
container.bind('TaskController').to(TaskController);
container.bind('ProjectController').to(ProjectController);
container.bind('TaskCommentController').to(TaskCommentController);
container.bind('TaskAttachmentController').to(TaskAttachmentController);

export { container };
