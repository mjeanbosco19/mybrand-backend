import { Router } from 'express';
import {
  createLike,
  getLike,
  updateLike,
  deleteLike,
} from '../controllers/likeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.route('/').post(createLike);
router.route('/:id').get(getLike).patch(updateLike).delete(deleteLike);

export default router;
