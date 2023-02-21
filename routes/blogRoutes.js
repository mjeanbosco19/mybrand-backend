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
} from '../controllers/blogController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import commentRouter from './commentRoutes.js';

const router = Router();

// Routes for comments
router.use('/:blogId/comments', commentRouter);

// Routes for likes
// router.route('/:id/like').post(protect, addBlogLike);
// router.route('/:id/like').delete(protect, removeBlogLike);

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

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication endpoints
 * securityDefinitions:
 *   bearerAuth:
 *     type: apiKey
 *     name: Authorization
 *     in: header
 * /api/v1/users/signup:
 *   post:
 *     summary: Create a new user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               passwordConfirm:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: User account created successfully
 *       400:
 *         description: Invalid request body or user already exists
 *
 * /api/v1/users/login:
 *   post:
 *     summary: Authenticate user and get access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: User authenticated and access token generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Invalid email or password
 *
 * /api/v1/users/logout:
 *   get:
 *     summary: Logout user and revoke access token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out and access token revoked
 *
 * /api/v1/forgotPassword:
 *   post:
 *     summary: Request a password reset for a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *       404:
 *         description: User not found
 *
 * /api/v1/users/resetPassword/{token}:
 *   patch:
 *     summary: Reset a user's password
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: The password reset token sent to the user's email
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid token or request body
 *       404:
 *         description: User not found
 * */

router
  .route('/')
  .get(getAllBlogs)
  .post(
    protect,
    restrictTo('admin', 'author'),
    upload.single('imageCover'),
    createBlog
  );

/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Blogs API
 * /api/v1/blogs/{id}:
 *   get:
 *     summary: Get a single blog by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the blog to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 author:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Internal server error
 * */
/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Blogs API
 * /api/v1/blogs/{id}:
 *   patch:
 *     summary: Update a blog by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the blog to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Fields to update in the blog
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: New title for the blog
 *               content:
 *                 type: string
 *                 description: New content for the blog
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID of the updated blog
 *                 title:
 *                   type: string
 *                   description: New title of the blog
 *                 content:
 *                   type: string
 *                   description: New content of the blog
 *                 author:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: Name of the author
 *                     email:
 *                       type: string
 *                       description: Email of the author
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Internal server error
 * */
/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Blogs API
 * /api/v1/blogs/{id}:
 *   delete:
 *     summary: Delete a blog by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the blog to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Blog deleted successfully
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Internal server error
 * */

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
