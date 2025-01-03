import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { getMoneyNotes } from './apiService';

const MoneyNotes = ({ moneyNotes, setMoneyNotes }) => {
  useEffect(() => {
    const fetchMoneyNotes = async () => {
      const data = await getMoneyNotes();
      setMoneyNotes(data);
    };
    fetchMoneyNotes();
  }, [setMoneyNotes]);

  const handleAddMoneyNote = (value) => {
    setMoneyNotes([...moneyNotes, { value }]);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6" component="h2" gutterBottom>
          Aggiungi Banconote e Monete
        </Typography>
      </Grid>
      {moneyNotes.map((money) => (
        <Grid item xs={6} sm={4} key={money.value}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => handleAddMoneyNote(money.value)}
          >
            €{money.value}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
};

export default MoneyNotes;
