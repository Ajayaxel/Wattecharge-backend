import express from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import { getBalance, topupWallet, getTransactions } from './wallet.controller.js';

const router = express.Router();

router.use(protect); // All wallet routes require authentication

router.get('/balance', getBalance);
router.post('/topup', topupWallet);
router.get('/transactions', getTransactions);

export default router;
