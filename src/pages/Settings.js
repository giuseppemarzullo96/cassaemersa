import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, TextField, Button, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getMoneyNotes,
  createMoneyNote,
  deleteMoneyNote,
} from '../services/apiService';

const Settings = () => {
  const [products, setProducts] = useState([]);
  const [moneyNotes, setMoneyNotes] = useState([]);
  const [newProductId, setNewProductId] = useState('');
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [editingProductIndex, setEditingProductIndex] = useState(null);
  const [newMoneyNoteValue, setNewMoneyNoteValue] = useState('');

  // Recupera prodotti e banconote al caricamento
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, moneyNotesData] = await Promise.all([getProducts(), getMoneyNotes()]);
        console.log('Prodotti recuperati:', productsData);
        console.log('Banconote recuperate:', moneyNotesData);
        setProducts(productsData);
        setMoneyNotes(moneyNotesData);
      } catch (error) {
        console.error('Errore durante il caricamento dei dati:', error);
      }
    };
    fetchData();
  }, []);

  // Funzione per normalizzare i numeri (sostituisce la virgola con il punto)
  const normalizeNumber = (value) => parseFloat(value.toString().replace(',', '.'));

  // Aggiungi o modifica un prodotto
  const handleSaveProduct = async () => {
    if (!newProductName || !newProductPrice) {
      alert('Inserisci un nome e un prezzo validi.');
      return;
    }

    const product = {
      id: newProductId || '',
      name: newProductName,
      price: normalizeNumber(newProductPrice), // Normalizza il prezzo
    };

    console.log('Prodotto da salvare:', product);

    try {
      if (editingProductIndex !== null) {
        await updateProduct(editingProductIndex, product);
        alert('Prodotto aggiornato con successo!');
      } else {
        await createProduct(product);
        alert('Prodotto creato con successo!');
      }

      // Reset campi
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

  // Elimina un prodotto per indice
  const handleDeleteProduct = async (index) => {
    console.log('Eliminazione prodotto con indice:', index);
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

  // Aggiungi una nuova banconota
  const handleSaveMoneyNote = async () => {
    if (!newMoneyNoteValue || isNaN(newMoneyNoteValue) || newMoneyNoteValue <= 0) {
      alert('Inserisci un valore valido per la banconota.');
      return;
    }

    const note = { value: normalizeNumber(newMoneyNoteValue) }; // Normalizza il valore
    console.log('Banconota da salvare:', note);

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

  // Elimina una banconota per indice
  const handleDeleteMoneyNote = async (index) => {
    console.log('Eliminazione banconota con indice:', index);
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

  return (
    <Container maxWidth="100%" sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h4" gutterBottom align="center">
        Impostazioni
      </Typography>

      <Grid container spacing={3}>
        {/* Sezione Prodotti */}
        <Grid item xs={12} md={6}>
          <Paper maxWidth="tm" sx={{ m: 4, p: 4}} elevation={3}>
            <Typography variant="h6" gutterBottom>
              Gestione Prodotti
            </Typography>
            <List>
              {products.map((product, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`${product.name} - €${product.price.toFixed(2)}`} />
                  <IconButton onClick={() => {
                    setNewProductId(product.id);
                    setNewProductName(product.name);
                    setNewProductPrice(product.price.toString());
                    setEditingProductIndex(index);
                  }}>
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
        </Grid>

        {/* Sezione Banconote */}
        <Grid item xs={12} md={6}>
        <Paper maxWidth="tm" sx={{ m: 4, p: 4}} elevation={3}>
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
        </Grid>
      </Grid>
    </Container>
  );
};

export default Settings;
