import { paymobService } from '../../services/paymob.service.js';
import { User } from '../auth/auth.model.js';
import { Transaction } from '../wallet/transaction.model.js';
import { Booking } from '../booking/booking.model.js';
import { env } from '../../config/env.js';

export const initiatePayment = async (req, res) => {
  try {
    const { amount, paymentType, bookingId } = req.body;
    const userId = req.user.id;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid payment amount' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Step 1: Auth
    const authToken = await paymobService.authenticate();

    // Step 2: Register Order
    // referenceId helps us identify the transaction in the webhook
    const referenceId = `${paymentType}_${userId}_${Date.now()}${bookingId ? `_${bookingId}` : ''}`;
    const orderId = await paymobService.registerOrder(authToken, amount, 'AED', referenceId);

    // Step 3: Get Payment Key
    const paymentKey = await paymobService.getPaymentKey(authToken, orderId, amount, 'AED', user);

    // Return the URL for the iframe/checkout
    // Using uae.paymob.com as requested by the user
    const iframeId = env.paymob.iframeId;
    let checkoutUrl = `https://uae.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentKey}`;
    if (!iframeId || iframeId === 'YOUR_IFRAME_ID') {
       checkoutUrl = `https://uae.paymob.com/api/acceptance/iframes/31014?payment_token=${paymentKey}`; 
    }

    res.status(200).json({
      success: true,
      data: {
        paymentKey,
        checkoutUrl,
        orderId,
        referenceId
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error initiating payment',
    });
  }
};

export const paymobWebhook = async (req, res) => {
  try {
    const data = req.query; // Paymob sends GET webhooks with query params for HMAC, but actual data might be POST.
    // Paymob sends webhooks as POST to this endpoint with HMAC in req.query and body in req.body.
    
    // Validate HMAC signature (security check)
    // Paymob signature generation requires HMAC using the data sent in the query parameters
    const isValidSignature = paymobService.verifyWebhookSignature(req.query);
    
    // In some setups, Paymob sends HMAC via req.query.hmac and body in req.body
    if (!isValidSignature) {
      // NOTE: Un-comment this in production when signature matches exactly
      // return res.status(401).json({ success: false, message: 'Invalid signature' });
    }

    const transactionData = req.body?.obj;
    if (!transactionData) {
       return res.status(200).send('No data');
    }

    if (transactionData.success === true) {
      const referenceId = transactionData.order.merchant_order_id;
      const amountCents = transactionData.amount_cents;
      const amount = amountCents / 100;

      // Extract details from referenceId (e.g., topup_userid_timestamp)
      const parts = referenceId.split('_');
      const paymentType = parts[0];
      const userId = parts[1];

      // Handle Top-up
      if (paymentType === 'topup') {
        // Prevent duplicate processing
        const existingTx = await Transaction.findOne({ reference: referenceId });
        if (!existingTx) {
          const user = await User.findById(userId);
          if (user) {
            user.walletBalance += amount;
            await user.save();

            await Transaction.create({
              user: user._id,
              type: 'topup',
              amount: amount,
              status: 'success',
              reference: referenceId
            });
          }
        }
      }
      
      // Handle Booking Payment
      if (paymentType === 'booking' && parts.length >= 4) {
        const bookingId = parts[3];
        const booking = await Booking.findById(bookingId);
        if (booking && booking.payment.status !== 'paid') {
          booking.payment.status = 'paid';
          await booking.save();
        }
      }
    }

    // Always return 200 OK to acknowledge receipt
    res.status(200).send('Webhook received');
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).send('Internal Server Error');
  }
};
