import { ref, push, get, update, remove } from 'firebase/database';
import { database } from './components/firebase';

// Aggiungi un prodotto
export const addProduct = async (product) => {
  const productsRef = ref(database, 'products');
  await push(productsRef, product);
};

// Ottieni tutti i prodotti
export const fetchProducts = async () => {
  const productsRef = ref(database, 'products');
  const snapshot = await get(productsRef);
  return snapshot.exists() ? Object.values(snapshot.val()) : [];
};

// Aggiungi una banconota
export const addMoneyNote = async (note) => {
  const notesRef = ref(database, 'moneyNotes');
  await push(notesRef, note);
};

// Ottieni tutte le banconote
export const fetchMoneyNotes = async () => {
  const notesRef = ref(database, 'moneyNotes');
  const snapshot = await get(notesRef);
  return snapshot.exists() ? Object.values(snapshot.val()) : [];
};

// Resetta i dati
export const resetData = async () => {
  const productsRef = ref(database, 'products');
  const notesRef = ref(database, 'moneyNotes');
  await remove(productsRef);
  await remove(notesRef);
};
