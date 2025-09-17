// app/firebase/firebaseConfig.js
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

/*
  NOTE: I changed storageBucket to the typical format:
  "<project-id>.appspot.com"
  (if your original bucket is correct for your Firebase project, keep it)
*/
const firebaseConfig = {
  apiKey: "AIzaSyCBHG0vGAVFJfY1d6hGT6I3ghIwF5nZBOE",
  authDomain: "digilex-website-1a689.firebaseapp.com",
  databaseURL: "https://digilex-website-1a689-default-rtdb.firebaseio.com",
  projectId: "digilex-website-1a689",
  storageBucket: "digilex-website-1a689.appspot.com", // updated
  messagingSenderId: "971153506528",
  appId: "1:971153506528:web:c535a9dac87b4d33391085",
  measurementId: "G-R5HGWP5KXE"
};

// initialize app only once (prevents multiple-inits during hot reload)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Firestore / Auth / Storage
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// small debug log (remove if you don't want console output)
if (__DEV__) {
  console.log("[firebaseConfig] Firebase initialized for project:", firebaseConfig.projectId);
}

export { app, db, auth, storage };
