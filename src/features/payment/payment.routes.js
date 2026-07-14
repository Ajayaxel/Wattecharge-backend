import { Router } from 'express';
import { initiatePayment, paymobWebhook } from './payment.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = Router();

// Endpoint for the app to initialize payment
router.post('/initiate', protect, initiatePayment);

// Webhook endpoint for Paymob to notify backend
router.post('/webhook', paymobWebhook);
router.get('/webhook', paymobWebhook); // Paymob sometimes sends GET for testing

export default router;
