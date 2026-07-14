import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables from root of Backend
dotenv.config({ path: path.join(__dirname, '../../.env') });

const requiredEnv = ['MONGODB_URI', 'JWT_SECRET'];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`\x1b[31mError: Missing required environment variable: ${key}\x1b[0m`);
    process.exit(1);
  }
}

export const env = {
  port: parseInt(process.env.PORT || '5001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI,
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE || '24h',
  },
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: parseInt(process.env.SMTP_PORT || '2525', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'noreply@wattcharge.com',
  },
  paymob: {
    apiKey: process.env.PAYMOB_API_KEY,
    secretKey: process.env.PAYMOB_SECRET_KEY,
    integrationId: process.env.PAYMOB_INTEGRATION_ID,
    iframeId: process.env.PAYMOB_IFRAME_ID,
  }
};
