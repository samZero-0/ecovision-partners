
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDGhRaXDWGe5d9n6KeZlHNkfuN58KRq0gQ",
  authDomain: "job-portal-b60db.firebaseapp.com",
  projectId: "job-portal-b60db",
  storageBucket: "job-portal-b60db.firebasestorage.app",
  messagingSenderId: "575516681600",
  appId: "1:575516681600:web:74c5c01cee20ba0e384d65"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
