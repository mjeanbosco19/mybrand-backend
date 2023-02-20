import User from '../models/userModels.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { deleteOne, updateOne, createOne, getAll } from './handlerFactory.js';
import { promisify } from 'util';

import { cloudinaryConfig } from '../config/cloudinaryConfig.js';

import { pipeline as pipelineCallback } from 'stream';

const pipeline = promisify(pipelineCallback);

export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

export const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const uploadUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please upload a file', 400));
  }

  const result = await cloudinaryConfig.uploader.upload(req.file.path, {
    folder: 'users',
    public_id: `${req.user.id}-photo`,
    overwrite: true,
  });

  await User.findByIdAndUpdate(req.user.id, { photo: result.secure_url });

  res.status(200).json({
    status: 'success',
    data: {
      photo: result.secure_url,
    },
  });
});

export const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await pipeline(
    req.file.stream,
    sharp().resize(500, 500).toFormat('jpeg').jpeg({ quality: 90 }),
    fs.createWriteStream(`public/img/users/${req.file.filename}`)
  );

  next();
});

export const updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) {
    filteredBody.photo = req.file.filename;
  }

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const getAllUsers = getAll(User);

export const createUser = createOne(User);

export const updateUser = updateOne(User);

export const deleteUser = deleteOne(User);
