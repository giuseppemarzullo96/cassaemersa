import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper } from '@mui/material';
import { getAllTransactions } from '../services/apiService'; // API per ottenere le transazioni

const ReportIncoming = () => {
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactions = await getAllTransactions(); // Ottieni tutte le transazioni
        console.log('Transazioni recuperate:', transactions);

        const income = transactions.reduce((sum, transaction) => {
          console.log('Valore di Value_trans:', transaction.value_trans); // Debug log
          return sum + (transaction.value_trans || 0); // Usa il valore di value_trans
        }, 0);

        setTotalIncome(income);
      } catch (error) {
        console.error('Errore durante il recupero delle transazioni:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Report Incassi Totali
        </Typography>
        <Typography variant="h3" color="primary">
          €{totalIncome.toFixed(2)}
        </Typography>
      </Paper>
    </Container>
  );
};

export default ReportIncoming;
