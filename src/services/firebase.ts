import { initializeApp } from "firebase/app";
// @ts-ignore - Some versions of the Firebase SDK have resolution issues with RN types
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);
export const functions = getFunctions(app);

export default app;
