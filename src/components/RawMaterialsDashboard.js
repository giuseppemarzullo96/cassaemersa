import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, LinearProgress, Paper, Container } from '@mui/material';
import { getAllRawMaterials } from '../services/apiService';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';

const RawMaterialsDashboard = () => {
  const [rawMaterials, setRawMaterials] = useState([]);

  useEffect(() => {
    const fetchRawMaterials = async () => {
      try {
        const data = await getAllRawMaterials();
        setRawMaterials(data);
      } catch (error) {
        console.error('Errore durante il recupero delle materie prime:', error);
      }
    };

    fetchRawMaterials();
  }, []);

  const getBottleFillLevel = (stock) => {
    if (stock >= 75) return 'rgba(0, 128, 0, 0.8)'; // Verde
    if (stock >= 50) return 'rgba(255, 165, 0, 0.8)'; // Arancione
    if (stock > 0) return 'rgba(255, 69, 0, 0.8)'; // Rosso
    return 'rgba(128, 128, 128, 0.8)'; // Grigio (esaurito)
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
    <Paper sx={{
      backgroundColor: '#f5f5f5',
      borderRadius: '30px',
      p: 4,
      boxShadow: 1,
    }}><Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom align="center">
      Materie Prime
      </Typography>
      <Grid container spacing={3}>
        {rawMaterials.map((material, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <LocalDrinkIcon
                    sx={{
                      fontSize: 40,
                      color: getBottleFillLevel(material.stock),
                    }}
                  />
                  <Typography variant="h6">{material.name}</Typography>
                </Box>
                <Typography>Unità: {material.unit}</Typography>
                <Typography>Costo: €{material.cost.toFixed(2)} / {material.unit}</Typography>
                <Box mt={2}>
                  <Typography variant="body2" color="textSecondary">
                    Stock: {material.stock.toFixed(1)}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(material.stock / 1000) * 100} // Supponiamo che 100 sia il massimo
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: 'rgba(0, 0, 0, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getBottleFillLevel(material.stock),
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box></Paper></Container>
  );
};

export default RawMaterialsDashboard;
