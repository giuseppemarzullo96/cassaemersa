import axios from 'axios';

const BASE_URL = 'https://<tuo-backend-url>.com/api'; // Sostituisci con l'URL del tuo backend

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

export const getSales = async () => {
  const response = await axios.get(`${BASE_URL}/sales`);
  return response.data;
};

export const createSale = async (sale) => {
  const response = await axios.post(`${BASE_URL}/sales`, sale);
  return response.data;
};
