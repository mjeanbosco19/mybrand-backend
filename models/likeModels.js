import { Schema, model } from 'mongoose';

const likeSchema = new Schema(
  {
    blog: {
      type: Schema.ObjectId,
      ref: 'Blog',
      required: [true, 'A like must belong to a blog'],
    },
    user: {
      type: Schema.ObjectId,
      ref: 'User',
      required: [true, 'A like must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index the `blog` and `user` fields to ensure that each combination of `blog` and `user`
// is unique, i.e. each user can only like a blog once
likeSchema.index({ blog: 1, user: 1 }, { unique: true });

// Virtual populate the `Blog` model with the likes that belong to it
likeSchema.virtual('blogs', {
  ref: 'Blog',
  foreignField: '_id',
  localField: 'blog',
});

const Like = model('Like', likeSchema);

export default Like;
