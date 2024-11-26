import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getErrorMessage } from './utils/errorHandler';

const firebaseConfig = {
  apiKey: "AIzaSyAdu6O89smHRP58od56lhM4bxz0ESZ9828",
  authDomain: "paperless-929ca.firebaseapp.com",
  projectId: "paperless-929ca",
  storageBucket: "paperless-929ca.firebasestorage.app",
  messagingSenderId: "82957650574",
  appId: "1:82957650574:web:f2b316b9a25881c0a8d7df",
  measurementId: "G-3FWGPYR65M"
};

let db;

try {
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  db = getFirestore(app);
  
  // Enable offline persistence
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.error('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.error('The current browser doesn\'t support persistence.');
    }
  });
} catch (error) {
  console.error('Error initializing Firebase:', getErrorMessage(error));
}

export { db };