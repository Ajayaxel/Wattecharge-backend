import { Router } from 'express';
import authRoutes from '../features/auth/auth.routes.js';
import locationRoutes from '../features/location/location.routes.js';
import vehicleRoutes from '../features/vehicle/vehicle.routes.js';
import brandRoutes from '../features/brand/brand.routes.js';
import categoryRoutes from '../features/category/category.routes.js';
import userVehicleRoutes from '../features/userVehicle/userVehicle.routes.js';
import serviceRoutes from '../features/service/service.routes.js';
import bookingRoutes from '../features/booking/booking.routes.js';
import productRoutes from '../features/product/product.routes.js';
import productCategoryRoutes from '../features/product/productCategory.routes.js';
import orderRoutes from '../features/order/order.routes.js';
import walletRoutes from '../features/wallet/wallet.routes.js';
import paymentRoutes from '../features/payment/payment.routes.js';

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
router.use('/products', productRoutes);
router.use('/product-categories', productCategoryRoutes);
router.use('/orders', orderRoutes);
router.use('/wallet', walletRoutes);
router.use('/payments', paymentRoutes);

export default router;
