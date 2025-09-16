
// firebaseConfig.js (app\firebase\firebaseConfig.js)
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBHG0vGAVFJfY1d6hGT6I3ghIwF5nZBOE",
  authDomain: "digilex-website-1a689.firebaseapp.com",
  databaseURL: "https://digilex-website-1a689-default-rtdb.firebaseio.com",
  projectId: "digilex-website-1a689",
  storageBucket: "digilex-website-1a689.firebasestorage.app",
  messagingSenderId: "971153506528",
  appId: "1:971153506528:web:c535a9dac87b4d33391085",
  measurementId: "G-R5HGWP5KXE"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Export the services
export { db, auth, storage };