import { Router } from 'express';
import multer from 'multer';
import {
  aliasTopBlogs,
  getAllBlogs,
  getBlogStats,
  createBlog,
  getBlog,
  updateBlog,
  deleteBlog,
  getBlogComments,
  addBlogLike,
  removeBlogLike,
} from '../controllers/blogController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import commentRouter from './commentRoutes.js';

const router = Router();

// Routes for comments
router.use('/:blogId/comments', commentRouter);

// Routes for likes
router.route('/:id/like').post(protect, addBlogLike);
router.route('/:id/like').delete(protect, removeBlogLike);

// Multer storage configuration
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/blogs');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `blog-${req.user.id}-${Date.now()}.${ext}`);
  },
});

// Multer filter configuration
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

// Multer upload configuration
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

router.route('/top-5-popular').get(aliasTopBlogs, getAllBlogs);

router.route('/blog-stats').get(getBlogStats);

router
  .route('/')
  .get(getAllBlogs)
  .post(
    protect,
    restrictTo('admin', 'author'),
    upload.single('imageCover'),
    createBlog
  );

router
  .route('/:id')
  .get(getBlog)
  .patch(
    protect,
    restrictTo('admin', 'author'),
    upload.single('imageCover'),
    updateBlog
  )
  .delete(protect, restrictTo('admin', 'author'), deleteBlog);

export default router;
