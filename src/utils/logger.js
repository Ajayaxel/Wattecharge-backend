export const logger = {
  info: (message) => console.log(`\x1b[32m[INFO] ${new Date().toISOString()} -\x1b[0m ${message}`),
  error: (message) => console.error(`\x1b[31m[ERROR] ${new Date().toISOString()} -\x1b[0m ${message}`),
  warn: (message) => console.warn(`\x1b[33m[WARN] ${new Date().toISOString()} -\x1b[0m ${message}`),
  debug: (message) => console.debug(`\x1b[36m[DEBUG] ${new Date().toISOString()} -\x1b[0m ${message}`),
};
