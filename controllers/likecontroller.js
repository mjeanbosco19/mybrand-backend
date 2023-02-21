import Like from '../models/likeModel.js';
import Blog from '../models/blogModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const createLike = catchAsync(async (req, res, next) => {
  const { blogId } = req.params;
  const { user } = req;

  // Check if the blog exists
  const blog = await Blog.findById(blogId);
  if (!blog) {
    return next(new AppError('Blog not found', 404));
  }

  // Check if user has already liked the blog
  const existingLike = await Like.findOne({ user: user._id, blog: blogId });
  if (existingLike) {
    return next(new AppError('You have already liked this blog', 400));
  }

  // Create the new like
  const newLike = await Like.create({ user: user._id, blog: blogId });

  res.status(201).json({
    status: 'success',
    data: {
      like: newLike,
    },
  });
});

export const deleteLike = catchAsync(async (req, res, next) => {
  const { blogId } = req.params;
  const { user } = req;

  // Check if the blog exists
  const blog = await Blog.findById(blogId);
  if (!blog) {
    return next(new AppError('Blog not found', 404));
  }

  // Check if user has already liked the blog
  const existingLike = await Like.findOne({ user: user._id, blog: blogId });
  if (!existingLike) {
    return next(new AppError('You have not liked this blog', 400));
  }

  // Delete the existing like
  await existingLike.delete();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
