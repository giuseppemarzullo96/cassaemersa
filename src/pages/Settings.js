import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Tabs,
  Tab,
  Box,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InventoryIcon from '@mui/icons-material/Inventory';
import GroupIcon from '@mui/icons-material/Group';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
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
import AddUserWithRole from '../components/AddUserWithRole';
import MenageAccounts from '../components/MenageAccounts';


const Settings = () => {
  const [products, setProducts] = useState([]);
  const [moneyNotes, setMoneyNotes] = useState([]);
  const [newProductId, setNewProductId] = useState('');
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newMoneyNoteValue, setNewMoneyNoteValue] = useState('');
  const [editingProductIndex, setEditingProductIndex] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== 'admin') {
      alert('Accesso non autorizzato. Reindirizzamento alla home.');
      navigate('/');
    }
  }, [role, navigate]);

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

  const normalizeNumber = (value) => parseFloat(value.toString().replace(',', '.'));

  const handleSaveProduct = async () => {
    if (!newProductName || !newProductPrice) {
      alert('Inserisci un nome e un prezzo validi.');
      return;
    }

    const product = {
      id: newProductId || '',
      name: newProductName,
      price: normalizeNumber(newProductPrice),
    };

    try {
      if (editingProductIndex !== null) {
        await updateProduct(editingProductIndex, product);
        alert('Prodotto aggiornato con successo!');
      } else {
        await createProduct(product);
        alert('Prodotto creato con successo!');
      }
      setNewProductId('');
      setNewProductName('');
      setNewProductPrice('');
      setEditingProductIndex(null);
      const productsData = await getProducts();
      setProducts(productsData);
    } catch (error) {
      console.error('Errore durante il salvataggio del prodotto:', error);
    }
  };

  const handleDeleteProduct = async (index) => {
    if (window.confirm('Sei sicuro di voler eliminare questo prodotto?')) {
      try {
        await deleteProduct(index);
        alert('Prodotto eliminato con successo!');
        const productsData = await getProducts();
        setProducts(productsData);
      } catch (error) {
        console.error('Errore durante l\'eliminazione del prodotto:', error);
      }
    }
  };

  const handleSaveMoneyNote = async () => {
    if (!newMoneyNoteValue || isNaN(newMoneyNoteValue) || newMoneyNoteValue <= 0) {
      alert('Inserisci un valore valido per la banconota.');
      return;
    }

    const note = { value: normalizeNumber(newMoneyNoteValue) };

    try {
      await createMoneyNote(note);
      alert('Valore banconota aggiunto con successo!');
      setNewMoneyNoteValue('');
      const moneyNotesData = await getMoneyNotes();
      setMoneyNotes(moneyNotesData);
    } catch (error) {
      console.error('Errore durante l\'aggiunta della banconota:', error);
    }
  };

  const handleDeleteMoneyNote = async (index) => {
    if (window.confirm('Sei sicuro di voler eliminare questo valore di banconota?')) {
      try {
        await deleteMoneyNote(index);
        alert('Valore banconota eliminato con successo!');
        const moneyNotesData = await getMoneyNotes();
        setMoneyNotes(moneyNotesData);
      } catch (error) {
        console.error('Errore durante l\'eliminazione della banconota:', error);
      }
    }
  };

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
        <Tab label="Prodotti" icon={<InventoryIcon />} />
        <Tab label="Utenti" icon={<GroupIcon />} />
        <Tab label="Banconote" icon={<MonetizationOnIcon />} />
      </Tabs>

      {activeTab === 0 && (
        <Paper sx={{ p: 4 }} elevation={3}>
          <Typography variant="h6" gutterBottom>
            Gestione Prodotti
          </Typography>
          <List>
            {products.map((product, index) => (
              <ListItem key={index}>
                <ListItemText primary={`${product.name} - €${product.price.toFixed(2)}`} />
                <IconButton
                  onClick={() => {
                    setNewProductId(product.id);
                    setNewProductName(product.name);
                    setNewProductPrice(product.price.toString());
                    setEditingProductIndex(index);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteProduct(index)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
          <TextField
            label="ID Prodotto (opzionale)"
            fullWidth
            value={newProductId}
            onChange={(e) => setNewProductId(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Nome Prodotto"
            fullWidth
            value={newProductName}
            onChange={(e) => setNewProductName(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Prezzo Prodotto (€)"
            type="number"
            fullWidth
            value={newProductPrice}
            onChange={(e) => setNewProductPrice(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleSaveProduct}>
            {editingProductIndex !== null ? 'Aggiorna Prodotto' : 'Aggiungi Prodotto'}
          </Button>
        </Paper>
      )}

      {activeTab === 1 && (
        <Paper sx={{ p: 4 }} elevation={3}>
          <Typography variant="h6" gutterBottom>
            Gestione Utenti
          </Typography>
          <AddUserWithRole />
          <MenageAccounts/>
        </Paper>
      )}

      {activeTab === 2 && (
        <Paper sx={{ p: 4 }} elevation={3}>
          <Typography variant="h6" gutterBottom>
            Gestione Banconote
          </Typography>
          <List>
            {moneyNotes.map((note, index) => (
              <ListItem key={index}>
                <ListItemText primary={`€${note.value.toFixed(2)}`} />
                <IconButton onClick={() => handleDeleteMoneyNote(index)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
          <TextField
            label="Nuovo Valore Banconota (€)"
            type="number"
            fullWidth
            value={newMoneyNoteValue}
            onChange={(e) => setNewMoneyNoteValue(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button variant="contained" color="secondary" fullWidth sx={{ mt: 2 }} onClick={handleSaveMoneyNote}>
            Aggiungi Banconota
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default Settings;
