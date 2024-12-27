import React from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const Products = ({ products, setProducts }) => {
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

  const productItems = [
    { name: 'Prodotto A', price: 10 },
    { name: 'Prodotto B', price: 15 },
    { name: 'Prodotto C', price: 20 },
  ];

  return (
    <Grid container spacing={2}>
      <Typography variant="h6" component="h2" gutterBottom>
        Seleziona Prodotto
      </Typography>
      {productItems.map((product) => (
        <Grid item xs={6} sm={4} key={product.name}>
          <Button
            variant="contained"
            fullWidth
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
