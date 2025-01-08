import axios from 'axios';

const BASE_URL = 'http://localhost:5030/api'; // Sostituisci con l'URL del tuo backend

export const getProducts = async () => {
  const response = await axios.get(`${BASE_URL}/products`);
  return response.data;
};

export const createProduct = async (product) => {
  const response = await axios.post(`${BASE_URL}/products`, product);
  return response.data;
};

export const updateProduct = async (index, product) => {
  const response = await axios.put(`${BASE_URL}/products/${index}`, product);
  return response.data;
};

export const deleteProduct = async (index) => {
  await axios.delete(`${BASE_URL}/products/${index}`);
};

export const getMoneyNotes = async () => {
  const response = await axios.get(`${BASE_URL}/moneynotes`);
  return response.data;
};

export const createMoneyNote = async (note) => {
  const response = await axios.post(`${BASE_URL}/moneynotes`, note);
  return response.data;
};

export const deleteMoneyNote = async (index) => {
  await axios.delete(`${BASE_URL}/moneynotes/${index}`);
};

export const saveTransaction = async (transaction) => {
  try {
    console.log('Corpo della richiesta inviato:', transaction);
    const response = await axios.post(`${BASE_URL}/transactions`, transaction);
    console.log('Risposta del server:', response);
    return response.data; // Restituisce l'ID della transazione
  } catch (error) {
    if (error.response) {
      // Errore ricevuto dal server
      console.error('Errore dal server:');
      console.error('Status:', error.response.status);
      console.error('StatusText:', error.response.statusText);
      console.error('Headers:', error.response.headers);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      // La richiesta è stata fatta ma non c'è stata una risposta
      console.error('Errore nella richiesta:', error.request);
    } else {
      // Altro tipo di errore
      console.error('Errore:', error.message);
    }

    console.error('Configurazione della richiesta:', error.config); // Dettagli della configurazione Axios
    throw error; // Rilancia l'errore per gestirlo a livello superiore
  }
};
export const getAllTransactions = async () => {
  const response = await axios.get(`${BASE_URL}/transactions/all`);
  return response.data;
};
