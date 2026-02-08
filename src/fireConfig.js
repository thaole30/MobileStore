// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore';
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgxKe-ABGu0DQ-pZu6tBr2G_T4x5WqR8E",
  authDomain: "mobile-shop-5ac92.firebaseapp.com",
  projectId: "mobile-shop-5ac92",
  storageBucket: "mobile-shop-5ac92.firebasestorage.app",
  messagingSenderId: "645333101312",
  appId: "1:645333101312:web:4d93a8b5b336a7b3a561e5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);