import React, { useContext } from 'react';
import { Grid, Paper, Box, Typography } from '@mui/material';
import Products from '../components/Products';
import MoneyNotes from '../components/MoneyNotes';
import TransactionSummary from '../components/TransactionSummary';
import { AppContext } from '../context/AppContext';

const CassaBar = () => {
  const { products = [], moneyNotes = [], selectedProducts, total, receivedTotal, change } = useContext(AppContext);

  return (
    <Box my={4}>
      <Typography variant="h4" gutterBottom align="center">
        Cassa Bar
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Products products={products} />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <MoneyNotes moneyNotes={moneyNotes} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <TransactionSummary
              products={selectedProducts}
              total={total}
              receivedTotal={receivedTotal}
              change={change}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CassaBar;
