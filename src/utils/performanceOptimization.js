
export const optimizeDataLoading = {
  batchLoad: async (loadFunctions, batchSize = 3) => {
    const results = [];
    
    for (let i = 0; i < loadFunctions.length; i += batchSize) {
      const batch = loadFunctions.slice(i, i + batchSize);
      const batchResults = await Promise.allSettled(batch.map(fn => fn()));
      
      results.push(...batchResults.map(result => 
        result.status === 'fulfilled' ? result.value : null
      ));
      
      if (i + batchSize < loadFunctions.length) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }
    
    return results;
  },

  loadWithProgress: async (loadFunction, onProgress) => {
    const startTime = Date.now();
    
    try {
      const result = await loadFunction();
      
      if (onProgress) {
        onProgress(100, Date.now() - startTime);
      }
      
      return result;
    } catch (error) {
      if (onProgress) {
        onProgress(0, Date.now() - startTime, error);
      }
      throw error;
    }
  }
};

export const optimizeCache = {
  smartCache: new Map(),
  
  set: (key, value, ttl = 5 * 60 * 1000) => {
    optimizeCache.smartCache.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    });
  },
  
  get: (key) => {
    const cached = optimizeCache.smartCache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      optimizeCache.smartCache.delete(key);
      return null;
    }
    
    return cached.value;
  },
  
  cleanup: () => {
    const now = Date.now();
    for (const [key, cached] of optimizeCache.smartCache.entries()) {
      if (now - cached.timestamp > cached.ttl) {
        optimizeCache.smartCache.delete(key);
      }
    }
  }
};

export const optimizeReactPerformance = {
  memoizeCallback: (callback, deps) => {
    const memoized = React.useCallback(callback, deps);
    return memoized;
  },
  
  memoizeValue: (value, deps) => {
    const memoized = React.useMemo(() => value, deps);
    return memoized;
  },
  
  lazyLoadComponent: (importFunc) => {
    return React.lazy(() => importFunc().then(module => ({
      default: module.default || module
    })));
  }
};

export const optimizeImageLoading = {
  preloadImages: (imageUrls, onProgress) => {
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
  },
  
  optimizeImageDisplay: (imageUrl, options = {}) => {
    const { width = 800, height = 600, quality = 0.8 } = options;
    
    if (imageUrl && imageUrl.includes('firebasestorage.googleapis.com')) {
      const url = new URL(imageUrl);
      url.searchParams.set('alt', 'media');
      url.searchParams.set('w', width.toString());
      url.searchParams.set('h', height.toString());
      url.searchParams.set('q', quality.toString());
      return url.toString();
    }
    
    return imageUrl;
  }
};

export const performanceOptimizer = {
  optimizePageLoad: () => {
    optimizeCache.cleanup();
    
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        console.log('Fonts loaded successfully');
      });
    }
    
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            imageObserver.unobserve(img);
          }
        });
      });
      
      images.forEach(img => imageObserver.observe(img));
    }
  },
  
  optimizeNavigation: () => {
    optimizeCache.cleanup();
    
    return {
      preloadData: (dataLoader) => {
        return dataLoader().catch(error => {
          console.warn('Preload failed:', error);
          return null;
        });
      }
    };
  }
};

export default {
  optimizeDataLoading,
  optimizeCache,
  optimizeReactPerformance,
  optimizeImageLoading,
  performanceOptimizer
}; 