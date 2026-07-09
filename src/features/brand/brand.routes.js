import { Router } from 'express';
import { getBrands, createBrand, deleteBrand } from './brand.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';
import { upload } from '../../middleware/upload.middleware.js';

const router = Router();

// All brand routes require authentication
router.use(protect);

router.route('/')
  .get(getBrands)
  .post(authorize('admin'), upload.single('logo'), createBrand);

router.route('/:id')
  .delete(authorize('admin'), deleteBrand);

export default router;
