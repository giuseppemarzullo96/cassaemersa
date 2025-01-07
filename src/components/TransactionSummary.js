import React, { useContext } from 'react';
import { Grid, Typography, Button } from '@mui/material';
import { AppContext } from '../context/AppContext';
import { saveTransaction } from '../services/apiService'; // Funzione per chiamare l'API

const TransactionSummary = () => {
  const {
    selectedProducts,
    total,
    receivedTotal,
    change,
    setSelectedProducts,
    setReceivedNotes,
  } = useContext(AppContext);

  const handleSave = async () => {
    try {
      const transaction = {
        products: selectedProducts,
        moneyNotes: receivedTotal,
        total,
        change,
      };

      const transactionId = await saveTransaction(transaction);
      alert(`Transazione salvata con ID: ${transactionId}`);
      
      handleReset(); // Reset dopo il salvataggio
    } catch (error) {
      console.error('Errore durante il salvataggio della transazione:', error);
      alert('Errore durante il salvataggio della transazione.');
    }
  };

  const handleReset = () => {
    setSelectedProducts([]);
    setReceivedNotes([]);
    alert('Transazione resettata.');
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Riepilogo Transazione
        </Typography>
      </Grid>

      {/* Lista dei prodotti */}
      <Grid item xs={12}>
        {selectedProducts.map((product, index) => (
          <Typography key={index}>
            {product.name} - {product.quantity} x €{product.price.toFixed(2)}
          </Typography>
        ))}
      </Grid>

      {/* Totali */}
      <Grid item xs={12}>
        <Typography variant="h6">Totale da Pagare: €{total.toFixed(2)}</Typography>
        <Typography variant="h6">Totale Ricevuto: €{receivedTotal.toFixed(2)}</Typography>
        <Typography variant="h6">Resto: €{change.toFixed(2)}</Typography>
      </Grid>

      {/* Pulsanti */}
      <Grid item xs={6}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSave}
        >
          Salva
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={handleReset}
        >
          Resetta
        </Button>
      </Grid>
    </Grid>
  );
};

export default TransactionSummary;
