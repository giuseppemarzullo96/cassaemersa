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
  const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
  
    const handleLogin = () => {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          // L'utente ha effettuato l'accesso con successo
          console.log('Accesso effettuato');
        })
        .catch((error) => {
          // Gestisci gli errori di autenticazione
          setError(error.message);
        });
    };
  
    return (
      <div>
        <h2>Login</h2>
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
        <button onClick={handleLogin}>Accedi</button>
      </div>
    );
  };
  
  export default Login;