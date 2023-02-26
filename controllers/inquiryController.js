import Inquiry from '../models/inquiryModels.js';
import catchAsync from '../utils/catchAsync.js';

// Create a new inquiry
export const createInquiry = catchAsync(async (req, res, next) => {
  const inquiry = await Inquiry.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      inquiry,
    },
  });
});

// Get all inquiries
export const getAllInquiries = catchAsync(async (req, res, next) => {
  const inquiries = await Inquiry.find();

  res.status(200).json({
    status: 'success',
    results: inquiries.length,
    data: {
      inquiries,
    },
  });
});

// Get a single inquiry by ID
export const getInquiry = catchAsync(async (req, res, next) => {
  const inquiry = await Inquiry.findById(req.params.id);

  if (!inquiry) {
    return res.status(404).json({
      status: 'fail',
      message: 'Inquiry not found',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      inquiry,
    },
  });
});

// Update an inquiry by ID
export const updateInquiry = catchAsync(async (req, res, next) => {
  const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!inquiry) {
    return res.status(404).json({
      status: 'fail',
      message: 'Inquiry not found',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      inquiry,
    },
  });
});

// Delete an inquiry by ID
export const deleteInquiry = catchAsync(async (req, res, next) => {
  const inquiry = await Inquiry.findByIdAndDelete(req.params.id);

  if (!inquiry) {
    return res.status(404).json({
      status: 'fail',
      message: 'Inquiry not found',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
