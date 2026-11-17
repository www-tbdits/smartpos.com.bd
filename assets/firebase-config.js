
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAdUP4Fn8ZbI35cEnJhwe6cWuEBNCL-zsI",
  authDomain: "smartpos-ce73b.firebaseapp.com",
  projectId: "smartpos-ce73b",
  storageBucket: "smartpos-ce73b.firebasestorage.app",
  messagingSenderId: "270050157550",
  appId: "1:270050157550:web:0aa0de94f897f275f024ff",
  measurementId: "G-GJSMCWXN1Z"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
