import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

// Task interface
interface Task {
  id: number;
  title: string;
  description: string | null;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high' | null;
  due_date: string | null;
  created_at: string;
}

/**
 * DashboardPage component
 * Displays user's tasks and allows creating new tasks
 */
const DashboardPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form state for creating new tasks
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const { user, logout } = useAuth();

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tasks');
      setTasks(response.data.data);
      setError('');
    } catch (err: any) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post('/tasks', {
        title,
        description,
        priority,
      });

      // Reset form
      setTitle('');
      setDescription('');
      setPriority('medium');
      setShowForm(false);

      // Refresh tasks
      fetchTasks();
    } catch (err: any) {
      setError('Failed to create task');
      console.error(err);
    }
  };

  const handleCompleteTask = async (taskId: number) => {
    try {
      await api.patch(`/tasks/${taskId}/complete`);
      fetchTasks();
    } catch (err: any) {
      setError('Failed to complete task');
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (err: any) {
      setError('Failed to delete task');
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1>Task Management System</h1>
        <div>
          <span style={styles.userName}>Welcome, {user?.name}!</span>
          <button onClick={logout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={styles.content}>
        <div style={styles.titleBar}>
          <h2>My Tasks</h2>
          <button onClick={() => setShowForm(!showForm)} style={styles.addButton}>
            {showForm ? 'Cancel' : 'Add Task'}
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {/* Create task form */}
        {showForm && (
          <form onSubmit={handleCreateTask} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={styles.input}
                placeholder="Enter task title"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ ...styles.input, minHeight: '80px' }}
                placeholder="Enter task description (optional)"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                style={styles.input}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <button type="submit" style={styles.submitButton}>
              Create Task
            </button>
          </form>
        )}

        {/* Tasks list */}
        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p style={styles.emptyMessage}>No tasks yet. Create your first task!</p>
        ) : (
          <div style={styles.taskList}>
            {tasks.map((task) => (
              <div key={task.id} style={styles.taskCard}>
                <div style={styles.taskHeader}>
                  <h3 style={task.status === 'completed' ? styles.completedTitle : undefined}>
                    {task.title}
                  </h3>
                  <span style={getPriorityStyle(task.priority)}>{task.priority || 'none'}</span>
                </div>

                {task.description && <p style={styles.description}>{task.description}</p>}

                <div style={styles.taskFooter}>
                  <span style={styles.status}>Status: {task.status}</span>
                  <div style={styles.actions}>
                    {task.status === 'pending' && (
                      <button
                        onClick={() => handleCompleteTask(task.id)}
                        style={styles.completeButton}
                      >
                        Complete
                      </button>
                    )}
                    <button onClick={() => handleDeleteTask(task.id)} style={styles.deleteButton}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function for priority badge styles
const getPriorityStyle = (priority: string | null): React.CSSProperties => {
  const baseStyle: React.CSSProperties = {
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.875rem',
    fontWeight: '500',
    textTransform: 'uppercase',
  };

  switch (priority) {
    case 'high':
      return { ...baseStyle, backgroundColor: '#f8d7da', color: '#721c24' };
    case 'medium':
      return { ...baseStyle, backgroundColor: '#fff3cd', color: '#856404' };
    case 'low':
      return { ...baseStyle, backgroundColor: '#d1ecf1', color: '#0c5460' };
    default:
      return { ...baseStyle, backgroundColor: '#e9ecef', color: '#495057' };
  }
};

// Styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    marginRight: '1rem',
  },
  logoutButton: {
    padding: '0.5rem 1rem',
    backgroundColor: 'white',
    color: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  titleBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  addButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  form: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  formGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#555',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box',
  },
  submitButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  error: {
    padding: '1rem',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#777',
    padding: '2rem',
  },
  taskList: {
    display: 'grid',
    gap: '1rem',
  },
  taskCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  taskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  completedTitle: {
    textDecoration: 'line-through',
    color: '#999',
  },
  description: {
    color: '#666',
    marginBottom: '1rem',
  },
  taskFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid #eee',
  },
  status: {
    color: '#555',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
  },
  completeButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default DashboardPage;
