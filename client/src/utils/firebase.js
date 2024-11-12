// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: "task-manager-944e8.firebaseapp.com",
  projectId: "task-manager-944e8",
  storageBucket: "task-manager-944e8.firebasestorage.app",
  messagingSenderId: "861397065690",
  appId: "1:861397065690:web:facc9252c737dacbf1eae3",
  measurementId: "G-YKWYYK4XNP"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);