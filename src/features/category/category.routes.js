import { Router } from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from './category.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';

const router = Router();

// All category routes require authentication
router.use(protect);

router.route('/')
  .get(getCategories)
  .post(authorize('admin'), createCategory);

router.route('/:id')
  .put(authorize('admin'), updateCategory)
  .delete(authorize('admin'), deleteCategory);

export default router;
