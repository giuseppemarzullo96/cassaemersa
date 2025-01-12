import React, { useState, useContext, useEffect } from 'react';
import { Grid, Card, CardActionArea, Typography, Box } from '@mui/material';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import { AppContext } from '../context/AppContext';

const Products = ({ products = [] }) => {
  const { addProduct } = useContext(AppContext);
  const [localStock, setLocalStock] = useState({});

  // Inizializza lo stock locale all'avvio
  useEffect(() => {
    console.log('Inizializzazione stock locale con prodotti:', products);
    const initialStock = products.reduce((acc, product) => {
      acc[product.id] = product.stock;
      return acc;
    }, {});
    console.log('Stock iniziale:', initialStock);
    setLocalStock(initialStock);
  }, [products]);

  // Aggiorna lo stock locale solo per il prodotto cliccato
  const recalculateStock = (productClicked) => {
    console.log(`Ricalcolo stock per prodotto cliccato: ${productClicked.name}`);

    setLocalStock((prevStock) => {
      const updatedStock = { ...prevStock };
      updatedStock[productClicked.id] -= 1; // Decrementa solo il prodotto selezionato
      console.log('Stock locale aggiornato:', updatedStock);
      return updatedStock;
    });
  };

  // Gestisce il click su un prodotto
  const handleProductClick = (product) => {
    console.log(`Prodotto cliccato: ${product.name}`);

    if (localStock[product.id] <= 0) {
      console.log(`Stock insufficiente per ${product.name}. Azione annullata.`);
      return;
    }

    // Aggiunge il prodotto al carrello
    addProduct({ ...product, quantity: 1 });
    console.log(`Prodotto aggiunto al carrello: ${product.name}`);

    // Aggiorna lo stock locale
    recalculateStock(product);
  };

  return (
    <Grid container spacing={3}>
      {products.map((product) => {
        const stockPercentage = Math.max(0, (localStock[product.id] / product.stock) * 100);
        console.log(`Renderizzo ${product.name} con stock locale:`, localStock[product.id]);

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
              {/* Layer visivo dello stock */}
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
