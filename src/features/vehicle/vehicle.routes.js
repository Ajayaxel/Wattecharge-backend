import { Router } from 'express';
import { 
  getVehicles, 
  getVehicleById, 
  createVehicle, 
  updateVehicle, 
  deleteVehicle,
  getBrands
} from './vehicle.controller.js';
import { validate } from '../../middleware/validation.middleware.js';
import { createLocationSchema } from '../location/location.validation.js'; // Just in case, but we import vehicle schemas
import { createVehicleSchema, updateVehicleSchema } from './vehicle.validation.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';
import { upload } from '../../middleware/upload.middleware.js';

const router = Router();

// All vehicle routes require authentication
router.use(protect);

router.route('/')
  .get(getVehicles)
  .post(authorize('admin'), upload.single('image'), validate(createVehicleSchema), createVehicle);

router.route('/brands')
  .get(getBrands);

router.route('/:id')
  .get(getVehicleById)
  .put(authorize('admin'), upload.single('image'), validate(updateVehicleSchema), updateVehicle)
  .delete(authorize('admin'), deleteVehicle);

export default router;
