import express from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import {
  getAllComments,
  createComment,
  updateComment,
  deleteComment,
} from '../controllers/commentController.js';

const router = express.Router({ mergeParams: true });

router.route('/').get(getAllComments).post(protect, createComment);

router
  .route('/:id')
  .patch(protect, restrictTo('admin', 'author'), updateComment)
  .delete(protect, restrictTo('admin', 'author'), deleteComment);

export default router;
