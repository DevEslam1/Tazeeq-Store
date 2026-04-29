import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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

// Export services for use in the app
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
