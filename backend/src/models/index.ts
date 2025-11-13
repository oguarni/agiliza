import { Sequelize } from 'sequelize';
import { initUserModel } from './User';
import { initTaskModel, associateTask } from './Task';
import { initProjectModel, associateProject } from './Project';
import { initTaskHistoryModel, associateTaskHistory } from './TaskHistory';
import { initTaskCommentModel, associateTaskComment } from './TaskComment';
import { initTaskAttachmentModel, associateTaskAttachment } from './TaskAttachment';

const env = process.env.NODE_ENV || 'development';
const config = require('../config/database.js')[env];

// Create Sequelize instance
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging,
  }
);

// Initialize models
const User = initUserModel(sequelize);
const Task = initTaskModel(sequelize);
const Project = initProjectModel(sequelize);
const TaskHistory = initTaskHistoryModel(sequelize);
const TaskComment = initTaskCommentModel(sequelize);
const TaskAttachment = initTaskAttachmentModel(sequelize);

// Define associations
User.hasMany(Task, {
  foreignKey: 'user_id',
  as: 'tasks',
});
User.hasMany(Project, {
  foreignKey: 'gestor_id',
  as: 'projects',
});
User.hasMany(TaskHistory, {
  foreignKey: 'user_id',
  as: 'taskHistories',
});
User.hasMany(TaskComment, {
  foreignKey: 'user_id',
  as: 'comments',
});
User.hasMany(TaskAttachment, {
  foreignKey: 'user_id',
  as: 'attachments',
});
Project.hasMany(Task, {
  foreignKey: 'project_id',
  as: 'tasks',
});
Task.hasMany(TaskHistory, {
  foreignKey: 'task_id',
  as: 'history',
});
Task.hasMany(TaskComment, {
  foreignKey: 'task_id',
  as: 'comments',
});
Task.hasMany(TaskAttachment, {
  foreignKey: 'task_id',
  as: 'attachments',
});
associateTask();
associateProject();
associateTaskHistory();
associateTaskComment();
associateTaskAttachment();

// Export models and sequelize instance
export { sequelize, User, Task, Project, TaskHistory, TaskComment, TaskAttachment };
