import React, { useEffect, useState } from 'react'; 
import { Container, Typography, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import { getAllTransactions } from '../services/apiService';

const TopSellingProducts = () => {
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactions = await getAllTransactions();

        // Calcola il totale delle vendite per prodotto
        const productSales = {};
        transactions.forEach(transaction => {
          if (transaction.products && Array.isArray(transaction.products)) {
            transaction.products.forEach(product => {
              if (product && product.name) {
                if (!productSales[product.name]) {
                  productSales[product.name] = {
                    name: product.name,
                    totalSold: 0,
                  };
                }
                productSales[product.name].totalSold += product.quantitysold || 0;
              }
            });
          }
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
        {topProducts.length > 0 ? (
          <List>
            {topProducts.map((product, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={`${index + 1}. ${product.name}`}
                    secondary={`Venduti: ${product.totalSold}`}
                  />
                </ListItem>
                {index < topProducts.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography variant="body1" color="textSecondary">
            Nessun dato disponibile sui prodotti più venduti.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default TopSellingProducts;
