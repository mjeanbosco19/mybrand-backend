import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'An inquiry must have a name'],
      trim: true,
      minlength: [2, 'A name must have more or equal then 2 characters'],
      maxlength: [50, 'A name must have less or equal then 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'An inquiry must have an email'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address for the inquiry',
      ],
    },
    message: {
      type: String,
      required: [true, 'An inquiry must have a message'],
      trim: true,
      minlength: [10, 'A message must have more or equal then 10 characters'],
      maxlength: [
        1000,
        'A message must have less or equal then 1000 characters',
      ],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Inquiry = mongoose.model('Inquiry', inquirySchema);

export default Inquiry;
