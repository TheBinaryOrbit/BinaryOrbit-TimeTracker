// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9nn-WZjoykzURDmQ6LJUILRimJAq-RzM",
  authDomain: "timetracker-5292e.firebaseapp.com",
  projectId: "timetracker-5292e",
  storageBucket: "timetracker-5292e.firebasestorage.app",
  messagingSenderId: "761635199570",
  appId: "1:761635199570:web:124027d4645fcd82e7dd8b",
  measurementId: "G-FBCLR0791K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
