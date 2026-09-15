import { Router } from 'express';
import { register, login, getMe, updateProfile, logout, adminLogin, getUsers } from './auth.controller.js';
import { validate } from '../../middleware/validation.middleware.js';
import { registerSchema, loginSchema, updateProfileSchema } from './auth.validation.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';

import { seedAdmin } from './auth.seed.js';

const router = Router();

// Public routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/admin/login', validate(loginSchema), adminLogin);
router.all('/seed-admin', async (req, res) => {
  await seedAdmin();
  res.status(200).json({ success: true, message: 'Admin seeded: admin@wattcharge.com / admin1234' });
});

// Protected routes
router.get('/me', protect, getMe);
router.get('/users', protect, authorize('admin'), getUsers);
router.put('/profile', protect, validate(updateProfileSchema), updateProfile);
router.post('/logout', protect, logout);

export default router;
