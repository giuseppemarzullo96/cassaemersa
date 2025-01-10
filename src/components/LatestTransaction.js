import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, List, ListItem, ListItemText } from '@mui/material';
import { getLatestTransaction } from '../services/apiService';

const LatestTransaction = ({ reload }) => {
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const data = await getLatestTransaction();
        setTransaction(data);
      } catch (error) {
        console.error('Errore durante il recupero dell\'ultima transazione:', error);
      }
    };

    fetchTransaction();
  }, [reload]);

  if (!transaction) {
    return <Typography>Caricamento ultima transazione...</Typography>;
  }

  return (
    <Container maxWidth="tm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Ultima Transazione
        </Typography>
        <Typography variant="subtitle1">
          ID Transazione: {transaction.transactionId}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Data: {new Date(transaction.timestamp).toLocaleString()}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Prodotti:
        </Typography>
        <List>
          {transaction.products.map((product, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`${product.name} - ${product.quantitySold} x €${product.price.toFixed(2)}`}
              />
            </ListItem>
          ))}
        </List>
        <Typography variant="h6">Totale: €{transaction.value_trans.toFixed(2)}</Typography>
      </Paper>
    </Container>
  );
};

export default LatestTransaction;
