import firebase from 'firebase/app'
import 'firebase/firestore'
require('firebase/auth')

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBn2r9PKB-h2aNguVob6_sNNRzqhfUo23I",
  authDomain: "rowing-logbook.firebaseapp.com",
  projectId: "rowing-logbook",
  storageBucket: "rowing-logbook.appspot.com",
  messagingSenderId: "158443175207",
  appId: "1:158443175207:web:ebf6bb46a3f0ee98ec7d02",
  measurementId: "G-2VPTHNHZKZ"
};


firebase.initializeApp(firebaseConfig);
const db = firebase.firestore()

export default db;
