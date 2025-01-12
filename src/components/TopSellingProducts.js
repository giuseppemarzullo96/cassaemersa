import React, { useEffect, useState } from 'react'; 
import { Container, Typography, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import { getTopSellingProducts } from '../services/apiService';

const TopSellingProducts = () => {
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productSales = await getTopSellingProducts();
        console.log('Dati prodotti più venduti:', productSales);
        const sortedProducts = Object.entries(productSales).map(([name, totalSold]) => ({
          name,
          totalSold,
        }));
        setTopProducts(sortedProducts);
      } catch (error) {
        console.error('Errore durante il recupero dei prodotti più venduti:', error);
      }
    };
  
    fetchData();
  }, []);
  

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{
      backgroundColor: '#f5f5f5',
      borderRadius: '30px',
      p: 4,
      boxShadow: 1,
    }}>
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
