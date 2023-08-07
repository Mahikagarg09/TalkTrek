import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";



const firebaseConfig = {
  apiKey: "AIzaSyAE-NgteqqcqIE-j7kpL10jljhfm45mYN8",
  authDomain: "talktrek-a976c.firebaseapp.com",
  projectId: "talktrek-a976c",
  storageBucket: "talktrek-a976c.appspot.com",
  messagingSenderId: "559410214981",
  appId: "1:559410214981:web:1e7fc89fd556fd74f70b2c",
  measurementId: "G-REVGQS4BMW"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);


export const provider = new GoogleAuthProvider();

