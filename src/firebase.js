// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth , GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyButxtvkLy_SG0_uEXhhIP3OMIrmYe50Lk",
  authDomain: "dashfinancial-5735c.firebaseapp.com",
  projectId: "dashfinancial-5735c",
  storageBucket: "dashfinancial-5735c.firebasestorage.app",
  messagingSenderId: "1002784659229",
  appId: "1:1002784659229:web:25c6d2588a3b0927f833f4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);