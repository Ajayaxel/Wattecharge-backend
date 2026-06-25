import { Server } from 'socket.io';
import { logger } from '../utils/logger.js';

class SocketService {
  constructor() {
    this.io = null;
    // Maps userId -> Set of socketId strings (for users logged in on multiple clients)
    this.userSockets = new Map();
  }

  /**
   * Initializes the Socket.io server.
   * @param {Object} server - HTTP Server Instance
   */
  init(server) {
    this.io = new Server(server, {
      cors: {
        origin: '*', // Allow all origins for dev. Tighten in production.
        methods: ['GET', 'POST'],
      },
    });

    logger.info('Socket.io server initialized');

    this.io.on('connection', (socket) => {
      logger.info(`Socket client connected: ${socket.id}`);

      // Handle authenticating or identifying user connection
      socket.on('register_user', (userId) => {
        if (userId) {
          if (!this.userSockets.has(userId)) {
            this.userSockets.set(userId, new Set());
          }
          this.userSockets.get(userId).add(socket.id);
          socket.userId = userId;
          logger.info(`Socket registered: User ${userId} <-> Connection ${socket.id}`);
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        logger.info(`Socket client disconnected: ${socket.id}`);
        if (socket.userId && this.userSockets.has(socket.userId)) {
          const userConns = this.userSockets.get(socket.userId);
          userConns.delete(socket.id);
          if (userConns.size === 0) {
            this.userSockets.delete(socket.userId);
          }
          logger.info(`Socket unregistered: User ${socket.userId} <-> Connection ${socket.id}`);
        }
      });
    });
  }

  /**
   * Sends an event to all active sockets of a specific user.
   * @param {String} userId 
   * @param {String} event 
   * @param {Object} data 
   * @returns {Boolean}
   */
  sendToUser(userId, event, data) {
    if (this.io && this.userSockets.has(userId)) {
      const userConns = this.userSockets.get(userId);
      userConns.forEach((socketId) => {
        this.io.to(socketId).emit(event, data);
      });
      return true;
    }
    return false;
  }

  /**
   * Sends an event to all connected sockets.
   * @param {String} event 
   * @param {Object} data 
   * @returns {Boolean}
   */
  sendToAll(event, data) {
    if (this.io) {
      this.io.emit(event, data);
      return true;
    }
    return false;
  }
}

export const socketService = new SocketService();
