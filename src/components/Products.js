import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LocalBar from '@mui/icons-material/LocalBar';
import { getProducts } from './apiService';

const Products = ({ products, setProducts }) => {
  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
    };
    fetchProducts();
  }, [setProducts]);

  const handleProductClick = (name, price) => {
    const updatedProducts = [...products];
    const productIndex = updatedProducts.findIndex((product) => product.name === name);

    if (productIndex >= 0) {
      updatedProducts[productIndex].quantity += 1;
    } else {
      updatedProducts.push({ name, price, quantity: 1 });
    }
    setProducts(updatedProducts);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6" component="h2" gutterBottom>
          Seleziona Prodotto
        </Typography>
      </Grid>
      {products.map((product) => (
        <Grid item xs={6} key={product.name}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<LocalBar />}
            onClick={() => handleProductClick(product.name, product.price)}
          >
            {product.name} - €{product.price}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
};

export default Products;
