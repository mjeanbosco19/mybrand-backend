import { Router } from 'express';
import multer from 'multer';
import upload from '../config/cloudinaryConfig.js';
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
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/blogs');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `blog-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

// // Multer filter configuration
// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image')) {
//     cb(null, true);
//   } else {
//     cb(new Error('Not an image! Please upload only images.'), false);
//   }
// };

// // Multer upload configuration
// const upload = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter,
// });

router.route('/top-5-popular').get(aliasTopBlogs, getAllBlogs);

router.route('/blog-stats').get(getBlogStats);

/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Blogs API
 * /api/v1/blogs:
 *   get:
 *     summary: Get all blogs
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Blog Retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 * */

/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Blogs API
 * /api/v1/blogs:
 *   post:
 *     summary: Create a new blog
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Blog object to be created
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the blog
 *               content:
 *                 type: string
 *                 description: Content of the blog
 *               author:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Name of the author
 *                   email:
 *                     type: string
 *                     description: Email of the author
 *     responses:
 *       201:
 *         description: Blog created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID of the newly created blog
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 * */

/**
 * @swagger
 * securityDefinitions:
 *   bearerAuth:
 *     type: apiKey
 *     name: Authorization
 *     in: header
 */

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
