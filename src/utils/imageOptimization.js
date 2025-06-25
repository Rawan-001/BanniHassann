import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * @param {File} file - ملف الصورة
 * @param {Object} options - خيارات الضغط
 * @returns {Promise<File>} - الصورة المضغوطة
 */
export const optimizeImage = async (file, maxWidth = 4000, maxHeight = 3000, quality = 0.95) => {
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
      ctx.imageSmoothingEnabled = true;
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
    optimizedUrl.searchParams.set('quality', '95');
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
export const preloadImagesBatch = async (urls, batchSize = 5) => {
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

    await Promise.allSettled(batchPromises);
    
    if (i + batchSize < urls.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return results;
};

/**
 * 
 * @param {string} url - 
 * @returns {Promise<{width: number, height: number}>} - 
 */
export const getImageDimensions = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
    };
    img.onerror = () => reject(new Error('Failed to get image dimensions'));
    img.src = url;
  });
};

/**
 * 
 * @param {string} url - 
 * @returns {Promise<number>} - 
 */
export const getImageSize = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentLength = response.headers.get('content-length');
    return contentLength ? parseInt(contentLength) : 0;
  } catch (error) {
    console.warn('Failed to get image size:', error);
    return 0;
  }
};


export const optimizeImageLoading = (imageUrl, options = {}) => {
  const {
    width = 800,
    height = 600,
    quality = 0.95,
    format = 'webp'
  } = options;

  if (imageUrl && imageUrl.includes('firebasestorage.googleapis.com')) {
    const url = new URL(imageUrl);
    url.searchParams.set('alt', 'media');
    url.searchParams.set('w', width.toString());
    url.searchParams.set('h', height.toString());
    url.searchParams.set('q', quality.toString());
    return url.toString();
  }

  return imageUrl;
};

export const preloadImagesWithProgress = (imageUrls, onProgress) => {
  const totalImages = imageUrls.length;
  let loadedImages = 0;

  return Promise.all(
    imageUrls.map((url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        
        img.onload = () => {
          loadedImages++;
          if (onProgress) {
            onProgress(loadedImages, totalImages);
          }
          resolve(url);
        };
        
        img.onerror = () => {
          loadedImages++;
          if (onProgress) {
            onProgress(loadedImages, totalImages);
          }
          reject(new Error(`Failed to load image: ${url}`));
        };
        
        img.src = url;
      });
    })
  );
};

export const getOptimizedImageUrl = (image, size = 'medium') => {
  if (!image) return '';
  
  let imageUrl = '';
  if (typeof image === 'string') {
    imageUrl = image;
  } else if (image.url) {
    imageUrl = image.url;
  } else if (image.base64) {
    imageUrl = image.base64;
  }
  
  if (!imageUrl) return '';
  
  const sizes = {
    small: { width: 400, height: 300 },
    medium: { width: 800, height: 600 },
    large: { width: 1200, height: 900 }
  };
  
  return optimizeImageLoading(imageUrl, sizes[size] || sizes.medium);
};

export const lazyLoadImages = (imageUrls, callback) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        observer.unobserve(img);
        
        if (callback) {
          callback(img.dataset.src);
        }
      }
    });
  });

  return observer;
};

export const optimizeCardImages = (images, cardWidth = 300) => {
  if (!images || images.length === 0) return [];
  
  return images.map(image => {
    const optimizedUrl = getOptimizedImageUrl(image, 'small');
    return {
      ...image,
      optimizedUrl,
      aspectRatio: 16 / 9, 
      loading: 'lazy'
    };
  });
};

export default {
  optimizeImage,
  optimizeFirebaseUrl,
  ImageCache,
  imageCache,
  preloadImage,
  preloadImagesBatch,
  getImageDimensions,
  getImageSize
}; 