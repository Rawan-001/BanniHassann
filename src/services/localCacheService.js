// خدمة تخزين بيانات في LocalStorage مع مدة صلاحية محسنة

const getCacheKey = (key) => `banniHassanCache_${key}`;

const DEFAULT_TTL = 30 * 60 * 1000; 
const WEATHER_TTL = 10 * 60 * 1000; 
const IMAGE_TTL = 60 * 60 * 1000; 

export function saveToLocalCache(key, data, ttlMs = DEFAULT_TTL) {
  try {
    const cacheKey = getCacheKey(key);
    const expiresAt = Date.now() + ttlMs;
    const value = { data, expiresAt };
    localStorage.setItem(cacheKey, JSON.stringify(value));
  } catch (error) {
    console.warn("Failed to save to cache:", error);
    cleanupCache();
  }
}

export function getFromLocalCache(key) {
  try {
    const cacheKey = getCacheKey(key);
    const value = localStorage.getItem(cacheKey);
    if (!value) return null;
    
    const parsed = JSON.parse(value);
    if (parsed.expiresAt && parsed.expiresAt > Date.now()) {
      return parsed.data;
    } else {
      localStorage.removeItem(cacheKey);
      return null;
    }
  } catch (error) {
    console.warn("Failed to get from cache:", error);
    clearLocalCache(key);
    return null;
  }
}

export function clearLocalCache(key) {
  try {
    const cacheKey = getCacheKey(key);
    localStorage.removeItem(cacheKey);
  } catch (error) {
    console.warn("Failed to clear cache:", error);
  }
}

function cleanupCache() {
  try {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter(key => key.startsWith('banniHassanCache_'));
    
    cacheKeys.forEach(key => {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          const parsed = JSON.parse(value);
          if (parsed.expiresAt && parsed.expiresAt <= Date.now()) {
            localStorage.removeItem(key);
          }
        }
      } catch (error) {
        localStorage.removeItem(key);
      }
    });
    
    if (cacheKeys.length > 50) {
      const sortedKeys = cacheKeys
        .map(key => ({ key, timestamp: getCacheTimestamp(key) }))
        .sort((a, b) => a.timestamp - b.timestamp);
      
      const toDelete = Math.ceil(sortedKeys.length * 0.2);
      sortedKeys.slice(0, toDelete).forEach(({ key }) => {
        localStorage.removeItem(key);
      });
    }
  } catch (error) {
    console.warn("Failed to cleanup cache:", error);
  }
}

function getCacheTimestamp(key) {
  try {
    const value = localStorage.getItem(key);
    if (value) {
      const parsed = JSON.parse(value);
      return parsed.expiresAt || 0;
    }
  } catch (error) {
  }
  return 0;
}

export function saveWeatherCache(key, data) {
  saveToLocalCache(`weather_${key}`, data, WEATHER_TTL);
}

export function getWeatherCache(key) {
  return getFromLocalCache(`weather_${key}`);
}

export function saveImageCache(key, data) {
  saveToLocalCache(`image_${key}`, data, IMAGE_TTL);
}

export function getImageCache(key) {
  return getFromLocalCache(`image_${key}`);
}

export function clearAllCache() {
  try {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter(key => key.startsWith('banniHassanCache_'));
    cacheKeys.forEach(key => localStorage.removeItem(key));
    console.log("All cache cleared");
  } catch (error) {
    console.warn("Failed to clear all cache:", error);
  }
}

export function getCacheStatus() {
  try {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter(key => key.startsWith('banniHassanCache_'));
    
    const status = {
      totalEntries: cacheKeys.length,
      totalSize: 0,
      expiredEntries: 0,
      validEntries: 0
    };
    
    cacheKeys.forEach(key => {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          status.totalSize += value.length;
          const parsed = JSON.parse(value);
          if (parsed.expiresAt && parsed.expiresAt <= Date.now()) {
            status.expiredEntries++;
          } else {
            status.validEntries++;
          }
        }
      } catch (error) {
        status.expiredEntries++;
      }
    });
    
    return status;
  } catch (error) {
    return { error: error.message };
  }
} 