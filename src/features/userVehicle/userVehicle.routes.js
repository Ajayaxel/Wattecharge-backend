import { Router } from 'express';
import { getMyVehicles, registerUserVehicle } from './userVehicle.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = Router();

// Require login for all garage operations
router.use(protect);

router.route('/')
  .get(getMyVehicles)
  .post(registerUserVehicle);

export default router;
