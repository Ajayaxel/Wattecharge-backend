import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
} from './booking.controller.js';

const router = Router();

// Client-facing endpoints (requires user login session protect middleware)
router.post('/', protect, createBooking);
router.get('/', protect, getMyBookings);

// Admin-facing endpoints (Admin dashboard queries)
router.get('/admin', getAllBookings);
router.patch('/admin/:id', updateBookingStatus);

export default router;
