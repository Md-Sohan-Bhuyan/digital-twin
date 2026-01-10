// Data Persistence Utilities using localStorage and IndexedDB

const STORAGE_KEYS = {
  SENSOR_DATA: 'digital-twin-sensor-data',
  HISTORICAL_DATA: 'digital-twin-historical-data',
  USER_PREFERENCES: 'digital-twin-preferences',
  DASHBOARD_CONFIG: 'digital-twin-dashboard-config',
};

/**
 * Save data to localStorage
 */
export const saveToLocalStorage = (key, data) => {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

/**
 * Load data from localStorage
 */
export const loadFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

/**
 * Clear data from localStorage
 */
export const clearLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Save historical data with size limit
 */
export const saveHistoricalData = (data, maxSize = 1000) => {
  const trimmedData = data.slice(-maxSize);
  return saveToLocalStorage(STORAGE_KEYS.HISTORICAL_DATA, trimmedData);
};

/**
 * Load historical data
 */
export const loadHistoricalData = () => {
  return loadFromLocalStorage(STORAGE_KEYS.HISTORICAL_DATA, []);
};

/**
 * Save user preferences
 */
export const saveUserPreferences = (preferences) => {
  return saveToLocalStorage(STORAGE_KEYS.USER_PREFERENCES, preferences);
};

/**
 * Load user preferences
 */
export const loadUserPreferences = () => {
  return loadFromLocalStorage(STORAGE_KEYS.USER_PREFERENCES, {
    theme: 'dark',
    notifications: true,
    autoRefresh: true,
    refreshInterval: 2000,
  });
};

/**
 * Save dashboard configuration
 */
export const saveDashboardConfig = (config) => {
  return saveToLocalStorage(STORAGE_KEYS.DASHBOARD_CONFIG, config);
};

/**
 * Load dashboard configuration
 */
export const loadDashboardConfig = () => {
  return loadFromLocalStorage(STORAGE_KEYS.DASHBOARD_CONFIG, {
    widgets: {
      showTemperature: true,
      showHumidity: true,
      showPressure: true,
      showVibration: true,
      showEnergy: true,
    },
    layout: 'grid',
  });
};

/**
 * Initialize IndexedDB for larger data storage
 */
let db = null;

export const initIndexedDB = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open('DigitalTwinDB', 1);

    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;

      // Create object stores
      if (!database.objectStoreNames.contains('sensorData')) {
        const sensorStore = database.createObjectStore('sensorData', {
          keyPath: 'id',
          autoIncrement: true,
        });
        sensorStore.createIndex('timestamp', 'timestamp', { unique: false });
        sensorStore.createIndex('deviceId', 'deviceId', { unique: false });
      }

      if (!database.objectStoreNames.contains('historicalData')) {
        const historicalStore = database.createObjectStore('historicalData', {
          keyPath: 'id',
          autoIncrement: true,
        });
        historicalStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      if (!database.objectStoreNames.contains('reports')) {
        database.createObjectStore('reports', {
          keyPath: 'id',
          autoIncrement: true,
        });
      }
    };
  });
};

/**
 * Save data to IndexedDB
 */
export const saveToIndexedDB = async (storeName, data) => {
  try {
    const database = await initIndexedDB();
    const transaction = database.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);

    if (Array.isArray(data)) {
      data.forEach((item) => store.add(item));
    } else {
      store.add(data);
    }

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.error('Error saving to IndexedDB:', error);
    throw error;
  }
};

/**
 * Load data from IndexedDB
 */
export const loadFromIndexedDB = async (storeName, indexName = null, query = null) => {
  try {
    const database = await initIndexedDB();
    const transaction = database.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const request = indexName
        ? store.index(indexName).getAll(query)
        : store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error loading from IndexedDB:', error);
    throw error;
  }
};

/**
 * Clear old data from IndexedDB (keep last N records)
 */
export const clearOldData = async (storeName, keepLast = 1000) => {
  try {
    const database = await initIndexedDB();
    const transaction = database.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const index = store.index('timestamp');

    const allData = await loadFromIndexedDB(storeName);
    if (allData.length <= keepLast) return;

    const sortedData = allData.sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
    const toDelete = sortedData.slice(0, allData.length - keepLast);

    toDelete.forEach((item) => store.delete(item.id));

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.error('Error clearing old data:', error);
    throw error;
  }
};
