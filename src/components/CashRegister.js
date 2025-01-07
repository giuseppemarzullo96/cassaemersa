import React, { useContext } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { AppContext } from '../context/AppContext';

const CashRegister = () => {
  const { selectedProducts, total, receivedTotal, change, saveTransaction, resetOperation } = useContext(AppContext);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Dettaglio Operazione</Typography>
      </Grid>
      {selectedProducts.map((product, index) => (
        <Grid item xs={12} key={index}>
          <Typography>{product.name} - {product.quantity} x €{product.price}</Typography>
        </Grid>
      ))}
      <Grid item xs={12}>
        <Typography>Totale: €{total.toFixed(2)}</Typography>
        <Typography>Ricevuto: €{receivedTotal.toFixed(2)}</Typography>
        <Typography>Resto: €{change.toFixed(2)}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Button variant="contained" color="primary" onClick={saveTransaction} fullWidth>
          Salva
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button variant="outlined" color="secondary" onClick={resetOperation} fullWidth>
          Resetta
        </Button>
      </Grid>
    </Grid>
  );
};

export default CashRegister;
