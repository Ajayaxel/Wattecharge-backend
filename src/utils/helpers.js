/**
 * Simple helper to pause execution for a given milliseconds.
 * @param {Number} ms 
 * @returns {Promise}
 */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generates a random alphanumeric string of custom length.
 * @param {Number} length 
 * @returns {String}
 */
export const generateRandomString = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Removes sensitive fields like password from a mongoose user document/object.
 * @param {Object} user - User object from MongoDB
 * @returns {Object} Sanitized user object
 */
export const sanitizeUser = (user) => {
  const sanitized = user.toObject ? user.toObject() : { ...user };
  delete sanitized.password;
  delete sanitized.__v;
  return sanitized;
};
