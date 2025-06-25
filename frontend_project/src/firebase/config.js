// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyAixd8L20e1nkBCpv5URWlD1TzU1SHKY",
  authDomain: "projectfrontend-d510c.firebaseapp.com",
  projectId: "projectfrontend-d510c",
  storageBucket: "projectfrontend-d510c.appspot.com",
  messagingSenderId: "120115482248",
  appId: "1:120115482248:web:851094f8112c49cc23d93d",
  measurementId: "G-V2M52DRYSZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);
const db = getFirestore(app);

export { app, analytics, auth, db };