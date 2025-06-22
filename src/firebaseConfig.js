// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: "AIzaSyCFy5zsT9xCuMVUOSiP2G67OQFlvdZmzWQ",
  authDomain: "bannihassan-e4c61.firebaseapp.com",
  projectId: "bannihassan-e4c61",
  storageBucket: "bannihassan-e4c61.firebasestorage.app",
  messagingSenderId: "975852957032",
  appId: "1:975852957032:web:336ccde466b4596f57badd",
  measurementId: "G-HHV25YSR6R"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
