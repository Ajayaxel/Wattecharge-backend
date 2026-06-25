import { env } from './env.js';

export const jwtConfig = {
  secret: env.jwt.secret,
  options: {
    expiresIn: env.jwt.expire,
  },
};
