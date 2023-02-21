import Comment from '../models/commentModels.js';
import Blog from '../models/blogModels.js';
import catchAsync from '../utils/catchAsync.js';

// Get all comments for a blog
export const getAllComments = catchAsync(async (req, res, next) => {
  const comments = await Comment.find({ blog: req.params.blogId });

  res.status(200).json({
    status: 'success',
    results: comments.length,
    data: {
      comments,
    },
  });
});

// Add a new comment to a blog
export const createComment = catchAsync(async (req, res, next) => {
  // Get the blog associated with this comment
  const blog = await Blog.findById(req.params.blogId);

  // If the blog doesn't exist, return an error
  if (!blog) {
    return res.status(404).json({
      status: 'fail',
      message: 'No blog found with that ID',
    });
  }

  // Create a new comment and save it to the database
  const comment = await Comment.create({
    text: req.body.text,
    blog: req.params.blogId,
    user: req.user._id,
  });

  res.status(201).json({
    status: 'success',
    data: {
      comment,
    },
  });
});

// Update an existing comment
export const updateComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    return res.status(404).json({
      status: 'fail',
      message: 'No comment found with that ID',
    });
  }

  if (comment.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      status: 'fail',
      message: 'You are not authorized to perform this action',
    });
  }

  comment.text = req.body.text;
  await comment.save();

  res.status(200).json({
    status: 'success',
    data: {
      comment,
    },
  });
});

// Delete a comment
export const deleteComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    return res.status(404).json({
      status: 'fail',
      message: 'No comment found with that ID',
    });
  }

  if (comment.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      status: 'fail',
      message: 'You are not authorized to perform this action',
    });
  }

  await comment.remove();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
