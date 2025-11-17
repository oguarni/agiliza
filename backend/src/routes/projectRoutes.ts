import { Router } from 'express';
import { body } from 'express-validator';
import { container } from '../container';
import ProjectController from '../controllers/ProjectController';
import authMiddleware from '../middlewares/authMiddleware';
import { requireGestorOrAdmin } from '../middlewares/roleMiddleware';

const router = Router();

// Resolve controller from DI container
const projectController = container.get<ProjectController>('ProjectController');

// All routes require authentication
router.use(authMiddleware);

// GET /api/projects - Get all projects for authenticated user
router.get(
  '/',
  projectController.getProjects
);

// GET /api/projects/:id - Get single project
router.get(
  '/:id',
  projectController.getProject
);

// POST /api/projects - Create new project (gestor or admin only)
router.post(
  '/',
  requireGestorOrAdmin,
  [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ max: 255 })
      .withMessage('Title must be at most 255 characters'),
    body('description')
      .optional()
      .isLength({ max: 5000 })
      .withMessage('Description must be at most 5000 characters'),
    body('deadline')
      .notEmpty()
      .withMessage('Deadline is required')
      .isISO8601()
      .withMessage('Deadline must be a valid date'),
  ],
  projectController.createProject
);

// PUT /api/projects/:id - Update project
router.put(
  '/:id',
  [
    body('title')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Title cannot be empty')
      .isLength({ max: 255 })
      .withMessage('Title must be at most 255 characters'),
    body('description')
      .optional()
      .isLength({ max: 5000 })
      .withMessage('Description must be at most 5000 characters'),
    body('deadline')
      .optional()
      .isISO8601()
      .withMessage('Deadline must be a valid date'),
  ],
  projectController.updateProject
);

// DELETE /api/projects/:id - Delete project
router.delete(
  '/:id',
  projectController.deleteProject
);

export default router;
