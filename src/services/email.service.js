import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      auth: {
        user: env.smtp.user,
        pass: env.smtp.pass,
      },
    });
  }

  /**
   * General purpose method to send email.
   * @param {String} to - Receiver email
   * @param {String} subject - Email subject
   * @param {String} text - Plain text body
   * @param {String} html - HTML body (optional)
   * @returns {Promise<Object>}
   */
  async sendEmail(to, subject, text, html = '') {
    try {
      const mailOptions = {
        from: env.smtp.from,
        to,
        subject,
        text,
        html: html || text,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully: ${info.messageId}`);
      return info;
    } catch (error) {
      logger.error(`Error sending email to ${to}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Sends a welcome email to a new user.
   * @param {String} to - Receiver email
   * @param {String} name - User's name
   */
  async sendWelcomeEmail(to, name) {
    const subject = 'Welcome to Wattcharge!';
    const text = `Hi ${name},\n\nWelcome to Wattcharge! We are thrilled to have you join our platform.\n\nBest regards,\nThe Wattcharge Team`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #4CAF50;">Welcome to Wattcharge!</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>We are thrilled to have you join our platform! Your account is active and you can now start exploring.</p>
        <p>If you have any questions or need support, reply to this email.</p>
        <br/>
        <p>Best regards,<br/><strong>The Wattcharge Team</strong></p>
      </div>
    `;
    return this.sendEmail(to, subject, text, html);
  }
}

export const emailService = new EmailService();
