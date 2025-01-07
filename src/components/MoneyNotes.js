import React, { useContext } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { AppContext } from '../context/AppContext';

const MoneyNotes = ({ moneyNotes = [] }) => {
  const { addNote } = useContext(AppContext);

  return (
    <Grid container spacing={2}>
      {moneyNotes.map((note, index) => (
        <Grid item xs={4} key={index}>
          <Box
            onClick={() => addNote(note)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '60px',
              backgroundColor: '#8bc34a',
              borderRadius: '8px',
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
