import React, { createContext, useState, useEffect, useMemo } from 'react'; 
import { getProducts, getMoneyNotes, getMaxProduction, getAllRawMaterials } from '../services/apiService'; // Importa getMaxProduction

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [maxProduction, setMaxProduction] = useState([]); // Per memorizzare maxQuantity
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [moneyNotes, setMoneyNotes] = useState([]);
  const [receivedNotes, setReceivedNotes] = useState([]);
  const [operationCount, setOperationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadTransaction, setReloadTransaction] = useState(false);


  const refreshLatestTransaction = () => {
    setReloadTransaction((prev) => !prev);
  };

  const total = useMemo(
    () => selectedProducts.reduce((sum, product) => sum + product.price * product.quantity, 0),
    [selectedProducts]
  );

  const receivedTotal = useMemo(
    () => receivedNotes.reduce((sum, note) => sum + note.value, 0),
    [receivedNotes]
  );

  const change = useMemo(() => receivedTotal - total, [receivedTotal, total]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [productsData, moneyNotesData, maxProductionData] = await Promise.all([
          getProducts(),
          getMoneyNotes(),
          getMaxProduction(), // Ottieni maxQuantity dall'API
          getAllRawMaterials(),
        ]);

        setProducts(productsData || []);
        setMoneyNotes(moneyNotesData || []);
        setMaxProduction(maxProductionData || []);
      } catch (err) {
        setError('Errore durante il recupero dei dati. Riprova più tardi.');
        console.error('Errore API:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const addProduct = (product) => {
    setSelectedProducts((prev) => {
      const existingProduct = prev.find((p) => p.id === product.id);
      if (existingProduct) {
        if (existingProduct.quantity + 1 > product.stock) {
          alert('Stock insufficiente per questo prodotto.');
          return prev;
        }
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
  
      if (product.stock <= 0) {
        alert('Stock esaurito per questo prodotto.');
        return prev;
      }
  
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const addNote = (note) => {
    setReceivedNotes((prev) => [...prev, note]);
  };

  return (
    <AppContext.Provider
      value={{
        products,
        setProducts,
        maxProduction, // Passa maxProduction
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
        reloadTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
