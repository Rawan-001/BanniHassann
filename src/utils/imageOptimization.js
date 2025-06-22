
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * @param {File} file - ملف الصورة
 * @param {Object} options - خيارات الضغط
 * @returns {Promise<File>} - الصورة المضغوطة
 */
export const optimizeImage = async (file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (maxWidth * height) / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = (maxHeight * width) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * عشان ما انسى هذا الي يحسن الصور في اليو ار ال
 * @param {string} imageUrl - 
 * @returns {string} - 
 */
export const optimizeFirebaseUrl = (url) => {
  if (!url) return url;
  try {
    const optimizedUrl = new URL(url);
    optimizedUrl.searchParams.set('quality', '80');
    optimizedUrl.searchParams.set('format', 'webp');
    optimizedUrl.searchParams.set('cache', 'max-age=31536000');
    return optimizedUrl.toString();
  } catch (error) {
    return url;
  }
};

/**
 */
class ImageCache {
  constructor(maxSize = 100, ttl = 15 * 60 * 1000) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0
    };
  }

  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      this.evict();
    }
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      accessCount: 0
    });
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    entry.accessCount++;
    entry.timestamp = Date.now();
    this.stats.hits++;
    return entry.value;
  }

  evict() {
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => {
      const scoreA = a[1].accessCount * 0.7 + (Date.now() - a[1].timestamp) * 0.3;
      const scoreB = b[1].accessCount * 0.7 + (Date.now() - b[1].timestamp) * 0.3;
      return scoreA - scoreB;
    });

    const entriesToKeep = Math.floor(this.maxSize / 2);
    entries.slice(0, -entriesToKeep).forEach(([key]) => {
      this.cache.delete(key);
      this.stats.evictions++;
    });
  }

  clear() {
    this.cache.clear();
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0
    };
  }

  getStats() {
    return {
      ...this.stats,
      size: this.cache.size,
      hitRate: this.stats.hits / (this.stats.hits + this.stats.misses)
    };
  }
}

/**
 */
export const imageCache = new ImageCache();

/**
 * 
 * @param {string} imageUrl - 
 * @param {Object} options -
 * @returns {Promise<boolean>} - 
 */
export const preloadImage = (url) => {
  return new Promise((resolve, reject) => {
    const cached = imageCache.get(url);
    if (cached) {
      resolve(cached);
      return;
    }

    const img = new Image();
    let attempts = 0;
    const maxAttempts = 3;

    const attemptLoad = () => {
      img.onload = () => {
        imageCache.set(url, img);
        resolve(img);
      };

      img.onerror = () => {
        attempts++;
        if (attempts >= maxAttempts) {
          reject(new Error(`Failed to load image after ${maxAttempts} attempts`));
          return;
        }
        img.src = '';
        setTimeout(attemptLoad, 1000 * attempts);
      };

      img.src = url;
    };

    attemptLoad();
  });
};

/**
 * 
 * @param {string[]} imageUrls -
 * @param {Object} options 
 * @returns {Promise<Object>} - 
 */
export const preloadImages = async (urls, batchSize = 5) => {
  const results = {
    successful: [],
    failed: []
  };

  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const batchPromises = batch.map(url =>
      preloadImage(url)
        .then(() => results.successful.push(url))
        .catch(() => results.failed.push(url))
    );

    await Promise.all(batchPromises);
    if (i + batchSize < urls.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return results;
};

/**
 
 * @param {string} imageUrl
 * @returns {Promise<Object>} 
 */
export const getImageDimensions = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
        size: null
      });
    };
    img.onerror = reject;
    img.src = url;
  });
};

/**
 * 
 * @param {string} imageUrl
 * @param {Object} options 
 * @returns {Promise<boolean>} 
 */
export const getImageSize = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentLength = response.headers.get('content-length');
    return contentLength ? parseInt(contentLength, 10) : null;
  } catch (error) {
    return null;
  }
};


export default {
  optimizeImage,
  optimizeFirebaseUrl,
  ImageCache,
  imageCache,
  preloadImage,
  preloadImages,
  getImageDimensions,
  getImageSize
}; 