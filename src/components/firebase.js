import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyDi6Z5riiOguP6tE430iRR7FfkPSNq1B_A",
    authDomain: "cassaemersav3.firebaseapp.com",
    databaseURL: "https://cassaemersav3-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "cassaemersav3",
    storageBucket: "cassaemersav3.firebasestorage.app",
    messagingSenderId: "782121226971",
    appId: "1:782121226971:web:80473f6dfc0883a37472fe",
    measurementId: "G-T18PFJLHNV"
  };

// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
