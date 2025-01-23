import React, { useContext, useEffect } from 'react';
import { Grid, Card, CardActionArea, Typography, Box } from '@mui/material';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import { AppContext } from '../context/AppContext';

const Products = ({ products = [] }) => {
  const { addProduct, selectedProducts, rawMaterials, initialStock, setInitialStock } = useContext(AppContext);

  const calculateStock = () => {
    // Verifica che products sia un array
    if (!Array.isArray(products) || products.length === 0) {
      console.warn("Nessun prodotto trovato o products non è un array.");
      return {};
    }
  
    return products.reduce((acc, product) => {
      // Controlla se il prodotto ha materie prime valide
      if (!product.rawMaterials || !Array.isArray(product.rawMaterials)) {
        acc[product.id] = product.stock || 0; // Usa lo stock del prodotto o 0 come valore predefinito
        return acc;
      }
  
      // Calcola lo stock in base alle materie prime
      const stockByMaterial = product.rawMaterials.map((material) => {
        const rawMaterial = rawMaterials.find((rm) => rm.id === material.rawMaterialId);
  
        // Se la materia prima non è trovata, restituisce 0
        if (!rawMaterial) {
          console.warn(`Materia prima non trovata per ID: ${material.rawMaterialId}`);
          return 0;
        }
  
        // Calcola quante unità possono essere prodotte con la materia prima disponibile
        return Math.floor(rawMaterial.stock / material.quantity);
      });
  
      // Determina lo stock minimo in base alle materie prime e allo stock del prodotto
      acc[product.id] = Math.min(...stockByMaterial, product.stock || 0);
      return acc;
    }, {});
  };
  

  useEffect(() => {
    const updatedStock = calculateStock();
    setInitialStock((prevStock) => ({ ...prevStock, ...updatedStock }));
  }, [products]);

  useEffect(() => {
    const updatedStock = calculateStock();
    setInitialStock((prevStock) => ({ ...prevStock, ...updatedStock }));
  }, [selectedProducts, rawMaterials]);

  const handleProductClick = (product) => {
    const stockValue = initialStock[product.id] || 0; // Default to 0 if undefined
    if (stockValue <= 0) return;
    addProduct({ ...product, quantity: 1 });
  };

  return (
    <Grid container spacing={3}>
      {Array.isArray(products) && products.length > 0 ? (
        products.map((product) => {
          const stockValue = initialStock[product.id] || 0; // Default to 0 if undefined
          const stockPercentage = Math.max(0, (stockValue / (product.stock || 1)) * 100);
  
          return (
            <Grid item xs={6} sm={6} md={6} key={product.id}>
              <Card
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '12px',
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                  height: '1',
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
                  disabled={stockValue <= 0}
                  sx={{
                    position: 'relative',
                    zIndex: 1,
                    height: '100%',
                    width:"100%",
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
                    Stock: {stockValue}
                  </Typography>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })
      ) : (
        <Typography
          variant="h6"
          align="center"
          sx={{
            width: '100%',
            marginTop: 2,
            color: 'text.secondary',
          }}
        >
          Nessun prodotto trovato.
        </Typography>
      )}
    </Grid>
  );
  
};

export default Products;
