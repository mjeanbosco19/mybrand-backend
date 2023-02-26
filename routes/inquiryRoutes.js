import express from 'express';
import {
  getAllInquiries,
  createInquiry,
  getInquiry,
  updateInquiry,
  deleteInquiry,
} from '../controllers/inquiryController.js';

const router = express.Router();

router.route('/').get(getAllInquiries).post(createInquiry);

router.route('/:id').get(getInquiry).patch(updateInquiry).delete(deleteInquiry);

export default router;
