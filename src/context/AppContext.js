import React, { createContext, useState, useEffect, useMemo } from 'react';
import { getProducts, getMoneyNotes } from '../services/apiService'; // Importa le funzioni API

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [moneyNotes, setMoneyNotes] = useState([]);
  const [receivedNotes, setReceivedNotes] = useState([]);
  const [operationCount, setOperationCount] = useState(0);
  const [loading, setLoading] = useState(true); // Per gestire il caricamento iniziale
  const [error, setError] = useState(null); // Per gestire errori durante il recupero
  const [reloadTransaction, setReloadTransaction] = useState(false);

  const refreshLatestTransaction = () => {
    setReloadTransaction(prev => !prev); // Cambia stato per triggerare il ricaricamento
  };

  // Calcolo dei totali
  const total = useMemo(
    () => selectedProducts.reduce((sum, product) => sum + product.price * product.quantity, 0),
    [selectedProducts]
  );

  const receivedTotal = useMemo(
    () => receivedNotes.reduce((sum, note) => sum + note.value, 0),
    [receivedNotes]
  );

  const change = useMemo(() => receivedTotal - total, [receivedTotal, total]);

  // Recupera i dati al caricamento iniziale
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [productsData, moneyNotesData] = await Promise.all([
          getProducts(), // Recupera i prodotti dall'API
          getMoneyNotes(), // Recupera le banconote dall'API
        ]);

        setProducts(productsData || []);
        setMoneyNotes(moneyNotesData || []);
      } catch (err) {
        setError('Errore durante il recupero dei dati. Riprova più tardi.');
        console.error('Errore API:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Aggiungi un prodotto selezionato o incrementa la quantità
  const addProduct = (product) => {
    setSelectedProducts((prev) => {
      const existingProduct = prev.find((p) => p.name === product.name);
      if (existingProduct) {
        return prev.map((p) =>
          p.name === product.name ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Aggiungi una banconota ricevuta
  const addNote = (note) => {
    setReceivedNotes((prev) => [...prev, note]);
  };

  return (
    <AppContext.Provider
      value={{
        products,
        setProducts,
        selectedProducts,
        setSelectedProducts,
        addProduct,
        moneyNotes,
        setMoneyNotes,
        receivedNotes,
        setReceivedNotes,
        addNote,
        total,
        receivedTotal,
        change,
        operationCount,
        setOperationCount,
        loading,
        error,
        refreshLatestTransaction,
        reloadTransaction
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
