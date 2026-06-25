import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.js';

/**
 * Generates a JSON Web Token for the user payload.
 * @param {Object} payload - User payload containing ID, role, etc.
 * @returns {String} Signed JWT token
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, jwtConfig.secret, jwtConfig.options);
};

/**
 * Verifies a given JSON Web Token.
 * @param {String} token - JWT token string
 * @returns {Object} Decoded payload
 */
export const verifyToken = (token) => {
  return jwt.verify(token, jwtConfig.secret);
};
