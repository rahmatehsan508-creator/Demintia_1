import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration provided for monorom-sih
export const firebaseConfig = {
  apiKey: "AIzaSyDctzwm34HqtwwFSYsDxxX_uNKl3H_0v0k",
  authDomain: "monorom-sih.firebaseapp.com",
  projectId: "monorom-sih",
  storageBucket: "monorom-sih.firebasestorage.app",
  messagingSenderId: "161447121102",
  appId: "1:161447121102:web:9219e3d4be0f522596009f"
};

// Initialize Firebase App singleton
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore with default database
export const db = getFirestore(app);
