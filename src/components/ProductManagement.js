import React, { useState } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  IconButton, 
  TextField, 
  Button, 
  Typography, 
  Select, 
  MenuItem, 
  Box, 
  Container 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CalculateIcon from '@mui/icons-material/Calculate';

const ProductManagement = ({ products, setProducts, getProducts, createProduct, updateProduct, deleteProduct, rawMaterials }) => {
  const [newProductId, setNewProductId] = useState('');
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductStock, setNewProductStock] = useState(0);
  const [rawMaterialList, setRawMaterialList] = useState([]);
  const [selectedRawMaterial, setSelectedRawMaterial] = useState('');
  const [rawMaterialQuantity, setRawMaterialQuantity] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  // Funzione per calcolare automaticamente lo stock basato sulle materie prime
  const calculateStock = () => {
    if (rawMaterialList.length === 0) {
      alert('Aggiungi almeno una materia prima per calcolare lo stock.');
      return;
    }

    const calculatedStock = rawMaterialList.reduce((minStock, material) => {
      const rawMaterial = rawMaterials.find((rm) => rm.id === material.rawMaterialId);
      if (!rawMaterial || rawMaterial.stock <= 0) {
        return 0; // Se una materia prima non è disponibile, lo stock è 0
      }
      const possibleStock = Math.floor(rawMaterial.stock / material.quantity);
      return Math.min(minStock, possibleStock);
    }, Infinity);

    setNewProductStock(calculatedStock || 0);
  };

  // Funzione per modificare un prodotto
  const handleEditProduct = (index, product) => {
    setNewProductId(product.id);
    setNewProductName(product.name);
    setNewProductPrice(product.price.toString());
    setNewProductStock(product.stock || 0);
    setRawMaterialList(product.rawMaterials || []);
    setEditingIndex(index);
  };

  // Funzione per eliminare un prodotto
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

  // Funzione per aggiungere una nuova materia prima
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

  // Funzione per rimuovere una materia prima dalla lista
  const handleRemoveRawMaterial = (index) => {
    setRawMaterialList((prevList) => prevList.filter((_, i) => i !== index));
  };

  // Funzione per salvare il prodotto
  const handleSaveProduct = async () => {
    if (!newProductName || !newProductPrice) {
      alert('Inserisci un nome e un prezzo validi.');
      return;
    }

    const product = {
      id: newProductId || '',
      name: newProductName,
      price: parseFloat(newProductPrice),
      stock: newProductStock,
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
      setNewProductStock(0);
      setRawMaterialList([]);
      setEditingIndex(null);
      const productsData = await getProducts();
      setProducts(productsData);
    } catch (error) {
      console.error('Errore durante il salvataggio del prodotto:', error);
    }
  };

  return (
<Container maxWidth="tm" sx={{ mt: 4, mb:4}}>
      <Box
        sx={{
          backgroundColor: '#f5f5f5',
          borderRadius: '30px',
          p: 4,
          boxShadow: 1,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Gestione Prodotti
        </Typography>
        <List>
          {products.map((product, index) => (
            <ListItem key={index}>
              <ListItemText primary={`${product.name} - €${product.price.toFixed(2)} - Stock: ${product.stock || 0}`} />
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
              Materia prima
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
        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<CalculateIcon />}
            sx={{
              height: 56,
              mb: 2,
            }}
            onClick={calculateStock}
          >
            Calcola Stock
          </Button>
        </Box>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            mt: 2,
            height: 56,
          }}
          onClick={handleSaveProduct}
        >
          {editingIndex !== null ? 'Aggiorna Prodotto' : 'Aggiungi Prodotto'}
        </Button>
      </Box>
    </Container>
  );
};

export default ProductManagement;
