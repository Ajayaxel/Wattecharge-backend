import { Router } from 'express';
import { protect, authorize } from '../../middleware/auth.middleware.js';
import { upload } from '../../middleware/upload.middleware.js';
import {
  parseLicensePdf,
  parseVehiclePdf,
  verifyFaceRecognition,
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
  applyCompanyCode,
  getCompanyMembers,
  inviteCompanyMember,
  getCompanyVehicles,
  addCompanyVehicles,
  deleteCompanyVehicle
} from './company.controller.js';

const router = Router();

// --- User Routes ---
// Apply a company code (authenticated users)
router.post('/apply-code', protect, applyCompanyCode);

// --- Onboarding Helpers ---
router.post('/parse-license-pdf', protect, authorize('admin', 'fleet_admin'), upload.single('file'), parseLicensePdf);
router.post('/parse-vehicle-pdf', protect, authorize('admin', 'fleet_admin'), upload.single('file'), parseVehiclePdf);
router.post('/verify-face', protect, authorize('admin', 'fleet_admin'), verifyFaceRecognition);

// --- Admin & Fleet Admin Routes ---
// Companies
router.route('/')
  .post(
    protect,
    authorize('admin'),
    upload.fields([
      { name: 'licensePdf', maxCount: 1 },
      { name: 'agreementPdf', maxCount: 1 },
    ]),
    createCompany
  )
  .get(protect, authorize('admin'), getAllCompanies);

router.route('/:id')
  .get(protect, authorize('admin', 'fleet_admin'), getCompanyById)
  .put(protect, authorize('admin', 'fleet_admin'), updateCompany)
  .delete(protect, authorize('admin'), deleteCompany);

// Fleet Vehicles CRUD Routes
router.route('/:id/vehicles')
  .get(protect, authorize('admin', 'fleet_admin'), getCompanyVehicles)
  .post(protect, authorize('admin', 'fleet_admin'), addCompanyVehicles);

router.route('/:id/vehicles/:vehicleId')
  .delete(protect, authorize('admin', 'fleet_admin'), deleteCompanyVehicle);

// Fleet Specific Members
router.route('/:id/members')
  .get(protect, authorize('admin', 'fleet_admin'), getCompanyMembers);

router.route('/:id/invite')
  .post(protect, authorize('admin', 'fleet_admin'), inviteCompanyMember);

// Company Codes
router.route('/codes/manage')
  .post(protect, authorize('admin', 'fleet_admin'), createCompanyCode)
  .get(protect, authorize('admin', 'fleet_admin'), getAllCompanyCodes);

router.route('/codes/manage/:id')
  .get(protect, authorize('admin', 'fleet_admin'), getCompanyCodeById)
  .put(protect, authorize('admin', 'fleet_admin'), updateCompanyCode)
  .delete(protect, authorize('admin', 'fleet_admin'), deleteCompanyCode);

export default router;
