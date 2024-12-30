import React from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const CashRegister = ({
  products,
  moneyNotes,
  saveDataToDatabase,
  resetOperation,
  operationCount,
}) => {
  const total = (products || []).reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );
  
  const receivedTotal = (moneyNotes || []).reduce(
    (sum, note) => sum + note.value,
    0
  );
  
  const change = receivedTotal - total;
  
  // Ottieni data e ora corrente
  const currentDateTime = new Date();
  const formattedDate = currentDateTime.toLocaleDateString();
  const formattedTime = currentDateTime.toLocaleTimeString();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Dettaglio Operazione
        </Typography>
        <Typography variant="body1">Data: {formattedDate}</Typography>
        <Typography variant="body1">Ora: {formattedTime}</Typography>
        <Typography variant="body1">Numero Operazione: {operationCount}</Typography>
        <hr />
        {products.map((product) => (
          <Typography key={product.name}>
            {product.name} - {product.quantity} x €{product.price}
          </Typography>
        ))}
        <hr />
        <Typography variant="h6">Totale da Pagare: €{total.toFixed(2)}</Typography>
        <Typography variant="h6">Totale Ricevuto: €{receivedTotal.toFixed(2)}</Typography>
        <Typography variant="h6">Resto: €{change.toFixed(2)}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={saveDataToDatabase}
        >
          Salva
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={resetOperation}
        >
          Resetta
        </Button>
      </Grid>
    </Grid>
  );
};

export default CashRegister;
