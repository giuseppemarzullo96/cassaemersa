import React, { useContext } from 'react';
import { Grid, Card, CardActionArea, CardContent, Typography, Box } from '@mui/material';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import { AppContext } from '../context/AppContext';

const Products = ({ products = [] }) => {
  const { addProduct } = useContext(AppContext);

  return (
    <Grid container spacing={3}>
      {products.map((product, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card>
            <CardActionArea onClick={() => addProduct(product)}>
              <CardContent>
                <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                  <LocalBarIcon sx={{ fontSize: 40 }} />
                </Box>
                <Typography align="center" variant="h6">
                  {product.name}
                </Typography>
                <Typography align="center">€{product.price.toFixed(2)}</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Products;
