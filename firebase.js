// ===============================
// Firebase App
// ===============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

// ===============================
// Firebase Authentication
// ===============================

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// ===============================
// Firestore
// ===============================

import {

    getFirestore,
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    deleteDoc,
    setDoc,
    query,
    where,
    serverTimestamp,
    updateDoc

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ===============================
// Firebase Config
// ===============================

const firebaseConfig = {

    apiKey: "AIzaSyCDCMk0kYrdG7DUtkeiz68YAp9S57ECwjk",

    authDomain: "the-quiet-shelf-630ff.firebaseapp.com",

    projectId: "the-quiet-shelf-630ff",

    storageBucket: "the-quiet-shelf-630ff.firebasestorage.app",

    messagingSenderId: "153731099284",

    appId: "1:153731099284:web:d1e732164a552d57b72281"

};

// ===============================
// Initialize Firebase
// ===============================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

// ===============================
// Check Login
// ===============================

function checkLogin(callback) {

    onAuthStateChanged(auth, (user) => {

        callback(user);

    });

}

// ===============================
// Exports
// ===============================

export {

    auth,
    db,

    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    deleteDoc,

    setDoc,
    query,
    where,
    serverTimestamp,
    updateDoc,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,

    checkLogin

};