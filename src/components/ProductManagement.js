import React, { useState } from 'react';
import { List, ListItem, ListItemText, IconButton, TextField, Button, Typography, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const ProductManagement = ({ products = [], setProducts, getProducts, createProduct, updateProduct, deleteProduct }) => {
  const [newProductId, setNewProductId] = useState('');
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [editingProductIndex, setEditingProductIndex] = useState(null);

  const normalizeNumber = (value) => parseFloat(value.toString().replace(',', '.'));

  const handleSaveProduct = async () => {
    if (!newProductName || !newProductPrice) {
      alert('Inserisci un nome e un prezzo validi.');
      return;
    }

    const product = { id: newProductId || '', name: newProductName, price: normalizeNumber(newProductPrice) };

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

  return (
    <Paper sx={{ p: 4 }} elevation={3}>
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
  );
};

export default ProductManagement;
