import { Router } from 'express';
import { protect, authorize } from '../../middleware/auth.middleware.js';
import {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  createCompanyCode,
  getAllCompanyCodes,
  getCompanyCodeById,
  updateCompanyCode,
  deleteCompanyCode,
  applyCompanyCode
} from './company.controller.js';

const router = Router();

// --- User Routes ---
// Apply a company code (authenticated users)
router.post('/apply-code', protect, applyCompanyCode);

// --- Admin Routes ---
// Companies
router.route('/')
  .post(protect, authorize('admin'), createCompany)
  .get(protect, authorize('admin'), getAllCompanies);

router.route('/:id')
  .get(protect, authorize('admin'), getCompanyById)
  .put(protect, authorize('admin'), updateCompany)
  .delete(protect, authorize('admin'), deleteCompany);

// Company Codes
router.route('/codes/manage')
  .post(protect, authorize('admin'), createCompanyCode)
  .get(protect, authorize('admin'), getAllCompanyCodes);

router.route('/codes/manage/:id')
  .get(protect, authorize('admin'), getCompanyCodeById)
  .put(protect, authorize('admin'), updateCompanyCode)
  .delete(protect, authorize('admin'), deleteCompanyCode);

export default router;
