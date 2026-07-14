import crypto from 'crypto';
import { env } from '../config/env.js';
import { APIError } from '../utils/response.js';

const PAYMOB_API_URL = 'https://uae.paymob.com/api';

/**
 * Service to handle Paymob API interactions.
 */
class PaymobService {
  /**
   * Step 1: Authentication Request
   */
  async authenticate() {
    try {
      const response = await fetch(`${PAYMOB_API_URL}/auth/tokens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: env.paymob.apiKey })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Paymob authentication failed');
      }

      return data.token;
    } catch (error) {
      throw new APIError(`Paymob Auth Error: ${error.message}`, 500);
    }
  }

  /**
   * Step 2: Order Registration Request
   */
  async registerOrder(authToken, amount, currency = 'AED', referenceId) {
    try {
      const response = await fetch(`${PAYMOB_API_URL}/ecommerce/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auth_token: authToken,
          delivery_needed: 'false',
          amount_cents: Math.round(amount * 100).toString(),
          currency: currency,
          merchant_order_id: referenceId, // unique reference ID
          items: []
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Paymob order registration failed');
      }

      return data.id; // order_id
    } catch (error) {
      throw new APIError(`Paymob Order Error: ${error.message}`, 500);
    }
  }

  /**
   * Step 3: Payment Key Request
   */
  async getPaymentKey(authToken, orderId, amount, currency = 'AED', user) {
    try {
      if (!env.paymob.integrationId || env.paymob.integrationId === 'YOUR_INTEGRATION_ID') {
        throw new Error('Paymob Integration ID is missing in environment variables.');
      }

      const response = await fetch(`${PAYMOB_API_URL}/acceptance/payment_keys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auth_token: authToken,
          amount_cents: Math.round(amount * 100).toString(),
          expiration: 3600,
          order_id: orderId,
          billing_data: {
            apartment: 'NA',
            email: user.email || 'customer@wattcharge.com',
            floor: 'NA',
            first_name: user.name ? user.name.split(' ')[0] : 'Customer',
            street: 'NA',
            building: 'NA',
            phone_number: user.phone || '+971500000000',
            shipping_method: 'NA',
            postal_code: 'NA',
            city: 'Dubai',
            country: 'AE',
            last_name: user.name && user.name.split(' ').length > 1 ? user.name.split(' ')[1] : 'Wattcharge',
            state: 'NA'
          },
          currency: currency,
          integration_id: env.paymob.integrationId
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Paymob payment key generation failed');
      }

      return data.token;
    } catch (error) {
      throw new APIError(`Paymob Payment Key Error: ${error.message}`, 500);
    }
  }

  /**
   * Utility to verify HMAC signature from webhook
   */
  verifyWebhookSignature(queryObj) {
    const { hmac, ...rest } = queryObj;
    
    // Sort keys alphabetically as per Paymob documentation
    const keys = [
      'amount_cents',
      'created_at',
      'currency',
      'error_occured',
      'has_parent_transaction',
      'id',
      'integration_id',
      'is_3d_secure',
      'is_auth',
      'is_capture',
      'is_refunded',
      'is_standalone_payment',
      'is_voided',
      'order',
      'owner',
      'pending',
      'source_data.pan',
      'source_data.sub_type',
      'source_data.type',
      'success'
    ];
    
    let concatenatedString = '';
    
    for (const key of keys) {
      if (key === 'order') {
        concatenatedString += rest['obj.order.id'] || '';
      } else if (key.startsWith('source_data.')) {
        const subKey = key.split('.')[1];
        concatenatedString += rest[`obj.source_data.${subKey}`] || '';
      } else {
        concatenatedString += rest[`obj.${key}`] || '';
      }
    }
    
    const secureHash = crypto
      .createHmac('sha512', env.paymob.secretKey)
      .update(concatenatedString)
      .digest('hex');

    return secureHash === hmac;
  }
}

export const paymobService = new PaymobService();
