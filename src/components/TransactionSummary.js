import React, { useContext } from 'react';
import { Grid, Typography, Button } from '@mui/material';
import { AppContext } from '../context/AppContext';
import { saveTransaction } from '../services/apiService';

const TransactionSummary = () => {
  const {
    selectedProducts,
    total,
    receivedTotal,
    change,
    receivedNotes,
    setSelectedProducts,
    setReceivedNotes,
  } = useContext(AppContext);
  
  const generateTempId = () => {
    return Math.random().toString(36).substring(2, 12).toUpperCase();
  };
  
  // Genera due ID temporanei
  const tempTransactionId = generateTempId();
  
  console.log("Temporary Transaction ID:", tempTransactionId);
  
  const handleSave = async () => {
    if (selectedProducts.length === 0 || receivedNotes.length === 0) {
      alert('Impossibile salvare: aggiungi almeno un prodotto e una banconota.');
      return;
    }

    try {
      const transaction = {
        transactionId: tempTransactionId, 
        products: selectedProducts.map(product => ({
          ...product,
          id: product.id, // Usa l'ID dal prodotto recuperato
        })),
        moneyNotes: receivedNotes,
        timestamp: new Date().toISOString(),
      };
      
      await saveTransaction(transaction);

    } catch (error) {
      console.error('Errore durante il salvataggio della transazione:', error.response || error);
      alert('Errore durante il salvataggio della transazione. Controlla la console per maggiori dettagli.');
    }
  };

  const handleReset = () => {
    if (window.confirm('Sei sicuro di voler resettare la transazione?')) {
      setSelectedProducts([]);
      setReceivedNotes([]);
      alert('Transazione resettata.');
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Riepilogo Transazione
        </Typography>
      </Grid>

      <Grid item xs={12}>
        {selectedProducts.length > 0 ? (
          selectedProducts.map((product, index) => (
            <Typography key={index}>
              {product.name} - {product.quantity} x €{product.price.toFixed(2)}
            </Typography>
          ))
        ) : (
          <Typography color="textSecondary">Nessun prodotto selezionato.</Typography>
        )}
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6">Totale da Pagare: €{total.toFixed(2)}</Typography>
        <Typography variant="h6">Totale Ricevuto: €{receivedTotal.toFixed(2)}</Typography>
        <Typography variant="h6">Resto: €{change.toFixed(2)}</Typography>
      </Grid>

      <Grid item xs={6}>
        <Button variant="contained" color="primary" fullWidth onClick={handleSave}>
          Salva
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button variant="outlined" color="secondary" fullWidth onClick={handleReset}>
          Resetta
        </Button>
      </Grid>
    </Grid>
  );
};

export default TransactionSummary;
