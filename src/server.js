import http from 'http';
import app from './app.js';
import { connectDB } from './config/db.js';
import { seedVehicles } from './features/vehicle/vehicle.seed.js';
import { seedBrands } from './features/brand/brand.seed.js';
import { seedCategories } from './features/category/category.seed.js';
import { seedServices } from './features/service/service.seed.js';
import { socketService } from './services/socket.service.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

/**
 * Boots the database, initializes the socket service, and launches the HTTP listener.
 */
const startServer = async () => {
  // Connect to database
  await connectDB();

  // Bootstrapping initial vehicle list if required
  await seedVehicles();
  await seedBrands();
  await seedCategories();
  await seedServices();

  // Create Node HTTP Server wrapping the express application
  const server = http.createServer(app);

  // Attach socket.io handlers
  socketService.init(server);

  const port = env.port;
  server.listen(port, () => {
    logger.info(`Server listening in ${env.nodeEnv} mode on port ${port}`);
  });

  // Graceful termination handling
  const handleGracefulShutdown = (signal) => {
    logger.warn(`Received signal: ${signal}. Commencing server shutdown sequence.`);
    
    server.close(() => {
      logger.info('HTTP server terminated cleanly.');
      process.exit(0);
    });

    // Enforce hard-kill after 10 seconds of hanging connections
    setTimeout(() => {
      logger.error('Graceful shutdown timeout exceeded. Forcefully killing process.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
};

startServer().catch((error) => {
  logger.error(`Failed to start server: ${error.message}`);
  process.exit(1);
});
