import React, { createContext, useState, useEffect, useMemo } from 'react'; 
import { 
  getProducts, 
  getMoneyNotes, 
  getMaxProduction, 
  getAllRawMaterials, 
  getUserTickets 
} from '../services/apiService';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [maxProduction, setMaxProduction] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [moneyNotes, setMoneyNotes] = useState([]);
  const [receivedNotes, setReceivedNotes] = useState([]);
  const [operationCount, setOperationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadTransaction, setReloadTransaction] = useState(false);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [initialStock, setInitialStock] = useState([]);
  const [initialRawMaterials, setInitialRawMaterials] = useState([]);
  const [userTickets, setUserTickets] = useState([]);

  // Funzione per caricare i dati iniziali
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const productsData = await getProducts();
        const rawMaterialsData = await getAllRawMaterials();
        const ticketsData = await getUserTickets();
        const moneyNotesData = await getMoneyNotes();

        setMoneyNotes(moneyNotesData)
        setProducts(productsData);
        setRawMaterials(rawMaterialsData);
        setUserTickets(ticketsData);
        setInitialStock(productsData.map((p) => ({ id: p.id, stock: p.stock })));
        setInitialRawMaterials(rawMaterialsData.map((rm) => ({ id: rm.id, stock: rm.stock })));
      } catch (error) {
        console.error('Errore durante il caricamento dei dati:', error);
      }
    };

    fetchInitialData();
  }, []);

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

  // Aggiunta del prodotto selezionato e gestione dello stock
  const addProduct = (product) => {
    setSelectedProducts((prev) => {
      const existingProduct = prev.find((p) => p.id === product.id);
      if (existingProduct) {
        if (existingProduct.quantity + 1 > product.stock) {
          alert('Stock insufficiente per questo prodotto.');
          return prev;
        }
        return prev.map((p) =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }

      if (product.stock <= 0) {
        alert('Stock esaurito per questo prodotto.');
        return prev;
      }

      return [...prev, { ...product, quantity: 1 }];
    });

    // Aggiorna lo stock e incrementa `QuantitySold`
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === product.id
          ? { ...p, stock: p.stock - 1, quantitySold: (p.quantitySold || 0) + 1 }
          : p
      )
    );

    // Aggiorna le materie prime
    setRawMaterials((prevRawMaterials) => {
      const updatedRawMaterials = prevRawMaterials.map((rm) => {
        const requiredMaterial = product.rawMaterials.find(
          (material) => material.rawMaterialId === rm.id
        );
        if (requiredMaterial) {
          return {
            ...rm,
            stock: Math.max(0, rm.stock - requiredMaterial.quantity),
          };
        }
        return rm;
      });
      console.log('Materie prime aggiornate:', updatedRawMaterials);
      return updatedRawMaterials;
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
        maxProduction,
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
        rawMaterials,
        setRawMaterials,
        initialStock,
        setInitialStock,
        initialRawMaterials,
        userTickets,
        setUserTickets,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
