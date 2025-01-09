import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, IconButton, TextField, Button, Typography, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const RawMaterialManagement = ({ rawMaterials, setRawMaterials, getRawMaterials, createRawMaterial, updateRawMaterial, deleteRawMaterial }) => {
  const [newMaterial, setNewMaterial] = useState({ id: '', name: '', cost: '', unit: '', stock: '' });
  const [editingIndex, setEditingIndex] = useState(null);

  const handleSaveMaterial = async () => {
    if (!newMaterial.id || !newMaterial.name || !newMaterial.cost || !newMaterial.unit || !newMaterial.stock) {
      alert('Compila tutti i campi richiesti.');
      return;
    }

    try {
      if (editingIndex !== null) {
        await updateRawMaterial(newMaterial.id, newMaterial);
        alert('Materia prima aggiornata con successo!');
      } else {
        await createRawMaterial(newMaterial);
        alert('Materia prima creata con successo!');
      }

      setNewMaterial({ id: '', name: '', cost: '', unit: '', stock: '' });
      setEditingIndex(null);
      const materials = await getRawMaterials();
      setRawMaterials(materials);
    } catch (error) {
      console.error('Errore durante il salvataggio della materia prima:', error);
    }
  };

  const handleDeleteMaterial = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questa materia prima?')) {
      try {
        await deleteRawMaterial(id);
        alert('Materia prima eliminata con successo!');
        const materials = await getRawMaterials();
        setRawMaterials(materials);
      } catch (error) {
        console.error("Errore durante l'eliminazione della materia prima:", error);
      }
    }
  };

  return (
    <Paper sx={{ p: 4 }} elevation={3}>
      <Typography variant="h6" gutterBottom>
        Gestione Materie Prime
      </Typography>
      <List>
        {rawMaterials.map((material, index) => (
          <ListItem key={material.id}>
            <ListItemText primary={`ID: ${material.id} - ${material.name} - Costo: €${material.cost.toFixed(2)} / ${material.unit} - Stock: ${material.stock}`} />
            <IconButton onClick={() => {
              setNewMaterial(material);
              setEditingIndex(index);
            }}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDeleteMaterial(material.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <TextField
        label="ID"
        fullWidth
        value={newMaterial.id}
        onChange={(e) => setNewMaterial({ ...newMaterial, id: e.target.value })}
        sx={{ mt: 2 }}
        disabled={editingIndex !== null} // Disabilita l'ID se stai modificando
      />
      <TextField
        label="Nome"
        fullWidth
        value={newMaterial.name}
        onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
        sx={{ mt: 2 }}
      />
      <TextField
        label="Costo (€)"
        type="number"
        fullWidth
        value={newMaterial.cost}
        onChange={(e) => setNewMaterial({ ...newMaterial, cost: e.target.value })}
        sx={{ mt: 2 }}
      />
      <TextField
        label="Unità"
        fullWidth
        value={newMaterial.unit}
        onChange={(e) => setNewMaterial({ ...newMaterial, unit: e.target.value })}
        sx={{ mt: 2 }}
      />
      <TextField
        label="Stock"
        type="number"
        fullWidth
        value={newMaterial.stock}
        onChange={(e) => setNewMaterial({ ...newMaterial, stock: e.target.value })}
        sx={{ mt: 2 }}
      />
      <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleSaveMaterial}>
        {editingIndex !== null ? 'Aggiorna Materia Prima' : 'Aggiungi Materia Prima'}
      </Button>
    </Paper>
  );
};

export default RawMaterialManagement;
