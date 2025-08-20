// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzCP1CAZ9Au2WHUdJ0D16Q6bURi_GCVTo",
  authDomain: "terradues-final-48dd3.firebaseapp.com",
  projectId: "terradues-final-48dd3",
  storageBucket: "terradues-final-48dd3.firebasestorage.app",
  messagingSenderId: "54422596745",
  appId: "1:54422596745:web:5abff164300f272c57aa58",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
