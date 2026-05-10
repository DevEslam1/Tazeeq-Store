import { initializeApp, getApps, getApp } from "firebase/app";
// @ts-ignore - Some versions of the Firebase SDK have resolution issues with RN types
import { initializeAuth, getReactNativePersistence, getAuth, Auth } from "firebase/auth";
import { initializeFirestore, getFirestore, Firestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration from USER
const firebaseConfig = {
  apiKey: "AIzaSyCXnsxvseaywL16t_TDs274FBCgmAf1guo",
  authDomain: "tazeeq-e842e.firebaseapp.com",
  databaseURL: "https://tazeeq-e842e-default-rtdb.firebaseio.com",
  projectId: "tazeeq-e842e",
  storageBucket: "tazeeq-e842e.firebasestorage.app",
  messagingSenderId: "419195139011",
  appId: "1:419195139011:web:4ca09efa8977899c5f0376",
  measurementId: "G-PNDZKGKHXY"
};

// Initialize Firebase safely for hot-reloading
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth safely
let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (error: any) {
  // If already initialized during hot reload, get the existing instance
  if (error.code === 'auth/already-initialized') {
    auth = getAuth(app);
  } else {
    throw error;
  }
}

// Initialize Firestore safely
let db: Firestore;
try {
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  });
} catch (error: any) {
  // If already initialized during hot reload
  db = getFirestore(app);
}

export { auth, db };
export const functions = getFunctions(app);

export default app;
