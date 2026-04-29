import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const isConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

const app = isConfigured ? initializeApp(firebaseConfig) : null;
export const auth = isConfigured && app ? getAuth(app) : null;
export const db = isConfigured && app ? getFirestore(app) : null;
