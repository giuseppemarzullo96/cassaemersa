import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, IconButton, TextField, Button, Typography, Paper, Select, MenuItem, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const ProductManagement = ({ products, setProducts, getProducts, createProduct, updateProduct, deleteProduct, rawMaterials }) => {
  const [newProductId, setNewProductId] = useState('');
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [rawMaterialList, setRawMaterialList] = useState([]);
  const [selectedRawMaterial, setSelectedRawMaterial] = useState('');
  const [rawMaterialQuantity, setRawMaterialQuantity] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  const handleEditProduct = (index, product) => {
    setNewProductId(product.id);
    setNewProductName(product.name);
    setNewProductPrice(product.price.toString());
    setRawMaterialList(product.rawMaterials || []);
    setEditingIndex(index);
  };

  const handleDeleteProduct = async (index) => {
    if (window.confirm('Sei sicuro di voler eliminare questo prodotto?')) {
      try {
        await deleteProduct(index);
        alert('Prodotto eliminato con successo!');
        const productsData = await getProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("Errore durante l'eliminazione del prodotto:", error);
      }
    }
  };

  const handleAddRawMaterial = () => {
    if (!selectedRawMaterial || !rawMaterialQuantity) {
      alert('Seleziona una materia prima e specifica la quantità.');
      return;
    }

    const material = rawMaterials.find((rm) => rm.id === selectedRawMaterial);

    setRawMaterialList((prevList) => [
      ...prevList,
      { rawMaterialId: material.id, rawMaterialName: material.name, quantity: parseFloat(rawMaterialQuantity) },
    ]);

    setSelectedRawMaterial('');
    setRawMaterialQuantity('');
  };

  const handleRemoveRawMaterial = (index) => {
    setRawMaterialList((prevList) => prevList.filter((_, i) => i !== index));
  };

  const handleSaveProduct = async () => {
    if (!newProductName || !newProductPrice) {
      alert('Inserisci un nome e un prezzo validi.');
      return;
    }

    const product = {
      id: newProductId || '',
      name: newProductName,
      price: parseFloat(newProductPrice),
      rawMaterials: rawMaterialList,
    };

    try {
      if (editingIndex !== null) {
        await updateProduct(editingIndex, product);
        alert('Prodotto aggiornato con successo!');
      } else {
        await createProduct(product);
        alert('Prodotto creato con successo!');
      }

      setNewProductId('');
      setNewProductName('');
      setNewProductPrice('');
      setRawMaterialList([]);
      setEditingIndex(null);
      const productsData = await getProducts();
      setProducts(productsData);
    } catch (error) {
      console.error('Errore durante il salvataggio del prodotto:', error);
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
            <IconButton onClick={() => handleEditProduct(index, product)}>
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
        disabled={editingIndex !== null}
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
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
        <Select
          value={selectedRawMaterial}
          onChange={(e) => setSelectedRawMaterial(e.target.value)}
          displayEmpty
          fullWidth
        >
          <MenuItem value="" disabled>
            Seleziona una materia prima
          </MenuItem>
          {rawMaterials.map((rm) => (
            <MenuItem key={rm.id} value={rm.id}>
              {rm.name}
            </MenuItem>
          ))}
        </Select>
        <TextField
          label="Quantità (once)"
          type="number"
          value={rawMaterialQuantity}
          onChange={(e) => setRawMaterialQuantity(e.target.value)}
        />
        <IconButton onClick={handleAddRawMaterial} color="primary">
          <AddCircleIcon />
        </IconButton>
      </Box>
      <List>
        {rawMaterialList.map((material, index) => (
          <ListItem key={index}>
            <ListItemText primary={`${material.rawMaterialName} - Quantità: ${material.quantity} once`} />
            <IconButton onClick={() => handleRemoveRawMaterial(index)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleSaveProduct}>
        {editingIndex !== null ? 'Aggiorna Prodotto' : 'Aggiungi Prodotto'}
      </Button>
    </Paper>
  );
};

export default ProductManagement;
