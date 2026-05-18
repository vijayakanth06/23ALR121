const axios = require('axios');
require('dotenv').config();
const logger = require('../utils/logger.util');

const DEPOT_API = 'http://4.224.186.213/evaluation-service/depots';
const VEHICLES_API = 'http://4.224.186.213/evaluation-service/vehicles';
const API_TIMEOUT = 10000;

const apiService = {
  fetchDepots: async () => {
    try {
      await logger.info('Initiating Depot API call');

      if (!process.env.ACCESS_TOKEN) {
        await logger.error('Missing ACCESS_TOKEN in .env file');
        throw new Error('Missing Bearer token in environment');
      }

      const response = await axios.get(DEPOT_API, {
        headers: {
          'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: API_TIMEOUT
      });

      const depots = response.data.depots || [];
      await logger.info(`Successfully fetched ${depots.length} depots`);

      return depots;
    } catch (error) {
      const errorMsg = `Depot API Error: ${error.response?.status || 'Network'} - ${error.message}`;
      await logger.error(errorMsg);
      throw error;
    }
  },

  fetchVehicles: async () => {
    try {
      await logger.info('Initiating Vehicles API call');

      if (!process.env.ACCESS_TOKEN) {
        await logger.error('Missing ACCESS_TOKEN in .env file');
        throw new Error('Missing Bearer token in environment');
      }

      const response = await axios.get(VEHICLES_API, {
        headers: {
          'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: API_TIMEOUT
      });

      const vehicles = response.data.vehicles || [];
      await logger.info(`Successfully fetched ${vehicles.length} vehicles`);

      return vehicles;
    } catch (error) {
      const errorMsg = `Vehicles API Error: ${error.response?.status || 'Network'} - ${error.message}`;
      await logger.error(errorMsg);
      throw error;
    }
  }
};

module.exports = apiService;
