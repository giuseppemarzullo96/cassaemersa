import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true); // Indica se il caricamento è in corso

  useEffect(() => {
    console.log('Initializing AuthContext...');

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true); // Imposta lo stato di caricamento all'inizio
      console.log('User state changed:', currentUser);

      try {
        if (currentUser) {
          // Carica le informazioni del ruolo utente dal database
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const userRole = docSnap.data().role;
            console.log('User role loaded:', userRole);
            setRole(userRole);
          } else {
            console.warn(`No role found for user: ${currentUser.uid}`);
            setRole(null);
          }

          setUser(currentUser); // Imposta l'utente
        } else {
          setUser(null);
          setRole(null); // Resetta il ruolo
        }
      } catch (error) {
        console.error('Errore durante il caricamento del ruolo utente:', error);
        setUser(null);
        setRole(null);
      } finally {
        setLoading(false); // Indica che il caricamento è terminato
      }
    });

    return () => {
      console.log('Cleaning up AuthContext...');
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    console.log('Logging out...');
    try {
      await signOut(auth);
      setUser(null);
      setRole(null);
      console.log('Logout successful.');
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, handleLogout }}>
      {loading ? (
        <div>Caricamento...</div> // Puoi personalizzare il caricamento
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
