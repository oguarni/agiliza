import { Router } from 'express';
import { container } from '../container';
import TaskAttachmentController from '../controllers/TaskAttachmentController';
import authMiddleware from '../middlewares/authMiddleware';
import { upload } from '../middlewares/uploadMiddleware';

const router = Router();

// Resolve controller from DI container
const taskAttachmentController = container.get<TaskAttachmentController>('TaskAttachmentController');

router.use(authMiddleware);

// GET /api/tasks/:taskId/attachments - Get all attachments for a task
router.get('/tasks/:taskId/attachments', taskAttachmentController.getAttachments);

// POST /api/tasks/:taskId/attachments - Upload an attachment
router.post(
  '/tasks/:taskId/attachments',
  upload.single('file'),
  taskAttachmentController.uploadAttachment
);

// GET /api/attachments/:attachmentId/download - Download an attachment
router.get('/attachments/:attachmentId/download', taskAttachmentController.downloadAttachment);

// DELETE /api/attachments/:attachmentId - Delete an attachment
router.delete('/attachments/:attachmentId', taskAttachmentController.deleteAttachment);

export default router;
