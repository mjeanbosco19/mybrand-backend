import Blog from '../models/blogModels.js';
// import APIFeatures from '../utils/apiFeatures.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

/**
 * Create a blog
 */
export const createBlog = catchAsync(async (req, res, next) => {
  const newBlog = await Blog.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      blog: newBlog,
    },
  });
});

/**
 * Get all blogs
 */
export const getAllBlogs = catchAsync(async (req, res, next) => {
  const blogs = await Blog.find();

  res.status(200).json({
    status: 'success',
    results: blogs.length,
    data: {
      blogs,
    },
  });
});

/**
 * Get a blog by ID
 */
export const getBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id).populate('comments likes');

  if (!blog) {
    return next(new AppError('Blog not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      blog,
    },
  });
});

/**
 * Update a blog
 */
export const updateBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!blog) {
    return next(new AppError('Blog not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      blog,
    },
  });
});

/**
 * Delete a blog
 */
export const deleteBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);

  if (!blog) {
    return next(new AppError('Blog not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

/**
 * Get blog statistics
 */
export const getBlogStats = catchAsync(async (req, res, next) => {
  const stats = await Blog.aggregate([
    {
      $match: { secretBlog: { $ne: true } },
    },
    {
      $group: {
        _id: { $toUpper: '$category' },
        numBlogs: { $sum: 1 },
        avgLikes: { $avg: '$likes' },
        avgComments: { $avg: { $size: '$comments' } },
      },
    },
    {
      $sort: { numBlogs: -1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

/**
 * Get top 5 most popular blogs
 */
export const aliasTopBlogs = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-likes,createdAt';
  req.query.fields = 'title,category,likes,createdAt';
  next();
};
