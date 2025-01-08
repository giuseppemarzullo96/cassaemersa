import React from 'react';
import { Grid, Container, Typography } from '@mui/material';
import ReportIncoming from '../components/ReportIncoming';
import TopSellingProducts from '../components/TopSellingProducts';
import TopSellingHours from '../components/TopSellingHours';

const Home = () => {
  return (
    <Container maxWidth="100%" sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h4" gutterBottom align="center">
        Dashboard
      </Typography>
      <Grid container spacing={1}>
        {/* Report Incassi Totali */}
        <Grid item xs={12} md={4}>
          <ReportIncoming />
        </Grid>

        {/* Prodotti più venduti */}
        <Grid item xs={12} md={4}>
          <TopSellingProducts />
        </Grid>

        {/* Ore di vendita più attive */}
        <Grid item xs={12}md={4}>
          <TopSellingHours />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
