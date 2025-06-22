const functions = require("firebase-functions");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const admin = require("firebase-admin");
const axios = require("axios");
const nodemailer = require('nodemailer');

admin.initializeApp();

setGlobalOptions({ region: "europe-west1" });

exports.sendContactEmail = onCall(async (request) => {
    const email = process.env.GMAIL_EMAIL;
    const password = process.env.GMAIL_PASSWORD;

    if (!email || !password) {
        console.error("sendContactEmail called, but email service is not configured in Firebase.");
        throw new HttpsError('failed-precondition', 'The email service is not configured.');
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: email, pass: password }
    });

    const { name, fromEmail, message } = request.data;
    if (!name || !fromEmail || !message) {
        throw new HttpsError('invalid-argument', 'Request must include name, fromEmail, and message.');
    }

    const mailOptions = {
        from: email,
        to: 'ra20awn@gmail.com',
        subject: `رسالة جديدة من موقع بني حسن من ${name}`,
        html: `<p><b>الاسم:</b> ${name}</p>
               <p><b>البريد الإلكتروني:</b> ${fromEmail}</p>
               <p><b>الرسالة:</b></p>
               <p>${message}</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true, message: 'Email sent successfully!' };
    } catch (error) {
        console.error('Error sending email:', error);
        throw new HttpsError('internal', 'Failed to send email.', error.message);
    }
});

const extractPlaceId = (url) => {
  console.log(`--- 🔍 Inside extractPlaceId with URL: ${url}`);
  if (!url) {
    console.log("-> URL is null or empty, returning null.");
    return null;
  }

  const decodedUrl = decodeURIComponent(url);
  console.log(`-> Decoded URL: ${decodedUrl}`);

  const patterns = [
    {
      name: "Direct place_id parameter",
      regex: /[?&]place_id=([A-Za-z0-9_-]+)/,
      group: 1
    },
    {
      name: "!1s format in data parameter",
      regex: /!1s(0x[a-f0-9]+:0x[a-f0-9]+)/i,
      group: 1
    },
    {
      name: "ftid parameter",
      regex: /[?&]ftid=(0x[a-f0-9]+:0x[a-f0-9]+)/i,
      group: 1
    },
    {
      name: "cid parameter (Customer ID)",
      regex: /[?&]cid=(\d{14,20})/,
      group: 1
    },
    {
      name: "ludocid parameter", 
      regex: /[?&]ludocid=(\d{14,20})/,
      group: 1
    },
    {
      name: "Hex format in data parameter",
      regex: /data=[^&]*?(0x[a-f0-9]{8,}:0x[a-f0-9]{8,})/i,
      group: 1
    },
    {
      name: "Place URL with coordinates",
      regex: /\/place\/[^\/]*\/@[0-9.-]+,[0-9.-]+[^\/]*\/data=[^&]*?(0x[a-f0-9]+:0x[a-f0-9]+)/i,
      group: 1
    },
    {
      name: "Search results format",
      regex: /\/search\/[^\/]*\/data=[^&]*?(0x[a-f0-9]+:0x[a-f0-9]+)/i,
      group: 1
    },
    {
      name: "Business profile format",
      regex: /business\.google\.com.*[?&]fp=(\d{14,20})/,
      group: 1
    },
    {
      name: "Maps embed format",
      regex: /maps\/embed.*[?&]pb=[^&]*!2s(0x[a-f0-9]+:0x[a-f0-9]+)/i,
      group: 1
    },
    {
      name: "Short URL format (goo.gl/maps)",
      regex: /goo\.gl\/maps\/.*data=[^&]*?(0x[a-f0-9]+:0x[a-f0-9]+)/i,
      group: 1
    },
    {
      name: "Any hex pattern (fallback)",
      regex: /(0x[a-f0-9]{8,}:0x[a-f0-9]{8,})/i,
      group: 1
    }
  ];

  for (let i = 0; i < patterns.length; i++) {
    const pattern = patterns[i];
    console.log(`-> Trying pattern ${i + 1}: ${pattern.name}`);
    console.log(`   Regex: ${pattern.regex}`);
    
    const match = decodedUrl.match(pattern.regex);
    if (match && match[pattern.group]) {
      const placeId = match[pattern.group];
      console.log(`-> ✅ SUCCESS: Found Place ID with pattern "${pattern.name}": ${placeId}`);
      
      if (isValidPlaceId(placeId)) {
        console.log(`-> ✅ VALIDATED: Place ID is valid format`);
        return placeId;
      } else {
        console.log(`-> ⚠️ WARNING: Place ID failed validation, continuing to next pattern`);
      }
    }
  }

  console.log("-> Trying manual extraction from URL structure...");
  
  const manualPatterns = [
    /!4m\d+!1s(0x[a-f0-9]+:0x[a-f0-9]+)/i,
    /!3m\d+!1s(0x[a-f0-9]+:0x[a-f0-9]+)/i,
    /!2s(0x[a-f0-9]+:0x[a-f0-9]+)/i
  ];
  
  for (const manualPattern of manualPatterns) {
    const match = decodedUrl.match(manualPattern);
    if (match && match[1]) {
      console.log(`-> ✅ MANUAL SUCCESS: Found Place ID: ${match[1]}`);
      return match[1];
    }
  }

  console.log("-> ❌ COMPLETE FAILURE: No Place ID found in URL");
  return null;
};

const isValidPlaceId = (placeId) => {
  if (!placeId) return false;
  
  if (/^0x[a-f0-9]+:0x[a-f0-9]+$/i.test(placeId)) {
    return true;
  }
  
  if (/^[A-Za-z0-9_-]{10,}$/.test(placeId)) {
    return true;
  }
  
  if (/^\d{14,20}$/.test(placeId)) {
    return true;
  }
  
  return false;
};

exports.getGooglePlaceDetails = onCall(async (request) => {
  try {
    console.log("--- 🚀 getGooglePlaceDetails: Function triggered ---");

    const data = request.data;
    if (!data) {
      console.error("❌ ERROR: Request data object is missing.");
      throw new HttpsError("invalid-argument", "Request data is missing.");
    }
    
    const url = data.url;
    console.log(`Received URL: ${url}`);

    const API_KEY = process.env.GOOGLE_APIKEY;
    if (!API_KEY) {
      console.error("❌ ERROR: GOOGLE_APIKEY environment variable is not set.");
      throw new HttpsError('failed-precondition', 'The Google API key is not configured.');
    }
    console.log("✅ API Key loaded successfully.");

    if (!url) {
      console.error("❌ ERROR: URL is missing from request data.");
      throw new HttpsError("invalid-argument", "The function must be called with a 'url' property in the data object.");
    }

    const placeId = extractPlaceId(url);
    console.log(`--- 🔬 Result from extractPlaceId: [${placeId}] (Type: ${typeof placeId})`);

    if (!placeId) {
      console.error(`❌ ERROR: Place ID is null, empty, or undefined after extraction from URL: ${url}`);
      throw new HttpsError("not-found", `Could not extract a valid Place ID from the provided URL: ${url}`);
    }

    console.log(`✅ Extracted Place ID: ${placeId}`);

    const isHexFormat = /^0x[a-f0-9]+:0x[a-f0-9]+$/i.test(placeId);
    console.log(`🔍 Place ID format: ${isHexFormat ? 'HEX' : 'STANDARD'}`);

    let result;
    
    if (isHexFormat) {
      console.log("🔄 Using Text Search API for hex format Place ID");
      
      const coordMatch = url.match(/@([0-9.-]+),([0-9.-]+)/);
      if (!coordMatch) {
        throw new HttpsError("not-found", "Could not extract coordinates from URL");
      }
      
      const lat = coordMatch[1];
      const lng = coordMatch[2];
      console.log(`📍 Extracted coordinates: ${lat}, ${lng}`);
      
      const placeNameMatch = url.match(/\/place\/([^\/]+)\//);
      let placeName = "Unknown Place";
      
      if (placeNameMatch) {
        placeName = decodeURIComponent(placeNameMatch[1]).replace(/\+/g, ' ');
        placeName = placeName.replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\w\s]/g, '').trim();
        console.log(`🏷️ Extracted place name: ${placeName}`);
      }
      
      const textSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(placeName)}&location=${lat},${lng}&radius=1000&key=${API_KEY}&language=ar`;
      console.log(`📞 Calling Text Search API (key redacted): ${textSearchUrl.replace(API_KEY, '***')}`);
      
      const textSearchResponse = await axios.get(textSearchUrl);
      console.log(`✅ Text Search API responded with status: ${textSearchResponse.data.status}`);

      if (textSearchResponse.data.status !== "OK" || !textSearchResponse.data.results || textSearchResponse.data.results.length === 0) {
        console.log(`⚠️ Text Search failed, using extracted data as fallback`);
        result = {
          name: placeName,
          rating: null,
          reviewsCount: null,
          coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) },
          success: true,
          source: "url_extraction",
        };
      } else {
        const searchResult = textSearchResponse.data.results[0];
        console.log(`✅ Found place via Text Search: ${searchResult.name}`);
        
        let rating = searchResult.rating?.toString() || null;
        let reviewsCount = searchResult.user_ratings_total?.toString() || null;
        
        if (searchResult.place_id) {
          console.log(`🔄 Getting detailed info for Place ID: ${searchResult.place_id}`);
          try {
            const fields = "name,rating,user_ratings_total,geometry,place_id";
            const placesUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${searchResult.place_id}&fields=${fields}&key=${API_KEY}&language=ar`;
            const placesResponse = await axios.get(placesUrl);
            
            if (placesResponse.data.status === "OK" && placesResponse.data.result) {
              rating = placesResponse.data.result.rating?.toString() || rating;
              reviewsCount = placesResponse.data.result.user_ratings_total?.toString() || reviewsCount;
              console.log(`✅ Got detailed rating data: ${rating} stars, ${reviewsCount} reviews`);
            }
          } catch (error) {
            console.log(`⚠️ Places API failed for detailed info, using search result data`);
          }
        }

        result = {
          name: searchResult.name,
          rating: rating,
          reviewsCount: reviewsCount,
          coordinates: searchResult.geometry?.location || { lat: parseFloat(lat), lng: parseFloat(lng) },
          success: true,
          source: "text_search",
        };
      }

    } else {
      console.log("🔄 Using Places API for standard format Place ID");
      const fields = "name,rating,user_ratings_total,geometry,place_id";
      const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${API_KEY}&language=ar`;
      
      console.log(`📞 Calling Google Places API (key redacted): ${apiUrl.replace(API_KEY, '***')}`);
      const response = await axios.get(apiUrl);
      console.log(`✅ Google Places API responded with status: ${response.data.status}`);

      if (response.data.status !== "OK") {
        console.error(`❌ ERROR: Google API call failed with status: ${response.data.status} and message: ${response.data.error_message || ''}`);
        throw new HttpsError("internal", `Google Places API call failed: ${response.data.status}`);
      }

      const placesResult = response.data.result;
      result = {
        name: placesResult.name,
        rating: placesResult.rating?.toString() || null,
        reviewsCount: placesResult.user_ratings_total?.toString() || null,
        coordinates: placesResult.geometry?.location || null,
        success: true,
        source: "places",
      };
    }

    console.log(`✅ Successfully fetched data for: ${result.name}`);
    console.log("--- ✅ getGooglePlaceDetails: Function finished successfully ---");
    return result;

  } catch (error) {
    console.error("--- 💥 CATASTROPHIC ERROR in getGooglePlaceDetails 💥 ---");
    console.error("Error Code:", error.code || 'N/A');
    console.error("Error Message:", error.message);
    console.error("Stack Trace:", error.stack);
    
    if (error instanceof HttpsError) {
      throw error;
    } else {
      throw new HttpsError("internal", "An unexpected error occurred. Check the function logs for details.", error.message);
    }
  }
});
