// خدمة التخزين اللوكال للتطوير -عشان نتجنب المشاكل CORS
import { getAuth } from 'firebase/auth';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];


const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

/**
 * رفع ملف واحد للتطوير المحلي (Base64)
 */
export const uploadFileLocally = async (file, folder = 'tourismSites/images') => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('يجب تسجيل الدخول أولاً لرفع الملفات');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error('حجم الملف كبير جداً. الحد الأقصى 10 ميجابايت.');
    }

    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
    if (!isImage && !isVideo) {
      throw new Error('نوع الملف غير مدعوم. يُسمح بالصور والمقاطع المرئية فقط.');
    }

    const base64Data = await fileToBase64(file);
    
    const fileId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      id: fileId,
      url: base64Data, 
      name: file.name,
      type: file.type,
      size: file.size,
      storagePath: `local/${folder}/${fileId}_${file.name}`,
      storageRef: `${fileId}_${file.name}`,
      folder: folder,
      uploadedAt: new Date().toISOString(),
      uploadedBy: user.email || user.uid,
      isLocalStorage: true,
      isBase64: true
    };
    
  } catch (error) {
    throw new Error(`فشل في رفع الملف محلياً: ${error.message}`);
  }
};


export const uploadMultipleFilesLocally = async (files, folder = 'tourismSites/images') => {
  const results = [];
  const errors = [];
  
  for (let i = 0; i < files.length; i++) {
    try {
      const file = files[i];
      
      const result = await uploadFileLocally(file, folder);
      results.push(result);
      
    } catch (error) {
      errors.push({ 
        fileName: files[i].name, 
        error: error.message,
        index: i
      });
    }
  }
  
  return { 
    results, 
    errors,
    totalFiles: files.length,
    successCount: results.length,
    errorCount: errors.length
  };
};


export const testLocalStorage = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('يجب تسجيل الدخول أولاً لاختبار التخزين المحلي');
    }
    
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(0, 0, 1, 1);
    
    const testBlob = await new Promise(resolve => {
      canvas.toBlob(resolve, 'image/png');
    });
    
    const testFile = new File([testBlob], 'test-local.png', { type: 'image/png' });
    
    const result = await uploadFileLocally(testFile, 'test');
    
    return { 
      success: true, 
      message: 'التخزين المحلي متاح ويعمل بشكل صحيح',
      testUrl: result.url,
      user: user.email || user.uid,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      message: `فشل في التخزين المحلي: ${error.message}`,
      timestamp: new Date().toISOString()
    };
  }
};

export const saveToLocalStorage = async (file) => {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 10MB limit');
  }

  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

  if (!isImage && !isVideo) {
    throw new Error('Invalid file type');
  }

  const base64Data = await convertToBase64(file);
  const id = generateUniqueId();

  const fileData = {
    id,
    name: file.name,
    type: file.type,
    size: file.size,
    url: base64Data,
    createdAt: new Date().toISOString()
  };

  const storageKey = isImage ? 'localImages' : 'localVideos';
  const existingFiles = JSON.parse(localStorage.getItem(storageKey) || '[]');
  existingFiles.push(fileData);
  localStorage.setItem(storageKey, JSON.stringify(existingFiles));

  return fileData;
};

export const getFromLocalStorage = (type = 'image') => {
  const storageKey = type === 'image' ? 'localImages' : 'localVideos';
  return JSON.parse(localStorage.getItem(storageKey) || '[]');
};

export const deleteFromLocalStorage = (id, type = 'image') => {
  const storageKey = type === 'image' ? 'localImages' : 'localVideos';
  const files = JSON.parse(localStorage.getItem(storageKey) || '[]');
  const updatedFiles = files.filter(file => file.id !== id);
  localStorage.setItem(storageKey, JSON.stringify(updatedFiles));
  return true;
};

export const clearLocalStorage = (type = 'image') => {
  const storageKey = type === 'image' ? 'localImages' : 'localVideos';
  localStorage.removeItem(storageKey);
  return true;
};

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const createTestImage = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 0, 100, 100);
  ctx.fillStyle = '#333';
  ctx.font = '20px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Test', 50, 50);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const file = new File([blob], 'test-image.png', { type: 'image/png' });
      resolve(file);
    }, 'image/png');
  });
};

export default {
  uploadFileLocally,
  uploadMultipleFilesLocally,
  testLocalStorage,
  saveToLocalStorage,
  getFromLocalStorage,
  deleteFromLocalStorage,
  clearLocalStorage,
  createTestImage
}; 