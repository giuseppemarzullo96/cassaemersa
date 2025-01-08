import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import { getAllTransactions } from '../services/apiService'; // Funzione per ottenere le transazioni

const TopSellingProducts = () => {
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactions = await getAllTransactions(); // Ottieni tutte le transazioni

        // Calcola il totale delle vendite per prodotto
        const productSales = {};
        transactions.forEach(transaction => {
          transaction.products.forEach(product => {
            if (!productSales[product.name]) {
              productSales[product.name] = {
                name: product.name,
                totalSold: 0,
              };
            }
            productSales[product.name].totalSold += product.quantitysold || 0;
          });
        });

        // Ordina i prodotti in base alle vendite totali
        const sortedProducts = Object.values(productSales).sort((a, b) => b.totalSold - a.totalSold);
        setTopProducts(sortedProducts);
      } catch (error) {
        console.error('Errore durante il recupero dei prodotti:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Prodotti più venduti
        </Typography>
        <List>
          {topProducts.map((product, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`${product.name}`}
                secondary={`Venduti: ${product.totalSold}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default TopSellingProducts;
