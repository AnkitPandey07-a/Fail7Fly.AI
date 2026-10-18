// Firebase App
import { initializeApp } from "firebase/app";

// Firebase Authentication
import {
    getAuth,
    GoogleAuthProvider,
} from "firebase/auth";


// Firebase Configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    authDomain: "mais-72bd8.firebaseapp.com",
    projectId: "mais-72bd8",
    storageBucket: "mais-72bd8.firebasestorage.app",
    messagingSenderId: "160916656496",
    appId: "1:160916656496:web:6fb69fbab5e8490e46ffb5",
    measurementId: "G-WWYXVRL9SM",
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Firebase Authentication
const auth = getAuth(app);


// Google Authentication Provider
const provider = new GoogleAuthProvider();


// Export
export {
    auth,
    provider,
};