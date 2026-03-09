import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJjAV4U1rX6wUCBopaALGiafIsrhklKhk",
  authDomain: "my-mobile-portfolio.firebaseapp.com",
  projectId: "my-mobile-portfolio",
  storageBucket: "my-mobile-portfolio.firebasestorage.app",
  messagingSenderId: "99328057408",
  appId: "1:99328057408:web:8984092cfbb55e2717bfa5",
  measurementId: "G-MV1F8TZ504"
};

const app = initializeApp(firebaseConfig);

// ✅ This is the correct way for React Native / Expo
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});