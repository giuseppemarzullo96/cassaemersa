import React, { useContext } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { AppContext } from '../context/AppContext';

const MoneyNotes = ({ moneyNotes = [] }) => {
  const { addNote } = useContext(AppContext);

  // Funzione per gestire il click e assicurarsi che il valore sia in formato corretto
  const handleAddNote = (note) => {
    const formattedNote = {
      ...note,
      value: parseFloat(note.value.toString().replace(',', '.')), // Sostituisce la virgola con un punto
    };
    addNote(formattedNote);
  };

  // Ordina le banconote in ordine crescente di valore
  const sortedNotes = [...moneyNotes].sort((a, b) => a.value - b.value);

  return (
    <Grid container spacing={2}>
      {sortedNotes.map((note, index) => (
        <Grid item xs={4} key={index}>
          <Box
            onClick={() => handleAddNote(note)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '60px',
              backgroundColor: '#8bc34a',
              borderRadius: '20px',
              maxWidth: '200px',
              minHeight:'100px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              '&:hover': { backgroundColor: '#7cb342' },
            }}
          >
            <Typography variant="h6" color="white">
              €{note.value.toFixed(2)}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default MoneyNotes;
