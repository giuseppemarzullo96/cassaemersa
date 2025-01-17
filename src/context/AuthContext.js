import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth'; // Importa signOut
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        console.log('DEBUG: Utente autenticato:', currentUser);

        try {
          // Recupera il documento Firestore
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);

          let username = currentUser.displayName || 'Utente sconosciuto';

          if (docSnap.exists()) {
            const userData = docSnap.data();
            console.log('DEBUG: Dati utente da Firestore:', userData);
            username = userData.username || username;

            setRole(userData.role || 'user');
          }

          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            username, // Usa il valore da Firestore o il displayName
          });
        } catch (error) {
          console.error('Errore durante il recupero dei dati utente da Firestore:', error);
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            username: 'Errore nel caricamento del nome',
          });
          setRole('user');
        }
      } else {
        console.log('DEBUG: Nessun utente autenticato');
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setRole(null);
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
