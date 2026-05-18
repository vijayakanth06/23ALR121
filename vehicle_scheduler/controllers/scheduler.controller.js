const fs = require('fs');
const path = require('path');
const apiService = require('../services/api.service');
const optimizerService = require('../services/optimizer.service');
const logger = require('../utils/logger.util');

const schedulerController = {
  optimizeSchedule: async (req, res) => {
    try {
      await logger.info('Vehicle optimization request received');

      const depots = await apiService.fetchDepots();
      const vehicles = await apiService.fetchVehicles();

      if (!depots || depots.length === 0) {
        await logger.warn('No depots returned from API');
        return res.status(400).json({
          status: 'error',
          message: 'No depots available for optimization',
          code: 400
        });
      }

      if (!vehicles || vehicles.length === 0) {
        await logger.warn('No vehicles returned from API');
        return res.status(400).json({
          status: 'error',
          message: 'No vehicles available for scheduling',
          code: 400
        });
      }

      await logger.info('Starting knapsack optimization for all depots');

      const depotResults = await optimizerService.optimizeAllDepots(depots, vehicles);

      const globalStats = {
        totalSelectedVehicles: depotResults.reduce((sum, d) => sum + d.selectedCount, 0),
        totalImpactAchieved: depotResults.reduce((sum, d) => sum + d.maxImpactScore, 0),
        totalDurationUsed: depotResults.reduce((sum, d) => sum + d.totalDurationUsed, 0),
        totalAvailableCapacity: depots.reduce((sum, d) => sum + d.MechanicHours, 0)
      };

      globalStats.overallUtilizationPercentage = globalStats.totalAvailableCapacity > 0 
        ? ((globalStats.totalDurationUsed / globalStats.totalAvailableCapacity) * 100).toFixed(2)
        : 0;

      const responseData = {
        status: 'success',
        timestamp: new Date().toISOString(),
        summary: {
          totalDepots: depots.length,
          totalVehicles: vehicles.length,
          totalMechanicHours: depots.reduce((sum, d) => sum + d.MechanicHours, 0)
        },
        depots: depotResults,
        globalStats: {
          totalSelectedVehicles: globalStats.totalSelectedVehicles,
          totalImpactAchieved: globalStats.totalImpactAchieved,
          totalDurationUsed: globalStats.totalDurationUsed,
          totalAvailableCapacity: globalStats.totalAvailableCapacity,
          overallUtilizationPercentage: parseFloat(globalStats.overallUtilizationPercentage)
        }
      };

      const outputDir = path.join(__dirname, '../output');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      fs.writeFileSync(
        path.join(outputDir, 'results.json'),
        JSON.stringify(responseData, null, 2)
      );

      await logger.info('Vehicle optimization completed successfully');

      res.status(200).json(responseData);
    } catch (error) {
      await logger.error(`Controller Error: ${error.message}`);

      if (error.response?.status === 401) {
        return res.status(401).json({
          status: 'error',
          message: 'API Authentication failed - Invalid or expired token',
          code: 401
        });
      }

      if (error.response?.status === 403) {
        return res.status(403).json({
          status: 'error',
          message: 'API Access forbidden',
          code: 403
        });
      }

      if (error.message.includes('timeout')) {
        return res.status(504).json({
          status: 'error',
          message: 'API request timeout - Service unavailable',
          code: 504
        });
      }

      if (error.message.includes('Bearer token')) {
        return res.status(401).json({
          status: 'error',
          message: 'Missing or invalid Bearer token',
          code: 401
        });
      }

      res.status(500).json({
        status: 'error',
        message: 'Internal server error during optimization',
        code: 500,
        details: error.message
      });
    }
  }
};

module.exports = schedulerController;
