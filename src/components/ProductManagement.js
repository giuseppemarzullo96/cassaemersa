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
  Container, 
  FormControl, 
  InputLabel 
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
  const [newProductCategory, setNewProductCategory] = useState('');
  const [newProductSubcategory, setNewProductSubcategory] = useState('');
  const [calculatedStock, setCalculatedStock] = useState(0);
  const [newProductTypology, setNewProductTypology] = useState('Non Composto');
  const [rawMaterialList, setRawMaterialList] = useState([]);
  const [selectedRawMaterial, setSelectedRawMaterial] = useState('');
  const [rawMaterialQuantity, setRawMaterialQuantity] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  // Elenchi per categorie e sotto-categorie
  const categories = ["Bevande", "Snack", "Cibo", "Dessert", "Alcolici"];
  const subcategories = {
    Bevande: ["Caffè", "Tè", "Succhi", "Bibite Gassate"],
    Snack: ["Chips", "Biscotti", "Noci", "Popcorn"],
    Cibo: ["Panini", "Insalate", "Pizze"],
    Dessert: ["Torte", "Gelati", "Muffin"],
    Alcolici: ["Birra", "Vino", "Cocktail", "Distillati"],
  };

  // Funzione per calcolare automaticamente lo stock
  const calculateStock = () => {
    if (rawMaterialList.length === 0) {
        alert('Aggiungi almeno una materia prima per calcolare lo stock.');
        return;
    }

    const calculated = rawMaterialList.reduce((minStock, material) => {
        const rawMaterial = rawMaterials.find((rm) => rm.id === material.rawMaterialId);
        if (!rawMaterial || rawMaterial.stock <= 0) {
            return 0; // Se una materia prima non è disponibile o ha stock zero
        }
        const possibleStock = Math.floor(rawMaterial.stock / material.quantity);
        return Math.min(minStock, possibleStock); // Trova il minimo stock possibile
    }, Infinity);

    setCalculatedStock(calculated || 0); // Aggiorna lo stato di `calculatedStock`
    setNewProductStock(calculated || 0); // Aggiorna lo stock del prodotto
};

const handleEditProduct = (index, product) => {
  console.log('Editing Product:', product);
    setNewProductId(product.id);
    setNewProductName(product.name);
    setNewProductPrice(product.price.toString());
    setNewProductStock(product.stock || 0);
    setCalculatedStock(product.stock || 0); // Aggiorna lo stock calcolato in base al prodotto selezionato
    setNewProductCategory(product.category || '');
    setNewProductSubcategory(product.subcategory || '');
    setNewProductTypology(product.typology || 'Non Composto');
    setRawMaterialList(product.rawMaterials || []);
    setEditingIndex(index);
};
  // Funzione per salvare il prodotto
  const handleSaveProduct = async () => {
    if (!newProductName || !newProductPrice || !newProductCategory || !newProductSubcategory) {
      alert('Compila tutti i campi obbligatori.');
      return;
    }
  
    // Verifica che i valori siano stringhe
    const product = {
      id: newProductId || '',
      name: String(newProductName),
      price: parseFloat(newProductPrice),
      stock: newProductStock,
      category: String(newProductCategory),
      subcategory: String(newProductSubcategory),
      typology: String(newProductTypology),
      rawMaterials: newProductTypology === 'Composto' ? rawMaterialList : [],
    };
    console.log('Saving Product:', product);

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
      setNewProductCategory('');
      setNewProductSubcategory('');
      setNewProductTypology('Non Composto');
      setRawMaterialList([]);
      setEditingIndex(null);
      const productsData = await getProducts();
      setProducts(productsData);
    } catch (error) {
      console.error('Errore durante il salvataggio del prodotto:', error);
    }
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

  // Aggiunta di una nuova materia prima
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

  return (
    <Container maxWidth="1" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ backgroundColor: '#f5f5f5', borderRadius: '30px', p: 4, boxShadow: 1 }}>
        <Typography variant="h6" gutterBottom>
          Gestione Prodotti
        </Typography>
        
        <List>
  {Array.isArray(products) && products.length > 0 ? (
    products.map((product, index) => (
      <ListItem key={index}>
        <ListItemText primary={`${product.name} - €${product.price?.toFixed(2)} - Stock: ${product.stock || 0}`} />
        <IconButton onClick={() => handleEditProduct(index, product)}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => handleDeleteProduct(index)}>
          <DeleteIcon />
        </IconButton>
      </ListItem>
    ))
  ) : (
    <Typography>Nessun prodotto disponibile.</Typography>
  )}
</List>

        {/* Form per gestire i prodotti */}
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
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Categoria</InputLabel>
          <Select
            value={newProductCategory}
            onChange={(e) => setNewProductCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Sottocategoria</InputLabel>
          <Select
            value={newProductSubcategory}
            onChange={(e) => setNewProductSubcategory(e.target.value)}
          >
            {(subcategories[newProductCategory] || []).map((sub) => (
              <MenuItem key={sub} value={sub}>
                {sub}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Tipologia</InputLabel>
          <Select
            value={newProductTypology}
            onChange={(e) => setNewProductTypology(e.target.value)}
          >
            <MenuItem value="Composto">Composto</MenuItem>
            <MenuItem value="Non Composto">Non Composto</MenuItem>
          </Select>
        </FormControl>

        {newProductTypology === 'Composto' && (
          <>
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
                  <IconButton onClick={() => setRawMaterialList((prev) => prev.filter((_, i) => i !== index))}>
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<CalculateIcon />}
              sx={{ mt: 2 }}
              onClick={calculateStock}
            >
              Calcola Stock
            </Button>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Stock Calcolato: {calculatedStock}
            </Typography>
          </>
        )}

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleSaveProduct}
        >
          {editingIndex !== null ? 'Aggiorna Prodotto' : 'Aggiungi Prodotto'}
        </Button>
      </Box>
    </Container>
  );
};

export default ProductManagement;
