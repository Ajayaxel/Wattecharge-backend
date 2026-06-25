import { socketService } from './socket.service.js';
import { logger } from '../utils/logger.js';

class NotificationService {
  /**
   * Dispatches a notification to a specific user.
   * @param {String} userId 
   * @param {String} title 
   * @param {String} body 
   * @param {Object} data 
   * @returns {Promise<Object>}
   */
  async sendNotification(userId, title, body, data = {}) {
    logger.info(`Notification to user ${userId}: [${title}] ${body}`);

    // Standard notification structure
    const notification = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      body,
      data,
      read: false,
      createdAt: new Date(),
    };

    // Attempt to push real-time socket updates
    const isSocketDelivered = socketService.sendToUser(userId, 'notification', notification);
    if (isSocketDelivered) {
      logger.info(`Realtime notification sent to active socket connections for user: ${userId}`);
    } else {
      logger.info(`User ${userId} is currently offline. Notification stored/logged.`);
    }

    return notification;
  }

  /**
   * Broadcasts a notification to all active connections.
   * @param {String} title 
   * @param {String} body 
   * @param {Object} data 
   * @returns {Promise<Object>}
   */
  async broadcastNotification(title, body, data = {}) {
    logger.info(`Broadcasting notification to all users: [${title}] ${body}`);

    const notification = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      body,
      data,
      createdAt: new Date(),
    };

    socketService.sendToAll('notification_broadcast', notification);
    return notification;
  }
}

export const notificationService = new NotificationService();
