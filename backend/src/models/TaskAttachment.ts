import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import Task from './Task';
import User from './User';

interface TaskAttachmentAttributes {
  id: number;
  task_id: number;
  user_id: number;
  filename: string;
  filepath: string;
  filesize: number;
  mimetype: string;
  created_at: Date;
}

interface TaskAttachmentCreationAttributes extends Optional<TaskAttachmentAttributes, 'id' | 'created_at'> {}

class TaskAttachment extends Model<TaskAttachmentAttributes, TaskAttachmentCreationAttributes> implements TaskAttachmentAttributes {
  public id!: number;
  public task_id!: number;
  public user_id!: number;
  public filename!: string;
  public filepath!: string;
  public filesize!: number;
  public mimetype!: string;
  public created_at!: Date;

  public readonly createdAt!: Date;
}

export const initTaskAttachmentModel = (sequelize: Sequelize): typeof TaskAttachment => {
  TaskAttachment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      task_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Tasks',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      filename: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      filepath: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      filesize: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      mimetype: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'TaskAttachments',
      timestamps: false,
      createdAt: 'created_at',
      updatedAt: false,
      indexes: [
        {
          fields: ['task_id'],
          name: 'idx_task_attachments_task_id',
        },
      ],
    }
  );

  return TaskAttachment;
};

export const associateTaskAttachment = (): void => {
  TaskAttachment.belongsTo(Task, {
    foreignKey: 'task_id',
    as: 'task',
  });
  TaskAttachment.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
  });
};

export default TaskAttachment;
