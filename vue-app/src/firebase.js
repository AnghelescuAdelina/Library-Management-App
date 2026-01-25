import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "library-management-app-6ac31.firebaseapp.com",
  projectId: "library-management-app-6ac31",
  storageBucket: "library-management-app-6ac31.firebasestorage.app",
  messagingSenderId: "493530109568",
  appId: "1:493530109568:web:277c29419e9d12739c7865",
  measurementId: "G-H9GKKXWN8P"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);