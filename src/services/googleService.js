import app from '../firebaseConfig'; 
import { getFunctions, httpsCallable } from 'firebase/functions';

export const handleGooglePlaceInfo = async (googleMapsUrl) => {
  if (!validateGoogleMapsUrl(googleMapsUrl)) {
    return createDefaultResponse({ message: 'رابط Google Maps غير صالح' });
  }

  try {
    const functions = getFunctions(app, 'europe-west1'); 
    const getGooglePlaceDetails = httpsCallable(functions, 'getGooglePlaceDetails');
    
    const response = await getGooglePlaceDetails({ url: googleMapsUrl });
    const apiData = response.data;

    return {
      name: apiData.name || cleanPlaceName(extractPlaceName(googleMapsUrl)) || 'موقع سياحي',
      rating: apiData.rating,
      reviewsCount: apiData.reviewsCount,
      coordinates: apiData.coordinates,
      success: true,
      source: 'api',
      message: 'تم جلب معلومات المكان بنجاح من Google API.'
    };
  } catch (error) {
    const coordinates = extractCoordinates(googleMapsUrl);
    const placeName = cleanPlaceName(extractPlaceName(googleMapsUrl));
    const defaultData = generateRealisticRating(coordinates);
    
    return createDefaultResponse({
      name: placeName,
      ...defaultData,
      coordinates,
      message: 'فشل جلب البيانات الدقيقة. تم استخدام معلومات تقديرية.',
    });
  }
};


function createDefaultResponse(overrides = {}) {
  return {
    name: 'موقع سياحي',
    rating: '4.1', 
    reviewsCount: '15',
    coordinates: null,
    success: true, 
    isDefault: true,
    source: 'default',
    message: 'تم استخدام معلومات افتراضية.',
    ...overrides,
  };
}

function extractCoordinates(url) {
  const patterns = [
      /@(-?\d+\.?\d*),(-?\d+\.?\d*)/,
      /!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
  }
  return null;
}

function extractPlaceName(url) {
    const match = url.match(/\/place\/([^\/\?@]+)/);
    return match ? match[1] : null;
}

function cleanPlaceName(name) {
  return name ? decodeURIComponent(name).replace(/\+/g, ' ') : null;
}

function generateRealisticRating(coords) {
  if (!coords) return { rating: '4.2', reviewsCount: '30' };
  const seed = Math.abs((coords.lat || 0) + (coords.lng || 0));
  return {
    rating: (3.8 + (seed % 1.2)).toFixed(1),
    reviewsCount: Math.floor(15 + (seed * 100) % 150).toString(),
  };
}

export function validateGoogleMapsUrl(url) {
    if (!url) return false;
    return /google.*maps/.test(url);
}

const functions = getFunctions(app, 'europe-west1');

export const getPlaceDetails = async (placeId) => {
  try {
    const getPlaceDetailsFunction = httpsCallable(functions, 'getPlaceDetails');
    const result = await getPlaceDetailsFunction({ placeId });
    return result.data;
  } catch (error) {
    console.error('Error getting place details:', error);
    return {
      name: '',
      address: '',
      rating: '4.1',
      reviews: [],
      photos: []
    };
  }
};

export const searchNearbyPlaces = async (location, radius = 5000, type = 'tourist_attraction') => {
  try {
    const searchNearbyFunction = httpsCallable(functions, 'searchNearbyPlaces');
    const result = await searchNearbyFunction({
      location,
      radius,
      type
    });
    return result.data;
  } catch (error) {
    console.error('Error searching nearby places:', error);
    return [];
  }
};

export const getPlacePhotos = async (placeId) => {
  try {
    const getPlacePhotosFunction = httpsCallable(functions, 'getPlacePhotos');
    const result = await getPlacePhotosFunction({ placeId });
    return result.data;
  } catch (error) {
    console.error('Error getting place photos:', error);
    return [];
  }
};

export default {
  handleGooglePlaceInfo,
  validateGoogleMapsUrl,
  getPlaceDetails,
  searchNearbyPlaces,
  getPlacePhotos
};
