import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { env } from './config/env.js';
import { errorHandler } from './middleware/error.middleware.js';
import { APIError } from './utils/response.js';
import apiRoutes from './routes/index.js';

const app = express();

// Secure app by setting various HTTP headers
app.use(helmet());

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Log HTTP requests in development mode
if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Parse incoming request bodies (JSON and URL-encoded)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static route to serve uploaded assets
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Mount API routes under standard prefix
app.use('/api/v1', apiRoutes);

// Root route welcome and health check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Wattcharge Backend API.',
    timestamp: new Date().toISOString()
  });
});

// Fallback for unhandled routes
app.use('*', (req, res, next) => {
  next(new APIError(`Resource route not found: ${req.originalUrl}`, 404));
});

// Centralized error response generator
app.use(errorHandler);

export default app;
