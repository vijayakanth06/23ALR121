const log = require('../../logging_middleware/logger');

const vehicleSchedulerLogger = {
  info: async (message) => {
    try {
      await log('backend', 'info', 'vehicle_scheduler', message);
    } catch (err) {
      console.error('Logging failed:', err.message);
    }
  },

  error: async (message) => {
    try {
      await log('backend', 'error', 'vehicle_scheduler', message);
    } catch (err) {
      console.error('Logging failed:', err.message);
    }
  },

  warn: async (message) => {
    try {
      await log('backend', 'warn', 'vehicle_scheduler', message);
    } catch (err) {
      console.error('Logging failed:', err.message);
    }
  }
};

module.exports = vehicleSchedulerLogger;
