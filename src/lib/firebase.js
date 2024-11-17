import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'


const API_KEY = import.meta.env.VITE_API_KEY

const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: "reactchat-a4700.firebaseapp.com",
    projectId: "reactchat-a4700",
    storageBucket: "reactchat-a4700.firebasestorage.app",
    messagingSenderId: "845845718635",
    appId: "1:845845718635:web:2fec37cd14dbe3eee8f32e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();