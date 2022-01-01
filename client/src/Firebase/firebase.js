// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAKpJ94ci7CytwBZjeJTEK8176svyK4JZg",
    authDomain: "jobprofilepagepurple.firebaseapp.com",
    projectId: "jobprofilepagepurple",
    storageBucket: "jobprofilepagepurple.appspot.com",
    messagingSenderId: "518522832417",
    appId: "1:518522832417:web:c69aaf48bdbd46e8f70560",
    measurementId: "G-MBT08NEWSE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const storage = getStorage();

export { app, auth, storage };