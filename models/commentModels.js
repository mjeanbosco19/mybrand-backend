import Joi from 'joi';
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'A comment must have a text'],
      trim: true,
      minlength: [5, 'A comment must have more or equal then 5 characters'],
      maxlength: [
        1000,
        'A comment must have less or equal then 1000 characters',
      ],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    blog: {
      type: mongoose.Schema.ObjectId,
      ref: 'Blog',
      required: [true, 'A comment must belong to a blog'],
    },
    name: {
      type: String,
      required: [true, 'A comment must have a name'],
      trim: true,
      minlength: [
        4,
        'A comment name must have more or equal then 4 characters',
      ],
      maxlength: [
        125,
        'A comment name must have less or equal then 125 characters',
      ],
    },
    email: {
      type: String,
      required: [true, 'A comment must have an email'],
      trim: true,
      lowercase: true,
      validate: {
        validator: (value) =>
          Joi.string().email().validate(value).error === null,
        message: 'Please provide a valid email address for the comment',
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
