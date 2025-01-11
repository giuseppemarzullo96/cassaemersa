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
    if (localStock[product.id] <= 0) return;

    setLocalStock((prevStock) => ({
      ...prevStock,
      [product.id]: prevStock[product.id] - 1,
    }));

    addProduct({ ...product, stock: localStock[product.id] - 1 });
  };

  return (
    <Grid container spacing={3}>
      {products.map((product, index) => {
        const stockPercentage = Math.max(0, (localStock[product.id] / product.stock) * 100);

        return (
          <Grid
            item
            xs={6} // 2 card per riga su smartphone
            sm={4}
            md={3} // 4 card per riga su desktop
            key={index}
          >
            <Card
              sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '12px', // Angoli arrotondati
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                height: 200, // Altezza fissa per card quadrata
              }}
            >
              {/* Layer per il livello "liquido" */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: `${stockPercentage}%`,
                  backgroundColor: 'rgba(216, 216, 216, 0.5)', // Colore liquido
                  transition: 'height 0.3s ease',
                  zIndex: 0,
                }}
              />

              <CardActionArea
                onClick={() => handleProductClick(product)}
                disabled={localStock[product.id] <= 0}
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 2,
                  textAlign: 'center',
                }}
              >
                <LocalBarIcon sx={{ fontSize: { xs: 40, md: 50 }, color: 'primary.main', mb: 1 }} />
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: '1rem', md: '1.25rem' },
                    fontWeight: 'bold',
                  }}
                >
                  {product.name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: '0.85rem', md: '1rem' },
                  }}
                >
                  €{product.price.toFixed(2)}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    fontSize: { xs: '0.75rem', md: '0.9rem' },
                  }}
                >
                  Stock: {localStock[product.id]}
                </Typography>
              </CardActionArea>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default Products;
