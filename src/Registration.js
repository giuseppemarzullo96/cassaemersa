import React, { useState, useEffect } from 'react';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCRApnfbvd1OtVaXLjrrABUcYvVGvta9GI",
    authDomain: "cassa-emersa2.firebaseapp.com",
    databaseURL: "https://cassa-emersa2-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "cassa-emersa2",
    storageBucket: "cassa-emersa2.appspot.com",
    messagingSenderId: "655203026786",
    appId: "1:655203026786:web:c1005f1fb97947c4cd4e3b"
  };

  const Registration = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
  
    const handleRegistration = () => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          // L'utente è stato registrato con successo
          console.log('Registrazione completata');
        })
        .catch((error) => {
          // Gestisci gli errori di registrazione
          setError(error.message);
        });
    };
  
    return (
      <div>
        <h2>Registrazione</h2>
        {error && <p>{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleRegistration}>Registrati</button>
      </div>
    );
  };
  
  export default Registration;