import { Router } from 'express';
import authRoutes from '../features/auth/auth.routes.js';
import locationRoutes from '../features/location/location.routes.js';
import vehicleRoutes from '../features/vehicle/vehicle.routes.js';

const router = Router();

// Register feature routes
router.use('/auth', authRoutes);
router.use('/locations', locationRoutes);
router.use('/vehicles', vehicleRoutes);

export default router;
