import { Router } from 'express';
import { getLocations, createLocation, updateLocation, deleteLocation } from './location.controller.js';
import { validate } from '../../middleware/validation.middleware.js';
import { createLocationSchema, updateLocationSchema } from './location.validation.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = Router();

// All location routes are protected by authentication
router.use(protect);

router.route('/')
  .get(getLocations)
  .post(validate(createLocationSchema), createLocation);

router.route('/:id')
  .put(validate(updateLocationSchema), updateLocation)
  .delete(deleteLocation);

export default router;
