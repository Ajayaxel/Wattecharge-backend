import { Router } from 'express';
import authRoutes from '../features/auth/auth.routes.js';
import locationRoutes from '../features/location/location.routes.js';
import vehicleRoutes from '../features/vehicle/vehicle.routes.js';
import brandRoutes from '../features/brand/brand.routes.js';
import categoryRoutes from '../features/category/category.routes.js';
import userVehicleRoutes from '../features/userVehicle/userVehicle.routes.js';
import serviceRoutes from '../features/service/service.routes.js';
import bookingRoutes from '../features/booking/booking.routes.js';

const router = Router();

// Register feature routes
router.use('/auth', authRoutes);
router.use('/locations', locationRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/brands', brandRoutes);
router.use('/categories', categoryRoutes);
router.use('/user-vehicles', userVehicleRoutes);
router.use('/services', serviceRoutes);
router.use('/bookings', bookingRoutes);

export default router;
