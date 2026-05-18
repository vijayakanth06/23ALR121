const logger = require('../utils/logger.util');

const optimizerService = {
  solveKnapsack: (vehicles, capacity) => {
    const n = vehicles.length;
    const dp = new Array(capacity + 1).fill(0);

    for (let i = 0; i < n; i++) {
      const vehicle = vehicles[i];
      for (let w = capacity; w >= vehicle.Duration; w--) {
        dp[w] = Math.max(
          dp[w],
          dp[w - vehicle.Duration] + vehicle.Impact
        );
      }
    }

    return dp[capacity];
  },

  getSelectedVehicles: (vehicles, capacity) => {
    const n = vehicles.length;
    const dp = new Array(capacity + 1).fill(0);
    
    for (let i = 0; i < n; i++) {
      const vehicle = vehicles[i];
      for (let w = capacity; w >= vehicle.Duration; w--) {
        dp[w] = Math.max(
          dp[w],
          dp[w - vehicle.Duration] + vehicle.Impact
        );
      }
    }

    const selected = [];
    let w = capacity;

    for (let i = n - 1; i >= 0; i--) {
      const vehicle = vehicles[i];
      if (w >= vehicle.Duration && 
          dp[w] === dp[w - vehicle.Duration] + vehicle.Impact) {
        selected.push({
          TaskID: vehicle.TaskID,
          Duration: vehicle.Duration,
          Impact: vehicle.Impact
        });
        w -= vehicle.Duration;
      }
    }

    return selected;
  },

  calculateMetrics: (selectedVehicles, capacity) => {
    const totalDuration = selectedVehicles.reduce((sum, v) => sum + v.Duration, 0);
    const totalImpact = selectedVehicles.reduce((sum, v) => sum + v.Impact, 0);
    const utilizationPercentage = capacity > 0 ? ((totalDuration / capacity) * 100).toFixed(2) : 0;
    const remainingCapacity = capacity - totalDuration;

    return {
      totalDuration,
      totalImpact,
      utilizationPercentage: parseFloat(utilizationPercentage),
      remainingCapacity,
      selectedCount: selectedVehicles.length
    };
  },

  optimizeAllDepots: async (depots, vehicles) => {
    const results = [];

    for (const depot of depots) {
      const depotID = depot.ID;
      const capacity = depot.MechanicHours;

      await logger.info(`Processing depot ${depotID} with capacity ${capacity} hours and ${vehicles.length} vehicles`);

      const maxImpact = optimizerService.solveKnapsack(vehicles, capacity);
      const selectedVehicles = optimizerService.getSelectedVehicles(vehicles, capacity);
      const metrics = optimizerService.calculateMetrics(selectedVehicles, capacity);

      await logger.info(
        `Depot ${depotID} optimization complete - Max Impact: ${maxImpact}, Selected: ${metrics.selectedCount}, Utilization: ${metrics.utilizationPercentage}%`
      );

      results.push({
        depotID,
        availableMechanicHours: capacity,
        maxImpactScore: maxImpact,
        selectedVehicles,
        selectedCount: metrics.selectedCount,
        totalDurationUsed: metrics.totalDuration,
        utilizationPercentage: metrics.utilizationPercentage,
        remainingCapacity: metrics.remainingCapacity
      });
    }

    return results;
  }
};

module.exports = optimizerService;
