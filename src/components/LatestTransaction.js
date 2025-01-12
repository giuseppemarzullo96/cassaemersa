import React, { useEffect, useState, useRef } from 'react';
import { Container, Box, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import { getLatestTransaction } from '../services/apiService';

const LatestTransaction = ({ reload }) => {
  const [transaction, setTransaction] = useState(null);
  const receiptRef = useRef(); // Per la stampa

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const data = await getLatestTransaction();
        setTransaction(data);
      } catch (error) {
        console.error("Errore durante il recupero dell'ultima transazione:", error);
      }
    };

    fetchTransaction();
  }, [reload]);

  const handlePrint = () => {
    const printContents = receiptRef.current.innerHTML;
    const printWindow = window.open('', '', 'height=600,width=400');
    printWindow.document.write('<html><head><title>Scontrino</title></head><body>');
    printWindow.document.write(printContents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  if (!transaction) {
    return <Typography>Caricamento ultima transazione...</Typography>;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Box
        ref={receiptRef}
        sx={{
          backgroundColor: '#f5f5f5',
          borderRadius: 1,
          p: 3,
          position: 'relative',
          border: '1px solid #ddd',
          marginTop: '10px',
          marginBottom: '10px',
          display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          '&:before, &:after': {
            content: '""',
            display: 'block',
            width: '100%',
            height: '10px',
            background: 'repeating-linear-gradient(90deg, transparent, transparent 5px, #f5f5f5 5px, #f5f5f5 10px)',
            position: 'absolute',
          },
          '&:before': {
            top: '-10px',
          },
          '&:after': {
            bottom: '-10px',
          },
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Scontrino
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
            <ListItem key={index} disableGutters>
              <ListItemText
                primary={`${product.name} - ${product.quantitySold} x €${product.price.toFixed(2)}`}
              />
            </ListItem>
          ))}
        </List>
        <Typography variant="h6" align="right">
          Totale: €{transaction.value_trans.toFixed(2)}
        </Typography>
      </Box>
      <Button 
        variant="contained" 
        color="primary" 
        fullWidth 
        onClick={handlePrint} 
        sx={{ mt: 2 }}
      >
        Stampa Scontrino
      </Button>
    </Container>
  );
};

export default LatestTransaction;
