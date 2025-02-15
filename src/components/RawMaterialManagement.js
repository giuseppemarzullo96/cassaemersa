import React, { useState } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  IconButton, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Box 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const RawMaterialManagement = ({ rawMaterials, setRawMaterials, getRawMaterials, createRawMaterial, updateRawMaterial, deleteRawMaterial }) => {
  const [newRawMaterialId, setNewRawMaterialId] = useState('');
  const [newRawMaterialName, setNewRawMaterialName] = useState('');
  const [newRawMaterialCost, setNewRawMaterialCost] = useState('');
  const [newRawMaterialUnit, setNewRawMaterialUnit] = useState('');
  const [newRawMaterialStock, setNewRawMaterialStock] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [liters, setLiters] = useState(''); // Aggiunto per il calcolo dei litri

  const handleSaveMaterial = async () => {
    if (!newRawMaterialName || !newRawMaterialCost || !newRawMaterialUnit || !newRawMaterialStock) {
      alert('Compila tutti i campi richiesti.');
      return;
    }

    const rawMaterial = {
      id: newRawMaterialId || '',
      name: newRawMaterialName,
      cost: parseFloat(newRawMaterialCost),
      unit: newRawMaterialUnit,
      stock: parseFloat(newRawMaterialStock),
    };

    try {
      if (editingIndex !== null) {
        await updateRawMaterial(editingIndex, rawMaterial);
        alert('Materia prima aggiornata con successo!');
      } else {
        await createRawMaterial(rawMaterial);
        alert('Materia prima creata con successo!');
      }

      setNewRawMaterialId('');
      setNewRawMaterialName('');
      setNewRawMaterialCost('');
      setNewRawMaterialUnit('');
      setNewRawMaterialStock('');
      setEditingIndex(null);
      const materialsData = await getRawMaterials();
      setRawMaterials(materialsData);
    } catch (error) {
      console.error('Errore durante il salvataggio della materia prima:', error);
    }
  };

  const handleEditMaterial = (index, material) => {
    setNewRawMaterialId(material.id);
    setNewRawMaterialName(material.name);
    setNewRawMaterialCost(material.cost.toString());
    setNewRawMaterialUnit(material.unit);
    setNewRawMaterialStock(material.stock.toString());
    setEditingIndex(index);
  };

  const handleDeleteMaterial = async (index) => {
    if (window.confirm('Sei sicuro di voler eliminare questa materia prima?')) {
      try {
        await deleteRawMaterial(index);
        alert('Materia prima eliminata con successo!');
        const materialsData = await getRawMaterials();
        setRawMaterials(materialsData);
      } catch (error) {
        console.error('Errore durante l\'eliminazione della materia prima:', error);
      }
    }
  };

  const handleConvertLitersToOunces = () => {
    if (!liters) {
      alert('Inserisci un valore in litri da convertire.');
      return;
    }

    const ounces = parseFloat(liters) * 33.814; // Conversione litri -> once
    const updatedStock = (parseFloat(newRawMaterialStock) || 0) + ounces; // Somma allo stock esistente
    setNewRawMaterialStock(updatedStock.toFixed(1)); // Imposta il nuovo valore dello stock
    setNewRawMaterialUnit('once'); // Imposta l'unità su "once"
  };

  return (
    <Container maxWidth='1' sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          backgroundColor: '#f5f5f5',
          borderRadius: '30px',
          p: 4,
          boxShadow: 1,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Gestione Materie Prime
        </Typography>
        <List>
          {rawMaterials.map((material, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`${material.name} - Costo: €${material.cost.toFixed(2)} / ${material.unit} - Stock: ${material.stock.toFixed(1)}`}
              />
              <IconButton onClick={() => handleEditMaterial(index, material)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDeleteMaterial(index)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
        <TextField
          label="ID Materia Prima (opzionale)"
          fullWidth
          value={newRawMaterialId}
          onChange={(e) => setNewRawMaterialId(e.target.value)}
          sx={{ mt: 2 }}
          disabled={editingIndex !== null}
        />
        <TextField
          label="Nome Materia Prima"
          fullWidth
          value={newRawMaterialName}
          onChange={(e) => setNewRawMaterialName(e.target.value)}
          sx={{ mt: 2 }}
        />
        <TextField
          label="Costo (€)"
          type="number"
          fullWidth
          value={newRawMaterialCost}
          onChange={(e) => setNewRawMaterialCost(e.target.value)}
          sx={{ mt: 2 }}
        />
        <TextField
          label="Litri (da convertire)"
          type="number"
          fullWidth
          value={liters}
          onChange={(e) => setLiters(e.target.value)}
          sx={{ mt: 2 }}
        />
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleConvertLitersToOunces}
        >
          Calcola Once
        </Button>
        <TextField
          label="Unità (once)"
          fullWidth
          value={newRawMaterialUnit}
          onChange={(e) => setNewRawMaterialUnit(e.target.value)}
          sx={{ mt: 2 }}
        />
        <TextField
          label="Stock"
          type="number"
          fullWidth
          value={newRawMaterialStock}
          onChange={(e) => setNewRawMaterialStock(e.target.value)}
          sx={{ mt: 2 }}
        />
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleSaveMaterial}>
          {editingIndex !== null ? 'Aggiorna Materia Prima' : 'Aggiungi Materia Prima'}
        </Button>
      </Box>
    </Container>
  );
};

export default RawMaterialManagement;
