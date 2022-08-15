// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase } from "firebase/database";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKNiD--qZGBgu1kHBMG-lOLEB5oDUhL0E",
  authDomain: "resume-20222.firebaseapp.com",
  databaseURL: "https://resume-20222-default-rtdb.firebaseio.com",
  projectId: "resume-20222",
  storageBucket: "resume-20222.appspot.com",
  messagingSenderId: "1089096627239",
  appId: "1:1089096627239:web:be960254ca7170fa0cca02"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default app;
export { db };
