import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import EventList from '../components/EventList';

const Ticket = () => {
  return (
    <Container sx={{ m:0}}>
      <Box sx={{ textAlign: 'center', mb: 0, p:0 }}>
        <Typography variant="h4" gutterBottom>
          Acquista Biglietti
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Esplora gli eventi disponibili e prenota i tuoi biglietti.
        </Typography>
      </Box >
      <EventList />
    </Container>
  );
};

export default Ticket;
