import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import { getMaxProduction } from '../services/apiService';

const MaxProduction = () => {
  const [maxProduction, setMaxProduction] = useState([]);

  useEffect(() => {
    const fetchMaxProduction = async () => {
      try {
        const data = await getMaxProduction();
        console.log('Produzione Massima:', data); // Verifica i dati ricevuti
        setMaxProduction(data);
      } catch (error) {
        console.error('Errore durante il recupero della produzione massima:', error);
      }
    };

    fetchMaxProduction();
  }, []);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Produzione Massima per Prodotto
        </Typography>
        {maxProduction.length > 0 ? (
          <List>
            {maxProduction.map((product, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={product.productName}
                    secondary={`Quantità Massima: ${product.maxQuantity}`}
                  />
                </ListItem>
                {index < maxProduction.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography variant="body1" color="textSecondary">
            Nessun dato disponibile sulla produzione massima.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default MaxProduction;
