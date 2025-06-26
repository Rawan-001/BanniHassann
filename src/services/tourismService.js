import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  getDoc,
  query,
  where,
  serverTimestamp,
  onSnapshot,
  orderBy,
  limit,
  startAfter
} from 'firebase/firestore';
import { db } from '../firebaseConfig'; 
import { 
  uploadFileToFirebaseStorage, 
  uploadMultipleFilesToFirebase,
  deleteFileFromFirebaseStorage,
  getFirebaseDownloadURL,
  testFirebaseStorageConnection
} from './firebaseStorageService';


const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const compressImage = (file, maxWidth = 4000, quality = 0.95) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        const ratio = maxWidth / width;
        width = maxWidth;
        height = height * ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};



export const getSafeImageUrl = async (storagePath) => {
  return await getFirebaseDownloadURL(storagePath);
};

export const getImageUrlsForSite = async (siteData) => {
  const images = [];
  
  if (siteData.images) {
    for (const image of siteData.images) {
      if (image.url) {
        images.push(image.url);
      } else if (image.storagePath) {
        const url = await getSafeImageUrl(image.storagePath);
        if (url) images.push(url);
      }
    }
  }
  
  return images;
};

export const uploadMultipleFiles = async (files, folder) => {
  const results = [];
  const errors = [];
  
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    const originalFileName = file.name;
    
    try {
      if (file.type && file.type.startsWith('image/')) {
        const compressedBlob = await compressImage(file);
        file = new File([compressedBlob], originalFileName, { type: 'image/jpeg', lastModified: Date.now() });
      }

      const fileSizeMB = file.size / (1024 * 1024);

      if (fileSizeMB <= 1) {
        const { uploadFileLocally } = await import('./localStorageService');
        const result = await uploadFileLocally(file, folder);
        results.push({ ...result, method: 'base64' });
      } else {
        const result = await uploadFileToFirebaseStorage(file, folder);
        results.push({ ...result, method: 'firebase' });
      }
    } catch (error) {
      errors.push({ 
        fileName: originalFileName, 
        error: error.message,
        index: i
      });
    }
  }
  
  return {
    results,
    errors
  };
};

export const saveFileToFirestore = async (file, category, folder) => {
  try {
    let processedFile = file;
    let thumbnail = null;
    
    if (file.type.startsWith('image/')) {
      processedFile = await compressImage(file, 4000, 0.95);
      const thumbnailBlob = await compressImage(file, 800, 0.95);
      thumbnail = await fileToBase64(thumbnailBlob);
    }
    
    const base64 = await fileToBase64(processedFile);
    const fileId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const fileData = {
      id: fileId,
      originalName: file.name,
      name: `${fileId}.${file.name.split('.').pop()}`,
      type: file.type,
      originalSize: file.size,
      compressedSize: processedFile.size || file.size,
      base64: base64,
      thumbnail: thumbnail || base64,
      category: category,
      folder: folder,
      uploadedAt: serverTimestamp(),
      metadata: {
        width: typeof file.width === 'number' ? file.width : null,
        height: typeof file.height === 'number' ? file.height : null,
        duration: typeof file.duration === 'number' ? file.duration : null,
        lastModified: file.lastModified || null
      }
    };

    const docRef = await addDoc(collection(db, 'mediaFiles'), fileData);
    
    return {
      id: docRef.id,
      url: base64,
      thumbnail: thumbnail || base64,
      path: `mediaFiles/${docRef.id}`,
      name: fileData.name,
      originalName: file.name,
      size: processedFile.size || file.size,
      type: file.type,
      firestoreId: docRef.id,
      metadata: fileData.metadata
    };
    
  } catch (error) {
    throw new Error(`فشل في حفظ الملف: ${error.message}`);
  }
};

export const addTourismSite = async (siteData, imageFiles = [], videoFiles = []) => {
  try {
    if (!siteData.title) {
      throw new Error('العنوان مطلوب');
    }

    const { getAuth } = await import('firebase/auth');
    const { doc, getDoc } = await import('firebase/firestore');
    const { db } = await import('../firebaseConfig');
    
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      throw new Error('يجب تسجيل الدخول أولاً');
    }

    console.log('🔍 Debug: Checking admin status for user:', currentUser.uid);
    
    const adminDocRef = doc(db, 'admins', currentUser.uid);
    const adminDoc = await getDoc(adminDocRef);
    
    if (!adminDoc.exists()) {
      throw new Error('المستخدم ليس أدمن');
    }
    
    const adminData = adminDoc.data();
    console.log('🔍 Debug: Admin data:', adminData);
    
    if (!adminData.isActive) {
      throw new Error('حساب الأدمن غير مفعل');
    }

    console.log('✅ Debug: User is active admin, proceeding with site creation...');

    let imageUrls = [];
    let videoUrls = [];
    let hasLocalImages = false;

    if (imageFiles && imageFiles.length > 0) {
      const imageResults = await uploadMultipleFiles(imageFiles, 'tourismSites/images');
      imageUrls = imageResults.results.map(result => {
        if (result.isLocal) {
          hasLocalImages = true;
        }
        return {
          url: result.url,
          id: result.id,
          name: result.name,
          type: result.type,
          storagePath: result.storagePath,
          isLocal: result.isLocal || false
        };
      });
      
      if (imageResults.errors.length > 0) {
        console.warn('بعض الصور فشلت:', imageResults.errors);
      }
    }

    if (videoFiles && videoFiles.length > 0) {
      const videoResults = await uploadMultipleFiles(videoFiles, 'tourismSites/videos');
      videoUrls = videoResults.results.map(result => ({
        url: result.url,
        id: result.id,
        name: result.name,
        type: result.type,
        storagePath: result.storagePath
      }));
      
      if (videoResults.errors.length > 0) {
        console.warn('بعض المقاطع فشلت:', videoResults.errors);
      }
    }

    let details = [];
    if (siteData.details && siteData.details.length > 0) {
      details = await Promise.all(siteData.details.map(async (detail) => {
        let existingDetailImages = [];
        let newDetailImageFiles = [];
        
        if (detail.images && detail.images.length > 0) {
          existingDetailImages = detail.images.filter(img => !(img instanceof File));
          newDetailImageFiles = detail.images.filter(img => img instanceof File);
        }
        
        let detailImages = [...existingDetailImages];
        
        if (newDetailImageFiles.length > 0) {
          const detailImageResults = await uploadMultipleFiles(newDetailImageFiles, 'tourismSites/images');
          const uploadedImages = detailImageResults.results.map(result => ({
            url: result.url,
            id: result.id,
            name: result.name,
            type: result.type,
            storagePath: result.storagePath
          }));
          detailImages = [...detailImages, ...uploadedImages];
        }
        
        return {
          ...detail,
          images: detailImages
        };
      }));
    }

    const documentData = {
      title: String(siteData.title).trim(),
      description: siteData.description ? String(siteData.description).trim() : '',
      category: siteData.category ? String(siteData.category) : 'cafes',
      
      coordinates: siteData.coordinates && siteData.coordinates.lat && siteData.coordinates.lon ? {
        lat: Number(siteData.coordinates.lat),
        lon: Number(siteData.coordinates.lon)
      } : null,
      
      address: siteData.address ? String(siteData.address).trim() : '',
      googleMapsUrl: siteData.googleMapsUrl ? String(siteData.googleMapsUrl).trim() : '',
      rating: Number(siteData.rating) || 4.0,
      popularity: siteData.popularity ? String(siteData.popularity).trim() : '',
      openingHours: siteData.openingHours ? String(siteData.openingHours).trim() : '',
      contactInfo: siteData.contactInfo ? String(siteData.contactInfo).trim() : '',
      price: siteData.price ? String(siteData.price).trim() : '',
      additionalInfo: siteData.additionalInfo ? String(siteData.additionalInfo).trim() : '',
      
      images: imageUrls,
      videos: videoUrls,
      details: details,
      
      totalImages: imageUrls.length,
      totalVideos: videoUrls.length,
      
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      
      status: 'active',
      verified: false,
      storageMethod: 'storage_url'
    };

    const cleanImageUrls = imageUrls.filter(img => 
      img && typeof img === 'object' && !(img instanceof File) && 
      (img.url || img.base64 || img.downloadURL)
    ).map(img => {
      if (img.url && img.url.startsWith('data:image/') && img.url.length > 1000000) { // أكبر من 1MB
        console.log('Found large base64 image in addTourismSite, replacing with placeholder:', img.name);
        return {
          ...img,
          url: 'https://via.placeholder.com/400x300/cccccc/666666?text=صورة+كبيرة', // placeholder مؤقت
          originalSize: img.url.length,
          isLargeBase64: true
        };
      }
      return img;
    });
    
    const cleanVideoUrls = videoUrls.filter(vid => 
      vid && typeof vid === 'object' && !(vid instanceof File) && 
      (vid.url || vid.base64 || vid.downloadURL)
    );
    
    const cleanDetails = details.map(detail => {
      if (detail.images && Array.isArray(detail.images)) {
        const cleanDetailImages = detail.images.filter(img => {
          const isValid = img && typeof img === 'object' && !(img instanceof File) && 
            (img.url || img.base64 || img.downloadURL);
          
          if (!isValid) {
            console.log('Filtered out invalid detail image in addTourismSite:', img);
          }
          return isValid;
        }).map(img => {
          if (img.url && img.url.startsWith('data:image/') && img.url.length > 1000000) { // أكبر من 1MB
            console.log('Found large base64 detail image in addTourismSite, replacing with placeholder:', img.name);
            return {
              ...img,
              url: 'https://via.placeholder.com/400x300/cccccc/666666?text=صورة+كبيرة',
              originalSize: img.url.length,
              isLargeBase64: true
            };
          }
          return img;
        });
        
        return {
          ...detail,
          images: cleanDetailImages
        };
      }
      return detail;
    });

    const safeDocumentData = {
      title: String(siteData.title).trim(),
      description: siteData.description ? String(siteData.description).trim() : '',
      category: siteData.category ? String(siteData.category) : 'cafes',
      
      coordinates: siteData.coordinates && siteData.coordinates.lat && siteData.coordinates.lon ? {
        lat: Number(siteData.coordinates.lat),
        lon: Number(siteData.coordinates.lon)
      } : null,
      
      address: siteData.address ? String(siteData.address).trim() : '',
      googleMapsUrl: siteData.googleMapsUrl ? String(siteData.googleMapsUrl).trim() : '',
      rating: Number(siteData.rating) || 4.0,
      popularity: siteData.popularity ? String(siteData.popularity).trim() : '',
      openingHours: siteData.openingHours ? String(siteData.openingHours).trim() : '',
      contactInfo: siteData.contactInfo ? String(siteData.contactInfo).trim() : '',
      price: siteData.price ? String(siteData.price).trim() : '',
      additionalInfo: siteData.additionalInfo ? String(siteData.additionalInfo).trim() : '',
      
      images: cleanImageUrls,
      videos: cleanVideoUrls,
      details: cleanDetails,
      
      totalImages: cleanImageUrls.length,
      totalVideos: cleanVideoUrls.length,
      
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      
      status: 'active',
      verified: false,
      storageMethod: 'storage_url'
    };

    console.log('🔍 Debug: Safe document data being sent:', safeDocumentData);
    
    console.log('🔍 Detailed array check:');
    console.log('Images array:', cleanImageUrls);
    console.log('Videos array:', cleanVideoUrls);
    console.log('Details array:', cleanDetails);
    
    if (cleanImageUrls.length > 0) {
      cleanImageUrls.forEach((img, index) => {
        console.log(`Image ${index}:`, {
          type: typeof img,
          isFile: img instanceof File,
          keys: Object.keys(img),
          urlLength: img.url ? img.url.length : 0,
          isBase64: img.url ? img.url.startsWith('data:') : false
        });
      });
    }
    
    if (cleanDetails.length > 0) {
      cleanDetails.forEach((detail, index) => {
        console.log(`Detail ${index}:`, {
          type: typeof detail,
          hasImages: !!detail.images,
          imagesLength: detail.images ? detail.images.length : 0
        });
        if (detail.images && detail.images.length > 0) {
          detail.images.forEach((img, imgIndex) => {
            console.log(`  Detail ${index} Image ${imgIndex}:`, {
              type: typeof img,
              isFile: img instanceof File,
              keys: Object.keys(img)
            });
          });
        }
      });
    }

    const optimizedData = {
      ...safeDocumentData,
      images: cleanImageUrls.map(img => {
        if (img.url && img.url.startsWith('data:') && img.url.length > 1000000) {
          console.warn('Large base64 image detected, length:', img.url.length);
          return {
            ...img,
            url: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2NjIpLCBxdWFsaXR5ID0gOTAK/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgAAQABAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AP38ooA//' // صورة صغيرة مؤقتة
          };
        }
        return img;
      })
    };

    const docRef = await addDoc(collection(db, 'tourismSites'), optimizedData);

    const successMessage = hasLocalImages 
      ? `تم حفظ الموقع بنجاح مع ${cleanImageUrls.length} صورة و ${cleanVideoUrls.length} مقطع مرئي و ${cleanDetails.length} تفصيل (تم استخدام تخزين محلي للصور في وضع التطوير)`
      : `تم حفظ الموقع بنجاح مع ${cleanImageUrls.length} صورة و ${cleanVideoUrls.length} مقطع مرئي و ${cleanDetails.length} تفصيل`;

    return {
      id: docRef.id,
      success: true,
      data: { ...optimizedData, id: docRef.id },
      uploadedImages: cleanImageUrls.length,
      uploadedVideos: cleanVideoUrls.length,
      method: hasLocalImages ? 'local_base64' : 'storage_url',
      message: successMessage,
      hasLocalImages
    };

  } catch (error) {
    console.error('🔍 Debug: Error details:', error);
    if (error.code === 'permission-denied') {
      throw new Error('ليس لديك صلاحية لإضافة المواقع السياحية');
    } else if (error.code === 'unavailable') {
      throw new Error('خدمة قاعدة البيانات غير متاحة حالياً');
    } else {
      throw new Error(`فشل في حفظ الموقع: ${error.message}`);
    }
  }
};

export const updateTourismSite = async (siteId, siteData, newImageFiles = [], newVideoFiles = [], removeImageIds = [], removeVideoIds = []) => {
  try {
    const siteDocRef = doc(db, 'tourismSites', siteId);
    const siteDoc = await getDoc(siteDocRef);
    
    if (!siteDoc.exists()) {
      throw new Error('الموقع السياحي غير موجود');
    }

    const currentData = siteDoc.data();
    let currentImages = currentData.images || [];
    let currentVideos = currentData.videos || [];
    let currentDetails = currentData.details || [];
    
    console.log('Current site data:', currentData);
    console.log('Site data images in update:', siteData.images);
    

    if (siteData.images) {
      currentImages = siteData.images.filter(img => !(img instanceof File));
    }

    if (removeImageIds.length > 0) {
      console.log('Removing images with IDs:', removeImageIds);
      console.log('Current images before removal:', currentImages);
      
      for (const imageId of removeImageIds) {
        try {
          const imageToDelete = currentImages.find(img => img.id === imageId);
          console.log(`Processing image ${imageId}:`, imageToDelete);
          
          if (imageToDelete && imageToDelete.storagePath) {
            console.log(`Deleting from Firebase Storage: ${imageToDelete.storagePath}`);
            await deleteFileFromFirebaseStorage(imageToDelete.storagePath);
          }
          
          console.log(`Deleting from mediaFiles collection: ${imageId}`);
          await deleteDoc(doc(db, 'mediaFiles', imageId));
          
          console.log(`Successfully deleted image: ${imageId}`);
        } catch (error) {
          console.warn(`فشل حذف الصورة ${imageId}:`, error.message);
        }
      }
      currentImages = currentImages.filter(img => !removeImageIds.includes(img.id));
      console.log('Current images after removal:', currentImages);
    }

    if (removeVideoIds.length > 0) {
      for (const videoId of removeVideoIds) {
        try {
          await deleteDoc(doc(db, 'mediaFiles', videoId));
        } catch (error) {
          console.warn(`فشل حذف المقطع ${videoId}:`, error.message);
        }
      }
      currentVideos = currentVideos.filter(vid => !removeVideoIds.includes(vid.id));
    }

    if (newImageFiles && newImageFiles.length > 0) {
      console.log('Starting upload of new image files:', newImageFiles.length);
      const imageResults = await uploadMultipleFiles(newImageFiles, 'tourismSites/images');
      console.log('Upload results:', imageResults);
      
      const newImageUrls = imageResults.results.map(result => {
        const imageObj = {
          url: result.url,
          id: result.id,
          name: result.name,
          type: result.type,
          storagePath: result.storagePath
        };
        console.log('Processed image object:', imageObj);
        return imageObj;
      });
      
      console.log('New image URLs before adding to current images:', newImageUrls);
      currentImages = [...currentImages, ...newImageUrls];
      console.log('Current images after adding new ones:', currentImages);
      
      if (imageResults.errors.length > 0) {
        console.warn('بعض الصور الجديدة فشلت:', imageResults.errors);
      }
    }

    if (newVideoFiles && newVideoFiles.length > 0) {
      const videoResults = await uploadMultipleFiles(newVideoFiles, 'tourismSites/videos');
      const newVideoUrls = videoResults.results.map(result => ({
        url: result.url,
        id: result.id,
        name: result.name,
        type: result.type,
        storagePath: result.storagePath
      }));
      
      currentVideos = [...currentVideos, ...newVideoUrls];
      
      if (videoResults.errors.length > 0) {
        console.warn('بعض المقاطع الجديدة فشلت:', videoResults.errors);
      }
    }

    if (siteData.details) {
      currentDetails = await Promise.all(siteData.details.map(async (detail) => {
        let finalDetailImages = detail.images ? detail.images.filter(img => !(img instanceof File)) : [];
        const newDetailImageFiles = detail.images ? detail.images.filter(img => img instanceof File) : [];

        if (newDetailImageFiles.length > 0) {
          const detailImageResults = await uploadMultipleFiles(newDetailImageFiles, 'tourismSites/images');
          const uploadedImages = detailImageResults.results.map(result => ({
            url: result.url,
            id: result.id,
            name: result.name,
            type: result.type,
            storagePath: result.storagePath
          }));
          finalDetailImages = [...finalDetailImages, ...uploadedImages];
        }
        
        return {
          ...detail,
          images: finalDetailImages
        };
      }));
    }

    console.log('Current images before cleaning:', currentImages);
    console.log('Current images types:', currentImages.map(img => ({ 
      type: typeof img, 
      isFile: img instanceof File,
      hasUrl: !!(img && (img.url || img.base64 || img.downloadURL)),
      keys: img ? Object.keys(img) : null
    })));
    
    const cleanImages = currentImages.filter(img => {
      const isValid = img && typeof img === 'object' && !(img instanceof File) && 
        (img.url || img.base64 || img.downloadURL);
      
      if (!isValid) {
        console.log('Filtered out invalid image:', img);
      }
      return isValid;
    }).map(img => {
      if (img.url && img.url.startsWith('data:image/') && img.url.length > 1000000) { 
        console.log('Found large base64 image, replacing with placeholder:', img.name);
        return {
          ...img,
          url: 'https://via.placeholder.com/400x300/cccccc/666666?text=صورة+كبيرة', 
          originalSize: img.url.length,
          isLargeBase64: true
        };
      }
      return img;
    });

    const cleanVideos = currentVideos.filter(vid => {
      const isValid = vid && typeof vid === 'object' && !(vid instanceof File) && 
        (vid.url || vid.base64 || vid.downloadURL);
      
      if (!isValid) {
        console.log('Filtered out invalid video:', vid);
      }
      return isValid;
    });

    console.log('Current details:', currentDetails);
    const cleanDetails = currentDetails.map(detail => {
      if (detail.images && Array.isArray(detail.images)) {
        const cleanDetailImages = detail.images.filter(img => {
          const isValid = img && typeof img === 'object' && !(img instanceof File) && 
            (img.url || img.base64 || img.downloadURL);
          
          if (!isValid) {
            console.log('Filtered out invalid detail image:', img);
          }
          return isValid;
        }).map(img => {
          if (img.url && img.url.startsWith('data:image/') && img.url.length > 1000000) { 
            console.log('Found large base64 detail image, replacing with placeholder:', img.name);
            return {
              ...img,
              url: 'https://via.placeholder.com/400x300/cccccc/666666?text=صورة+كبيرة', 
              originalSize: img.url.length,
              isLargeBase64: true
            };
          }
          return img;
        });
        
        return {
          ...detail,
          images: cleanDetailImages
        };
      }
      return detail;
    });

    const updatedData = {
      ...(siteData.title && { title: String(siteData.title).trim() }),
      ...(siteData.description && { description: String(siteData.description).trim() }),
      ...(siteData.category && { category: String(siteData.category) }),
      
      ...(siteData.coordinates && {
        coordinates: {
          lat: Number(siteData.coordinates.lat),
          lon: Number(siteData.coordinates.lon)
        }
      }),
      
      ...(siteData.hasOwnProperty('address') && { address: siteData.address ? String(siteData.address).trim() : '' }),
      ...(siteData.hasOwnProperty('googleMapsUrl') && { googleMapsUrl: siteData.googleMapsUrl ? String(siteData.googleMapsUrl).trim() : '' }),
      ...(siteData.hasOwnProperty('rating') && { rating: Number(siteData.rating) || 4.0 }),
      ...(siteData.hasOwnProperty('popularity') && { popularity: siteData.popularity ? String(siteData.popularity).trim() : '' }),
      ...(siteData.hasOwnProperty('openingHours') && { openingHours: siteData.openingHours ? String(siteData.openingHours).trim() : '' }),
      ...(siteData.hasOwnProperty('contactInfo') && { contactInfo: siteData.contactInfo ? String(siteData.contactInfo).trim() : '' }),
      ...(siteData.hasOwnProperty('price') && { price: siteData.price ? String(siteData.price).trim() : '' }),
      ...(siteData.hasOwnProperty('additionalInfo') && { additionalInfo: siteData.additionalInfo ? String(siteData.additionalInfo).trim() : '' }),
      
      images: cleanImages,
      videos: cleanVideos,
      details: cleanDetails,
      
      totalImages: cleanImages.length,
      totalVideos: cleanVideos.length,
      
      updatedAt: serverTimestamp()
    };
    
    console.log('Clean details:', cleanDetails);
    
    const finalUpdatedData = {
      ...updatedData,
      details: cleanDetails
    };
    
    console.log('Final updated data:', finalUpdatedData);
    console.log('Clean images count:', cleanImages.length);
    console.log('Clean videos count:', cleanVideos.length);

    const hasFileObjects = JSON.stringify(finalUpdatedData, (key, value) => {
      if (value instanceof File) {
        console.error('Found File object in final data!', key, value);
        return '[FILE_OBJECT_FOUND]';
      }
      if (value && typeof value === 'object' && value.constructor === File) {
        console.error('Found File constructor in final data!', key, value);
        return '[FILE_CONSTRUCTOR_FOUND]';
      }
      return value;
    });
    
    console.log('Final data JSON check completed');
    
    console.log('Checking each field in finalUpdatedData:');
    Object.keys(finalUpdatedData).forEach(key => {
      const value = finalUpdatedData[key];
      console.log(`Field ${key}:`, typeof value, value);
      
      if (Array.isArray(value)) {
        console.log(`Array ${key} length:`, value.length);
        value.forEach((item, index) => {
          console.log(`  ${key}[${index}]:`, typeof item, item instanceof File ? 'IS_FILE' : 'NOT_FILE');
        });
      }
    });

    const safeData = {
      ...(finalUpdatedData.title && { title: finalUpdatedData.title }),
      ...(finalUpdatedData.description && { description: finalUpdatedData.description }),
      ...(finalUpdatedData.category && { category: finalUpdatedData.category }),
      ...(finalUpdatedData.coordinates && { 
        coordinates: {
          lat: Number(finalUpdatedData.coordinates.lat),
          lon: Number(finalUpdatedData.coordinates.lon)
        }
      }),
      ...(finalUpdatedData.address && { address: finalUpdatedData.address }),
      ...(finalUpdatedData.googleMapsUrl && { googleMapsUrl: finalUpdatedData.googleMapsUrl }),
      ...(finalUpdatedData.rating && { rating: Number(finalUpdatedData.rating) }),
      ...(finalUpdatedData.popularity !== undefined && { popularity: finalUpdatedData.popularity }),
      ...(finalUpdatedData.openingHours !== undefined && { openingHours: finalUpdatedData.openingHours }),
      ...(finalUpdatedData.contactInfo !== undefined && { contactInfo: finalUpdatedData.contactInfo }),
      ...(finalUpdatedData.price !== undefined && { price: finalUpdatedData.price }),
      ...(finalUpdatedData.additionalInfo !== undefined && { additionalInfo: finalUpdatedData.additionalInfo }),
      
      images: cleanImages,
      videos: cleanVideos,
      details: cleanDetails,
      
      totalImages: cleanImages.length,
      totalVideos: cleanVideos.length,
      
      updatedAt: serverTimestamp()
    };
    
    console.log('Safe data to update:', safeData);

    await updateDoc(siteDocRef, safeData);

    return {
      id: siteId,
      success: true,
      data: { ...currentData, ...safeData, id: siteId },
      currentImages: cleanImages.length,
      currentVideos: cleanVideos.length,
      currentDetails: cleanDetails.length,
      removedImages: removeImageIds.length,
      removedVideos: removeVideoIds.length,
      addedImages: newImageFiles ? newImageFiles.length : 0,
      addedVideos: newVideoFiles ? newVideoFiles.length : 0,
      message: `تم تحديث الموقع بنجاح`
    };

  } catch (error) {
    if (error.code === 'permission-denied') {
      throw new Error('ليس لديك صلاحية لتحديث المواقع السياحية');
    } else if (error.code === 'not-found') {
      throw new Error('الموقع السياحي غير موجود');
    } else if (error.code === 'unavailable') {
      throw new Error('خدمة قاعدة البيانات غير متاحة حالياً');
    } else {
      throw new Error(`فشل في تحديث الموقع: ${error.message}`);
    }
  }
};

export const getTourismSiteById = async (siteId) => {
  try {
    const siteDoc = await getDoc(doc(db, 'tourismSites', siteId));
    
    if (!siteDoc.exists()) {
      throw new Error('الموقع السياحي غير موجود');
    }
    
    const data = siteDoc.data();
    const site = {
      id: siteDoc.id,
      ...data,
      images: Array.isArray(data.images) ? data.images.map(img => 
        typeof img === 'string' ? { url: img, name: 'image', type: 'image/jpeg' } : img
      ) : [],
      videos: Array.isArray(data.videos) ? data.videos.map(vid => 
        typeof vid === 'string' ? { url: vid, name: 'video', type: 'video/mp4' } : vid
      ) : []
    };
    
    return site;
    
  } catch (error) {
    throw new Error(`فشل في جلب الموقع: ${error.message}`);
  }
};

export const getAllTourismSites = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'tourismSites'));
    const sites = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      sites.push({
        id: doc.id,
        ...data,
        images: Array.isArray(data.images) ? data.images.map(img => 
          typeof img === 'string' ? { url: img, name: 'image', type: 'image/jpeg' } : img
        ) : [],
        videos: Array.isArray(data.videos) ? data.videos.map(vid => 
          typeof vid === 'string' ? { url: vid, name: 'video', type: 'video/mp4' } : vid
        ) : []
      });
    });
    
    return sites;
    
  } catch (error) {
    throw new Error(`فشل في جلب المواقع: ${error.message}`);
  }
};

export const getTourismSitesByCategory = async (category) => {
  try {
    const q = query(collection(db, 'tourismSites'), where('category', '==', category));
    const querySnapshot = await getDocs(q);
    const sites = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      sites.push({
        id: doc.id,
        ...data
      });
    });
    
    return sites;
  } catch (error) {
    throw new Error(`فشل في جلب المواقع: ${error.message}`);
  }
};

const imageCache = new Map();
const mediaFilesCache = new Map();
let cacheTimeout = null;

const clearCache = () => {
  imageCache.clear();
  mediaFilesCache.clear();
};

const setupCacheCleanup = () => {
  if (cacheTimeout) {
    clearTimeout(cacheTimeout);
  }
  
  cacheTimeout = setTimeout(() => {
    clearCache();
    setupCacheCleanup(); // نعيييد جدولة التنظيف
  }, 600000); // 10 دقائق
};

setupCacheCleanup();

export const getImagesFromMediaFiles = async (siteId, category) => {
  try {
    const cacheKey = `${category}_${siteId || 'all'}`;
    if (mediaFilesCache.has(cacheKey)) {
      const cached = mediaFilesCache.get(cacheKey);
      if (Date.now() - cached.timestamp < 300000) { // 5 دقائق
        return cached.data;
      }
    }

    let mediaQuery = query(
      collection(db, 'mediaFiles'), 
      where('category', '==', category)
    );
    
    let mediaSnapshot = await getDocs(mediaQuery);
    
    if (mediaSnapshot.empty) {
      console.log("No images found with category filter, trying without filter...");
      mediaQuery = query(collection(db, 'mediaFiles'));
      mediaSnapshot = await getDocs(mediaQuery);
    }
    
    const images = [];
    mediaSnapshot.forEach((doc) => {
      const data = doc.data();
      
      if (data.base64 || data.url) {
        images.push({
          id: doc.id,
          url: data.base64 || data.url,
          thumbnail: data.thumbnail,
          originalName: data.originalName,
          type: data.type,
          category: data.category,
          folder: data.folder,
          firestoreId: doc.id
        });
      }
    });
    
    mediaFilesCache.set(cacheKey, {
      data: images,
      timestamp: Date.now()
    });
    
    console.log(`Total images found in mediaFiles: ${images.length}`);
    return images;
  } catch (error) {
    console.error("Error fetching images from mediaFiles:", error);
    return [];
  }
};

const processImages = (data, allMediaImages = []) => {
  let processedImages = [];
  
  if (Array.isArray(data.images)) {
    processedImages = data.images.map(img => {
      if (typeof img === 'string') {
        return { url: img };
      } else if (img && typeof img === 'object') {
        return {
          url: img.url || img.base64 || img.downloadURL,
          storagePath: img.storagePath,
          id: img.id,
          ...img
        };
      }
      return null;
    }).filter(Boolean);
  } else if (data.images && typeof data.images === 'object') {
    Object.values(data.images).forEach(img => {
      if (typeof img === 'string') {
        processedImages.push({ url: img });
      } else if (img && img.url) {
        processedImages.push(img);
      }
    });
  }

  
  return processedImages;
};

export const onTourismSitesByCategoryChange = (category, callback) => {
  const q = query(collection(db, 'tourismSites'), where('category', '==', category));
  
  let allMediaImages = [];
  let isFirstLoad = true;
  let lastProcessedData = null;
  
  const unsubscribe = onSnapshot(q, async (querySnapshot) => {
    const sites = [];
    
    if (isFirstLoad || allMediaImages.length === 0) {
      try {
        allMediaImages = await getImagesFromMediaFiles(null, category);
        isFirstLoad = false;
      } catch (error) {
        console.warn("Failed to load media images:", error);
        allMediaImages = [];
      }
    }
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      const processedImages = processImages(data, allMediaImages);
      
      let processedVideos = [];
      if (Array.isArray(data.videos)) {
        processedVideos = data.videos.map(vid =>
          typeof vid === 'string' ? { url: vid } : vid
        );
      }
      
      sites.push({
        id: doc.id,
        ...data,
        images: processedImages,
        videos: processedVideos,
        details: data.details || []
      });
    });
    
    const currentDataString = JSON.stringify(sites.map(site => ({ 
      id: site.id, 
      images: site.images,
      rating: site.rating,
      reviewsCount: site.reviewsCount
    })));
    
    if (currentDataString !== lastProcessedData) {
      lastProcessedData = currentDataString;
      callback(sites, null);
    }
  }, (error) => {
    console.error("Error listening to tourism sites:", error);
    callback(null, error);
  });
  
  return unsubscribe;
};

export const clearImageCache = () => {
  clearCache();
  console.log("Image cache cleared");
};

export const getCacheStatus = () => {
  return {
    imageCacheSize: imageCache.size,
    mediaFilesCacheSize: mediaFilesCache.size,
    cacheEntries: Array.from(mediaFilesCache.entries()).map(([key, value]) => ({
      key,
      timestamp: value.timestamp,
      age: Date.now() - value.timestamp
    }))
  };
};

export const deleteTourismSite = async (siteId) => {
  try {
    const siteDoc = await getDoc(doc(db, 'tourismSites', siteId));
    
    if (!siteDoc.exists()) {
      throw new Error('الموقع السياحي غير موجود');
    }
    
    const siteData = siteDoc.data();
    
    const allFiles = [
      ...(siteData.images || []),
      ...(siteData.videos || []),
      ...(siteData.details || []).flatMap(detail => detail.images || [])
    ];
    
    const deletePromises = allFiles.map(async (file) => {
      if (file.storagePath) {
        try {
          await deleteFileFromFirebaseStorage(file.storagePath);
        } catch (error) {
          console.warn(`لم يتم العثور على الملف ${file.storagePath} أو تم حذفه مسبقاً`);
        }
      }
    });
    
    await Promise.allSettled(deletePromises);
    
    await deleteDoc(doc(db, 'tourismSites', siteId));
    
    return { 
      success: true, 
      id: siteId,
      message: 'تم حذف الموقع بنجاح'
    };
    
  } catch (error) {
    if (error.code === 'not-found') {
      throw new Error('الموقع السياحي غير موجود');
    } else {
      throw new Error(`فشل في حذف الموقع: ${error.message}`);
    }
  }
};

export const cleanupOrphanedFiles = async () => {
  try {
    const filesSnapshot = await getDocs(collection(db, 'mediaFiles'));
    const sitesSnapshot = await getDocs(collection(db, 'tourismSites'));
    
    const usedFileIds = new Set();
    
    sitesSnapshot.forEach((doc) => {
      const data = doc.data();
      const images = data.images || [];
      const videos = data.videos || [];
      
      [...images, ...videos].forEach(media => {
        if (media.id) usedFileIds.add(media.id);
      });
    });
    
    let deletedCount = 0;
    for (const fileDoc of filesSnapshot.docs) {
      if (!usedFileIds.has(fileDoc.id)) {
        await deleteDoc(fileDoc.ref);
        deletedCount++;
      }
    }
    
    return { success: true, deletedCount };
    
  } catch (error) {
    throw new Error(`فشل في التنظيف: ${error.message}`);
  }
};

export const testStorageConnection = async () => {
  return await testFirebaseStorageConnection();
};

export const refreshImageUrls = async (siteId) => {
  try {
    const siteDoc = await getDoc(doc(db, 'tourismSites', siteId));
    
    if (!siteDoc.exists()) {
      throw new Error('الموقع السياحي غير موجود');
    }
    
    const siteData = siteDoc.data();
    const updatedImages = [];
    const updatedVideos = [];
    
    if (siteData.images) {
      for (const image of siteData.images) {
        if (image.storagePath) {
          try {
            const newUrl = await getSafeImageUrl(image.storagePath);
            updatedImages.push({
              ...image,
              url: newUrl || image.url
            });
          } catch (error) {
            updatedImages.push(image);
          }
        } else {
          updatedImages.push(image);
        }
      }
    }
    
    if (siteData.videos) {
      for (const video of siteData.videos) {
        if (video.storagePath) {
          try {
            const newUrl = await getSafeImageUrl(video.storagePath);
            updatedVideos.push({
              ...video,
              url: newUrl || video.url
            });
          } catch (error) {
            updatedVideos.push(video);
          }
        } else {
          updatedVideos.push(video);
        }
      }
    }
    
    await updateDoc(doc(db, 'tourismSites', siteId), {
      images: updatedImages,
      videos: updatedVideos,
      updatedAt: serverTimestamp()
    });
    
    return { success: true, updatedImages: updatedImages.length, updatedVideos: updatedVideos.length };
    
  } catch (error) {
    throw new Error(`فشل في تحديث الروابط: ${error.message}`);
  }
};

const TOURISM_COLLECTIONS = {
  CAFES: 'cafes',
  DAMS: 'dams',
  PARKS: 'parks',
  HOUSING: 'housing',
  VIEWPOINTS: 'viewpoints',
  FARMS: 'farms'
};

export const getTourismSites = async (category, lastDoc = null, pageSize = 10) => {
  try {
    const collectionRef = collection(db, TOURISM_COLLECTIONS[category]);
    let q = query(
      collectionRef,
      where('isActive', '==', true),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);
    const sites = [];
    snapshot.forEach(doc => {
      sites.push({ id: doc.id, ...doc.data() });
    });

    return {
      sites,
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
      hasMore: snapshot.docs.length === pageSize
    };
  } catch (error) {
    console.error('Error fetching tourism sites:', error);
    throw error;
  }
};

export const createTourismSite = async (category, siteData) => {
  try {
    const collectionRef = collection(db, TOURISM_COLLECTIONS[category]);
    const newSite = {
      ...siteData,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collectionRef, newSite);
    return { id: docRef.id, ...newSite };
  } catch (error) {
    console.error('Error creating tourism site:', error);
    throw error;
  }
};

export const uploadTourismSiteMedia = async (files, category, siteId) => {
  try {
    const results = [];
    for (const file of files) {
      const path = `tourismSites/${category}/${siteId}`;
      const url = await uploadFileToFirebaseStorage(file, path);
      results.push(url);
    }
    return results;
  } catch (error) {
    throw new Error(`فشل في رفع الملفات: ${error.message}`);
  }
};

export default {
  getTourismSites,
  getTourismSiteById,
  createTourismSite,
  updateTourismSite,
  deleteTourismSite,
  uploadTourismSiteMedia
};