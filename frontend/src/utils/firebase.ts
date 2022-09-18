// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDvsdg2HuU3Z1s8hlGNftj7BkpHWdYl3W4",
  authDomain: "hack-the-north-2022-91c90.firebaseapp.com",
  databaseURL: "https://hack-the-north-2022-91c90-default-rtdb.firebaseio.com",
  projectId: "hack-the-north-2022-91c90",
  storageBucket: "hack-the-north-2022-91c90.appspot.com",
  messagingSenderId: "655955762078",
  appId: "1:655955762078:web:87a5548f99382a0435d48f",
  measurementId: "G-09WR0HTZ66"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const storage = getStorage(app);
export const db = getDatabase(app);