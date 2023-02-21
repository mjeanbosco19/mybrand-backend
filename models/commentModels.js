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
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A comment must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

commentSchema.index({ blog: 1, user: 1 });

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
