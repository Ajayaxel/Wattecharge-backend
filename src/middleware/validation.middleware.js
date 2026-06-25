import { sendError } from '../utils/response.js';

/**
 * Validates request data against Joi schema.
 * @param {Object} schema - Joi Schema
 * @param {String} source - Request source: 'body', 'query', or 'params'
 */
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const { value, error } = schema.validate(req[source], {
      abortEarly: false, // Return all errors
      stripUnknown: true, // Remove unknown fields
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message.replace(/"/g, ''));
      return sendError(res, 'Validation Error', 400, messages);
    }

    // Replace request payload with sanitized, validated values
    req[source] = value;
    next();
  };
};
