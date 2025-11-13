import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import Task from './Task';
import User from './User';

interface TaskCommentAttributes {
  id: number;
  task_id: number;
  user_id: number;
  content: string;
  created_at: Date;
  updated_at: Date;
}

interface TaskCommentCreationAttributes extends Optional<TaskCommentAttributes, 'id' | 'created_at' | 'updated_at'> {}

class TaskComment extends Model<TaskCommentAttributes, TaskCommentCreationAttributes> implements TaskCommentAttributes {
  public id!: number;
  public task_id!: number;
  public user_id!: number;
  public content!: string;
  public created_at!: Date;
  public updated_at!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initTaskCommentModel = (sequelize: Sequelize): typeof TaskComment => {
  TaskComment.init(
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
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'TaskComments',
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          fields: ['task_id'],
          name: 'idx_task_comments_task_id',
        },
      ],
    }
  );

  return TaskComment;
};

export const associateTaskComment = (): void => {
  TaskComment.belongsTo(Task, {
    foreignKey: 'task_id',
    as: 'task',
  });
  TaskComment.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
  });
};

export default TaskComment;
