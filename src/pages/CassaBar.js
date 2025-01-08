import React, { useContext , useState } from 'react';
import { Grid, Paper, Box, Typography, Container } from '@mui/material';
import Products from '../components/Products';
import MoneyNotes from '../components/MoneyNotes';
import TransactionSummary from '../components/TransactionSummary';
import { AppContext } from '../context/AppContext';
import LatestTransaction from '../components/LatestTransaction.js';


const CassaBar = ({ onSave }) => {
  const { products = [], moneyNotes = [], selectedProducts, total, receivedTotal, change } = useContext(AppContext);
  const [reloadTransaction, setReloadTransaction] = useState(false);

const refreshLatestTransaction = () => {
    setReloadTransaction(prev => !prev); // Cambia stato per triggerare il ricaricamento
  };

  return (
    <Container maxWidth="100%" sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h4" gutterBottom align="center">
        Cassa Bar
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={6}>
          <Paper maxWidth="tm" sx={{ m: 4, p: 4}} elevation={3}>
            <Products products={products} />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Paper maxWidth="tm" sx={{ m: 4, p: 4}} elevation={3}>
            <MoneyNotes moneyNotes={moneyNotes} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper maxWidth="tm" sx={{ m: 4, p: 4}} elevation={3}>
            <TransactionSummary
              products={selectedProducts}
              total={total}
              receivedTotal={receivedTotal}
              change={change}
              onSave={refreshLatestTransaction}
            />
            <LatestTransaction reload={reloadTransaction} />
          </Paper>
                  
          </Grid>
      </Grid>
    </Container>
  );
};

export default CassaBar;
