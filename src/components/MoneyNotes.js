import React from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const MoneyNotes = ({ moneyNotes, setMoneyNotes }) => {
  const moneyValues = [
    { label: '€0.50', value: 0.5 },
    { label: '€1', value: 1 },
    { label: '€2', value: 2 },
    { label: '€5', value: 5 },
    { label: '€10', value: 10 },
    { label: '€20', value: 20 },
    { label: '€50', value: 50 },
    { label: '€100', value: 100 },
  ];

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
      {moneyValues.map((money) => (
        <Grid item xs={6} sm={4} key={money.value}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<span role="img" aria-label="money">💵</span>}
            onClick={() => handleAddMoneyNote(money.value)}
          >
            {money.label}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
};

export default MoneyNotes;
