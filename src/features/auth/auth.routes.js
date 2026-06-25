import { Router } from 'express';
import { register, login, getMe, updateProfile, logout, adminLogin, getUsers } from './auth.controller.js';
import { validate } from '../../middleware/validation.middleware.js';
import { registerSchema, loginSchema, updateProfileSchema } from './auth.validation.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/admin/login', validate(loginSchema), adminLogin);

// Protected routes
router.get('/me', protect, getMe);
router.get('/users', protect, authorize('admin'), getUsers);
router.put('/profile', protect, validate(updateProfileSchema), updateProfile);
router.post('/logout', protect, logout);

export default router;
