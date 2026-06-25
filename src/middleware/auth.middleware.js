import { verifyToken } from '../utils/generateToken.js';
import { APIError } from '../utils/response.js';
import { User } from '../features/auth/auth.model.js';

/**
 * Protects route from unauthenticated requests.
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new APIError('Access denied. No token provided.', 401));
    }

    // Verify the token
    const decoded = verifyToken(token);

    // Find the user associated with this token
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return next(new APIError('The user belonging to this token no longer exists.', 401));
    }

    // Set user payload on the request
    req.user = user;
    next();
  } catch (error) {
    next(new APIError('Authentication failed. Invalid or expired token.', 401));
  }
};

/**
 * Restricts access to specific user roles.
 * @param {...String} roles - List of allowed roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new APIError('User context not found. Auth protect middleware required first.', 500));
    }

    if (!roles.includes(req.user.role)) {
      return next(new APIError('Access denied. You do not have permissions to perform this action.', 403));
    }

    next();
  };
};
