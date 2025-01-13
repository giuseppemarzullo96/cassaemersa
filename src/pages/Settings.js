import React, { useState, useContext, useEffect } from 'react';
import { Container, Typography, Tabs, Tab, Box, Paper } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import GroupIcon from '@mui/icons-material/Group';
import UserIcon from '@mui/icons-material/AccountCircle';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'; // Icona del biglietto
import ProductManagement from '../components/ProductManagement';
import MoneyNoteManagement from '../components/MoneyNoteManagement';
import AddUserWithRole from '../components/AddUserWithRole';
import MenageAccounts from '../components/MenageAccounts';
import AccountSettings from '../components/AccountSettings';
import RawMaterialManagement from '../components/RawMaterialManagement';
import EventManagement from '../components/EventManagement'; // Import del componente EventManagement
import { AuthContext } from '../context/AuthContext';
import { 
  getAllRawMaterials as getRawMaterials, 
  createRawMaterial, 
  updateRawMaterial, 
  deleteRawMaterial, 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getMoneyNotes, 
  createMoneyNote, 
  deleteMoneyNote 
} from '../services/apiService';

// Tab personalizzato con design a pillola
const PillTab = ({ icon, selected, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      width: 60,
      height: 60,
      borderRadius: '100%',
      backgroundColor: selected ? 'primary.main' : 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: selected ? 'white' : 'primary.main',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: selected ? '0px 4px 10px rgba(0, 0, 0, 0.2)' : 'none',
    }}
  >
    {icon}
  </Box>
);

const Settings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { role } = useContext(AuthContext); 
  const [products, setProducts] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [moneyNotes, setMoneyNotes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, moneyNotesData, rawMaterialsData] = await Promise.all([
          getProducts(), 
          getMoneyNotes(), 
          getRawMaterials()
        ]);
        setProducts(productsData);
        setMoneyNotes(moneyNotesData);
        setRawMaterials(rawMaterialsData || []);
      } catch (error) {
        console.error('Errore durante il caricamento dei dati:', error);
      }
    };

    if (role === 'admin') fetchData(); 
  }, [role]);

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  return (
    <Container sx={{
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center',
      maxWidth: '-webkit-fill-available',
      mt: 4, mb: 6 
    }}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 3, 
          mb: 4,
          padding: '10px',
          backgroundColor: '#f5f5f5', 
          borderRadius: '60px',
          width: 'fit-content',
        }}
      >
        <PillTab 
          icon={<UserIcon fontSize="large" />} 
          selected={activeTab === 0} 
          onClick={() => handleTabChange(0)} 
        />
        {role === 'admin' && (
          <PillTab 
            icon={<InventoryIcon fontSize="large" />} 
            selected={activeTab === 1} 
            onClick={() => handleTabChange(1)} 
          />
        )}
        {role === 'admin' && (
          <PillTab 
            icon={<GroupIcon fontSize="large" />} 
            selected={activeTab === 2} 
            onClick={() => handleTabChange(2)} 
          />
        )}
        {role === 'admin' && (
          <PillTab 
            icon={<MonetizationOnIcon fontSize="large" />} 
            selected={activeTab === 3} 
            onClick={() => handleTabChange(3)} 
          />
        )}
        {role === 'admin' && (
          <PillTab 
            icon={<ConfirmationNumberIcon fontSize="large" />} 
            selected={activeTab === 4} 
            onClick={() => handleTabChange(4)} 
          />
        )}
      </Box>

      {activeTab === 0 && <AccountSettings />}
      {role === 'admin' && activeTab === 1 && (
        <Paper sx={{
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          maxWidth: '-webkit-fill-available',
          mt: 2, mb: 6 
        }} elevation={0}>
          <ProductManagement
            products={products}
            setProducts={setProducts}
            getProducts={getProducts}
            createProduct={createProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
            rawMaterials={rawMaterials} 
          />
          <RawMaterialManagement
            rawMaterials={rawMaterials} 
            setRawMaterials={setRawMaterials} 
            getRawMaterials={getRawMaterials} 
            createRawMaterial={createRawMaterial}
            updateRawMaterial={updateRawMaterial}
            deleteRawMaterial={deleteRawMaterial}
          />
        </Paper>
      )}
      {role === 'admin' && activeTab === 2 && (
        <Paper sx={{
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: '', 
          alignItems: '',
          maxWidth: '-webkit-fill-available',
          mt: 2, mb: 6 
        }} elevation={0}>
          <AddUserWithRole />
          <MenageAccounts />
        </Paper>
      )}
      {role === 'admin' && activeTab === 3 && (
        <Paper sx={{
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          maxWidth: '-webkit-fill-available',
          mt: 2, mb: 6 
        }} elevation={0}>
          <MoneyNoteManagement
            moneyNotes={moneyNotes}
            setMoneyNotes={setMoneyNotes}
            getMoneyNotes={getMoneyNotes}
            createMoneyNote={createMoneyNote}
            deleteMoneyNote={deleteMoneyNote}
          />
        </Paper>
      )}
      {role === 'admin' && activeTab === 4 && (
        <Paper sx={{
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          maxWidth: '-webkit-fill-available',
          mt: 2, mb: 6 
        }} elevation={0}>
          <EventManagement />
        </Paper>
      )}
    </Container>
  );
};

export default Settings;
