// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyD0CRR91xouZTsdhKjuN6vBSzG3sSi5Siw",
  authDomain: "tokritrack.firebaseapp.com",
  projectId: "tokritrack",
  storageBucket: "tokritrack.firebasestorage.app",
  messagingSenderId: "453464004628",
  appId: "1:453464004628:web:f85ac58f69e51165ad6f01",
  measurementId: "G-3DCKVWZW02",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
