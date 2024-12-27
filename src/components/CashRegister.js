import React from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const CashRegister = ({ products, total, change, saveDataToDatabase, resetOperation }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Dettaglio Operazione
        </Typography>
        {products.map((product) => (
          <Typography key={product.name}>
            {product.name} - {product.quantity} x €{product.price}
          </Typography>
        ))}
        <Typography variant="h6">Totale: €{total}</Typography>
        <Typography variant="h6">Resto: €{change}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Button variant="contained" color="primary" fullWidth onClick={saveDataToDatabase}>
          Salva
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button variant="outlined" color="secondary" fullWidth onClick={resetOperation}>
          Resetta
        </Button>
      </Grid>
    </Grid>
  );
};

export default CashRegister;
