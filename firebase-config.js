import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCF3bfXgl2p3UZgVcu-_7CM8euHEJl0nQE",
  authDomain: "clarita-web.firebaseapp.com",
  projectId: "clarita-web",
  storageBucket: "clarita-web.firebasestorage.app",
  messagingSenderId: "42426594212",
  appId: "1:42426594212:web:0a08df50e72e6de7b58731"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);