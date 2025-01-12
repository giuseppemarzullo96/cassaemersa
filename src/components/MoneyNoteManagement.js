import React, { useState } from 'react';
import { List, ListItem, ListItemText, IconButton, TextField, Button, Typography, Paper, Container, Box} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const MoneyNoteManagement = ({ moneyNotes = [], setMoneyNotes, getMoneyNotes, createMoneyNote, deleteMoneyNote }) => {
  const [newMoneyNoteValue, setNewMoneyNoteValue] = useState('');

  const normalizeNumber = (value) => parseFloat(value.toString().replace(',', '.'));

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
      </Box>
    </Container>
  );
};

export default MoneyNoteManagement;
