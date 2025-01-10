import React, { useState, useContext } from 'react';
import { Grid, Card, CardActionArea, CardContent, Typography, Box } from '@mui/material';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import { AppContext } from '../context/AppContext';

const Products = ({ products = [] }) => {
  const [localStock, setLocalStock] = useState(
    products.reduce((acc, product) => {
      acc[product.id] = product.stock;
      return acc;
    }, {})
  );

  const { addProduct } = useContext(AppContext);

  const handleProductClick = (product) => {
    if (localStock[product.id] <= 0) return; // Non fare nulla se lo stock è 0

    // Aggiorna temporaneamente lo stock
    setLocalStock((prevStock) => ({
      ...prevStock,
      [product.id]: prevStock[product.id] - 1,
    }));

    addProduct({ ...product, stock: localStock[product.id] - 1 }); // Aggiungi al carrello
  };

  return (
    <Grid container spacing={3}>
      {products.map((product, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card>
            <CardActionArea
              onClick={() => handleProductClick(product)}
              disabled={localStock[product.id] <= 0} // Disabilita se lo stock è 0
            >
              <CardContent>
                <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                  <LocalBarIcon sx={{ fontSize: 40 }} />
                </Box>
                <Typography align="center" variant="h6">
                  {product.name}
                </Typography>
                <Typography align="center">€{product.price.toFixed(2)}</Typography>
                <Typography align="center" variant="body2" color="textSecondary">
                  Stock: {localStock[product.id]}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Products;
