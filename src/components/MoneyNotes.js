import React from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const MoneyNotes = ({ moneyNotes, setMoneyNotes }) => {
  const moneyValues = [5, 10, 20, 50, 100];

  const handleAddMoneyNote = (value) => {
    setMoneyNotes([...moneyNotes, { value }]);
  };

  return (
    <Grid container spacing={2}>
      <Typography variant="h6" component="h2" gutterBottom>
        Aggiungi Banconote
      </Typography>
      {moneyValues.map((value) => (
        <Grid item xs={6} sm={4} key={value}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => handleAddMoneyNote(value)}
          >
            €{value}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
};

export default MoneyNotes;
