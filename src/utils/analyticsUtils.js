// Predictive Analytics Utilities

/**
 * Calculate linear regression for trend prediction
 */
export const calculateLinearRegression = (data, key) => {
  if (!data || data.length < 2) return null;

  const values = data.map((d) => d[key]).filter((v) => v != null);
  const n = values.length;
  if (n < 2) return null;

  const x = Array.from({ length: n }, (_, i) => i);
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = values.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * values[i], 0);
  const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept, rSquared: calculateRSquared(values, x, slope, intercept) };
};

/**
 * Calculate R-squared (coefficient of determination)
 */
const calculateRSquared = (values, x, slope, intercept) => {
  const meanY = values.reduce((a, b) => a + b, 0) / values.length;
  const ssRes = values.reduce(
    (sum, yi, i) => sum + Math.pow(yi - (slope * x[i] + intercept), 2),
    0
  );
  const ssTot = values.reduce((sum, yi) => sum + Math.pow(yi - meanY, 2), 0);
  return ssTot === 0 ? 0 : 1 - ssRes / ssTot;
};

/**
 * Predict future value using linear regression
 */
export const predictValue = (regression, stepsAhead, currentIndex) => {
  if (!regression) return null;
  return regression.slope * (currentIndex + stepsAhead) + regression.intercept;
};

/**
 * Calculate moving average
 */
export const calculateMovingAverage = (data, key, windowSize = 5) => {
  if (!data || data.length < windowSize) return [];

  const result = [];
  for (let i = windowSize - 1; i < data.length; i++) {
    const window = data.slice(i - windowSize + 1, i + 1);
    const avg =
      window.reduce((sum, d) => sum + (d[key] || 0), 0) / windowSize;
    result.push({
      ...data[i],
      [`${key}_ma`]: avg,
    });
  }
  return result;
};

/**
 * Detect anomalies using Z-score
 */
export const detectAnomalies = (data, key, threshold = 2.5) => {
  if (!data || data.length < 3) return [];

  const values = data.map((d) => d[key]).filter((v) => v != null);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance =
    values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
    values.length;
  const stdDev = Math.sqrt(variance);

  const anomalies = [];
  data.forEach((point, index) => {
    if (point[key] != null) {
      const zScore = Math.abs((point[key] - mean) / stdDev);
      if (zScore > threshold) {
        anomalies.push({
          index,
          value: point[key],
          zScore,
          timestamp: point.timestamp,
        });
      }
    }
  });

  return anomalies;
};

/**
 * Calculate trend direction
 */
export const calculateTrend = (data, key) => {
  if (!data || data.length < 2) return 'stable';

  const regression = calculateLinearRegression(data, key);
  if (!regression) return 'stable';

  const { slope } = regression;
  if (slope > 0.1) return 'increasing';
  if (slope < -0.1) return 'decreasing';
  return 'stable';
};

/**
 * Forecast next N values
 */
export const forecastValues = (data, key, steps = 5) => {
  const regression = calculateLinearRegression(data, key);
  if (!regression) return [];

  const currentIndex = data.length - 1;
  const forecast = [];

  for (let i = 1; i <= steps; i++) {
    const predictedValue = predictValue(regression, i, currentIndex);
    const futureTimestamp = new Date(
      new Date(data[data.length - 1].timestamp || Date.now()).getTime() +
        i * 2000
    ).toISOString();

    forecast.push({
      [key]: predictedValue,
      timestamp: futureTimestamp,
      isForecast: true,
    });
  }

  return forecast;
};

/**
 * Calculate statistics
 */
export const calculateStatistics = (data, key) => {
  if (!data || data.length === 0) return null;

  const values = data.map((d) => d[key]).filter((v) => v != null && !isNaN(v));
  if (values.length === 0) return null;

  const sorted = [...values].sort((a, b) => a - b);
  const sum = values.reduce((a, b) => a + b, 0);
  const mean = sum / values.length;
  const median =
    sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const variance =
    values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
    values.length;
  const stdDev = Math.sqrt(variance);

  return {
    mean: parseFloat(mean.toFixed(2)),
    median: parseFloat(median.toFixed(2)),
    min: parseFloat(min.toFixed(2)),
    max: parseFloat(max.toFixed(2)),
    stdDev: parseFloat(stdDev.toFixed(2)),
    count: values.length,
  };
};

/**
 * Compare two datasets
 */
export const compareDatasets = (dataset1, dataset2, key) => {
  const stats1 = calculateStatistics(dataset1, key);
  const stats2 = calculateStatistics(dataset2, key);

  if (!stats1 || !stats2) return null;

  return {
    dataset1: stats1,
    dataset2: stats2,
    difference: {
      mean: parseFloat((stats1.mean - stats2.mean).toFixed(2)),
      median: parseFloat((stats1.median - stats2.median).toFixed(2)),
      min: parseFloat((stats1.min - stats2.min).toFixed(2)),
      max: parseFloat((stats1.max - stats2.max).toFixed(2)),
    },
    percentageChange: {
      mean: parseFloat(((stats1.mean - stats2.mean) / stats2.mean * 100).toFixed(2)),
      median: parseFloat(((stats1.median - stats2.median) / stats2.median * 100).toFixed(2)),
    },
  };
};
