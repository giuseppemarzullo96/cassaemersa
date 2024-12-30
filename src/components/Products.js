import React from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LocalBar from '@mui/icons-material/LocalBar';

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
    { name: 'Cocktail A', price: 10 },
    { name: 'Cocktail B', price: 15 },
    { name: 'Cocktail C', price: 20 },
    { name: 'Cocktail D', price: 12 },
    { name: 'Cocktail E', price: 18 },
    { name: 'Cocktail F', price: 14 },
    { name: 'Cocktail G', price: 11 },
    { name: 'Cocktail H', price: 16 },
    { name: 'Cocktail I', price: 13 },
    { name: 'Cocktail J', price: 17 },
  ];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6" component="h2" gutterBottom>
          Seleziona Prodotto
        </Typography>
      </Grid>
      {productItems.map((product) => (
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
