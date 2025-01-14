import React, { useContext, useEffect } from 'react';
import { Grid, Card, CardActionArea, Typography, Box } from '@mui/material';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import { AppContext } from '../context/AppContext';

const Products = ({ products = [] }) => {
  const { addProduct, selectedProducts, rawMaterials, initialStock, setInitialStock } = useContext(AppContext);
  
  const calculateStock = () => {
    const newStock = products.reduce((acc, product) => {
      if (!product.rawMaterials || !Array.isArray(product.rawMaterials)) {
        acc[product.id] = product.stock;
        return acc;
      }

      const stockByMaterial = product.rawMaterials.map((material) => {
        const rawMaterial = rawMaterials.find((rm) => rm.id === material.rawMaterialId);
        if (!rawMaterial) return 0;
        return Math.floor(rawMaterial.stock / material.quantity);
      });

      acc[product.id] = Math.min(...stockByMaterial, product.stock);
      return acc;
    }, {});

    return newStock;
  };

  useEffect(() => {
    const updatedStock = calculateStock();
    setInitialStock((prevStock) => ({ ...prevStock, ...updatedStock }));
  }, [products]); // Esegui calcolo iniziale al caricamento dei prodotti

  useEffect(() => {
    const updatedStock = calculateStock();
    setInitialStock((prevStock) => ({ ...prevStock, ...updatedStock }));
  }, [selectedProducts, rawMaterials]); // Ricalcola quando cambiano i prodotti selezionati o le materie prime

  const handleProductClick = (product) => {
    if (initialStock[product.id] <= 0) return;
    addProduct({ ...product, quantity: 1 });
  };

  return (
    <Grid container spacing={3}>
      {products.map((product) => {
        const stockPercentage = Math.max(0, (initialStock[product.id] / product.stock) * 100);

        return (
          <Grid item xs={6} sm={4} md={3} key={product.id}>
            <Card
              sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '12px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                height: 200,
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: `${stockPercentage}%`,
                  backgroundColor: 'rgba(216, 216, 216, 0.5)',
                  transition: 'height 0.3s ease',
                  zIndex: 0,
                }}
              />

              <CardActionArea
                onClick={() => handleProductClick(product)}
                disabled={initialStock[product.id] <= 0}
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
                  Stock: {initialStock[product.id]}
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
