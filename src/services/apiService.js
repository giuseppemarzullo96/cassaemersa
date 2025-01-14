import axios from 'axios';

const BASE_URL = 'http://localhost:5030/api'; // Sostituisci con l'URL del tuo backend https://backend-cassaemersa-789784471101.us-central1.run.app/api

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
    const response = await axios.post(`${BASE_URL}/transactions`, transaction);
    return response.data;
  }; 
  
export const getAllTransactions = async () => {
  const response = await axios.get(`${BASE_URL}/transactions/all`);
  return response.data;
};
export const getLatestTransaction = async () => {
  const response = await axios.get(`${BASE_URL}/transactions/latest`);
  return response.data;
};

export const getAllRawMaterials = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/rawmaterials/`);
    return response.data;
  } catch (error) {
    console.error(`Errore durante il recupero della materia prima`);
    throw error;
  }
};

export const createRawMaterial = async (rawMaterial) => {
  try {
    const response = await axios.post(`${BASE_URL}/RawMaterials`, rawMaterial);
    return response.data;
  } catch (error) {
    console.error('Errore durante la creazione della materia prima:', error);
    throw error;
  }
};

export const updateRawMaterial = async (index, rawMaterial) => {
  try {
    const response = await axios.put(`${BASE_URL}/RawMaterials/${index}`, rawMaterial);
    return response.data;
  } catch (error) {
    console.error(`Errore durante l'aggiornamento della materia prima all'indice ${index}:`, error);
    throw error;
  }
};

// Elimina una materia prima per indice
export const deleteRawMaterial = async (index) => {
  try {
    const response = await axios.delete(`${BASE_URL}/RawMaterials/${index}`);
    return response.data;
  } catch (error) {
    console.error(`Errore durante l'eliminazione della materia prima all'indice ${index}:`, error);
    throw error;
  }
};

export const getHourlyProductSales = async () => {
  const response = await axios.get(`${BASE_URL}/transactions/hourly-sales`);
  return response.data;
};

export const getTopSellingProducts = async () => {
  const response = await axios.get(`${BASE_URL}/transactions/top-products`);
  return response.data;
};

export const getHourlySalesSummary = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/transactions/hourly-sales-summary`);
    return response.data; // Array con { Hour, TotalSales }
  } catch (error) {
    console.error('Errore durante il recupero del riepilogo delle vendite orarie:', error);
    throw error;
  }
};
export const getMaxProduction = async () => {
  const response = await axios.get(`${BASE_URL}/products/max-production`);
  return response.data;
};
export const getAllEvents = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Event/all`);
    if (response.data?.success && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      console.error('Risposta API non valida:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Errore durante il recupero degli eventi:', error);
    return [];
  }
};

export const createEvent = async (newEvent) => {
  try {
    const response = await axios.post(`${BASE_URL}/Event/create`, newEvent);
    return response.data;
  } catch (error) {
    console.error("Errore durante la creazione dell'evento:", error);
    throw error;
  }
};

export const updateEvent = async (id, updatedEvent) => {
  try {
    const response = await axios.put(`${BASE_URL}/Event/${id}`, updatedEvent);
    return response.data;
  } catch (error) {
    console.error(`Errore durante l'aggiornamento dell'evento con ID ${id}:`, error);
    throw error;
  }
};

export const deleteEvent = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/Event/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Errore durante l'eliminazione dell'evento con ID ${id}:`, error);
    throw error;
  }
};
// Recupera i biglietti prenotati da un utente specifico
export const getUserTickets = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/Ticket/user-tickets/${userId}`);
    return response.data.data; // Restituisce la lista dei biglietti dell'utente
  } catch (error) {
    console.error(`Errore durante il recupero dei biglietti per l'utente ${userId}:`, error);
    throw error;
  }
};

// Prenota un biglietto per un evento
export const bookTicket = async (ticketRequest) => {
  try {
    const response = await axios.post(`${BASE_URL}/Ticket/book-ticket`, ticketRequest);
    return response.data; // Restituisce i dettagli del biglietto creato
  } catch (error) {
    console.error('Errore durante la prenotazione del biglietto:', error);
    throw error;
  }
};

// Cancella un biglietto per un evento
export const cancelTicket = async (ticketId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/Ticket/${ticketId}`);
    return response.data;
  } catch (error) {
    console.error('Errore durante l\'annullamento della prenotazione:', error);
    throw error;
  }
};
export const getAllTickets = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Ticket/all`);
    if (response.data?.success && Array.isArray(response.data.data)) {
      return response.data.data; // Restituisce tutti i biglietti
    } else {
      console.error('Risposta API non valida:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Errore durante il recupero di tutti i biglietti:', error);
    throw error;
  }
};
