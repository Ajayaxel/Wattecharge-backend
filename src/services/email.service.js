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
  /**
   * Sends a fleet invite email.
   * @param {String} to - Receiver email
   * @param {String} fleetName - Name of the fleet company
   * @param {String} fleetCode - Fleet company code
   */
  async sendFleetInviteEmail(to, fleetName, fleetCode) {
    const subject = `You're invited to join ${fleetName} on Wattcharge!`;
    const text = `Hi,\n\nYou have been invited to join the ${fleetName} fleet on Wattcharge.\n\nUse the following Fleet Code when signing up or in your account settings:\n${fleetCode}\n\nBest regards,\nThe Wattcharge Team`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #4CAF50;">Join ${fleetName} on Wattcharge!</h2>
        <p>Hi there,</p>
        <p>You have been invited to join the <strong>${fleetName}</strong> fleet on Wattcharge.</p>
        <p>Use the following Fleet Code to link your account to the fleet:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0;">
          <h1 style="margin: 0; color: #333; letter-spacing: 2px;">${fleetCode}</h1>
        </div>
        <p>If you don't have an account yet, you can enter this code during signup.</p>
        <br/>
        <p>Best regards,<br/><strong>The Wattcharge Team</strong></p>
      </div>
    `;
    return this.sendEmail(to, subject, text, html);
  }
}

export const emailService = new EmailService();
