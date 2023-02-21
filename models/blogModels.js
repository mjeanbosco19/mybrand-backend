import { Schema, model } from 'mongoose';
import slugify from 'slugify';

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'A blog must have a title'],
      unique: true,
      trim: true,
      maxlength: [
        40,
        'A blog title must have less or equal then 40 characters',
      ],
      minlength: [
        10,
        'A blog title must have more or equal then 10 characters',
      ],
    },

    category: {
      type: String,
      required: [true, 'A blog must have a category'],
      enum: {
        values: ['News', 'Tech', 'Others'],
        message: 'category is either: News, Tech, Others',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A blog must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A blog must have a cover image'],
    },
    likes: {
      type: Number,
      default: 0,
    },
    authors: [
      {
        type: Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

blogSchema.index({ likes: -1 });
blogSchema.index({ slug: 1 });

// Virtual populate
blogSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'blog',
  localField: '_id',
});

blogSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

blogSchema.pre(/^find/, function (next) {
  this.find({ secretBlog: { $ne: true } });

  this.start = Date.now();
  next();
});

blogSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'authors',
    select: '-__v -passwordChangedAt',
  });

  next();
});

const Blog = model('Blog', blogSchema);

export default Blog;
