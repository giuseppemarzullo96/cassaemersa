import React, { useState, useContext, useEffect } from 'react';
import { Container, Typography, Tabs, Tab, Paper} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import GroupIcon from '@mui/icons-material/Group';
import UserIcon from '@mui/icons-material/AccountCircle';
import ProductManagement from '../components/ProductManagement';
import MoneyNoteManagement from '../components/MoneyNoteManagement';
import AddUserWithRole from '../components/AddUserWithRole';
import MenageAccounts from '../components/MenageAccounts';
import { AuthContext } from '../context/AuthContext';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getMoneyNotes,
  createMoneyNote,
  deleteMoneyNote,
} from '../services/apiService';
import AccountSettings from '../components/AccountSettings';


const Settings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { role } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [moneyNotes, setMoneyNotes] = useState([]);

   useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, moneyNotesData] = await Promise.all([getProducts(), getMoneyNotes()]);
        setProducts(productsData);
        setMoneyNotes(moneyNotesData);
      } catch (error) {
        console.error('Errore durante il caricamento dei dati:', error);
      }
    };
    fetchData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };


  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h4" gutterBottom align="center">
        Impostazioni
      </Typography>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        centered
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: 3 }}
      >
        <Tab label="Informazioni Utente" icon={<UserIcon />} />
        <Tab label="Prodotti" icon={<InventoryIcon />} />
        <Tab label="Utenti" icon={<GroupIcon />} />
        <Tab label="Banconote" icon={<MonetizationOnIcon />} />
      </Tabs>
      {activeTab === 0 && (
        <AccountSettings
        />
      )}
      {activeTab === 1 && (
        <ProductManagement
          products={products}
          setProducts={setProducts}
          getProducts={getProducts}
          createProduct={createProduct}
          updateProduct={updateProduct}
          deleteProduct={deleteProduct}
        />
      )}
      {activeTab === 2 && (
        <Paper sx={{ p: 4 }} elevation={3}>
          <Typography variant="h6" gutterBottom>
            Gestione Utenti
          </Typography>
          <AddUserWithRole />
          <MenageAccounts />
        </Paper>
      )}
      {activeTab === 3 && (
        <MoneyNoteManagement
          moneyNotes={moneyNotes}
          setMoneyNotes={setMoneyNotes}
          getMoneyNotes={getMoneyNotes}
          createMoneyNote={createMoneyNote}
          deleteMoneyNote={deleteMoneyNote}
        />
      )}
    </Container>
  );
};

export default Settings;
