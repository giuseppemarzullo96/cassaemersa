import React, { useEffect, useState, useContext } from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import EventList from '../components/EventList';
import UserTickets from '../components/UserTickets';
import { getUserTickets } from '../services/apiService';
import { AuthContext } from '../context/AuthContext';

const Ticket = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reloadTickets = async () => {
    if (!user || !user.uid) {
      setError('Utente non autenticato.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userTickets = await getUserTickets(user.uid);
      setTickets(userTickets);
    } catch (err) {
      console.error('Errore durante il recupero dei biglietti:', err);
      setError('Errore durante il recupero dei biglietti.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadTickets();
  }, [user]);

  return (
    <Container maxWidth="1" sx={{ m: 0, mt: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Acquista Biglietti
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Esplora gli eventi disponibili e prenota i tuoi biglietti.
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center" alignItems="flex-start">
        {/* Lista degli eventi */}
        <Grid item xs={12} md={9}>
          <EventList reloadTickets={reloadTickets} />
        </Grid>

        {/* I miei biglietti */}
        <Grid item xs={12} md={3}>
          <UserTickets tickets={tickets} loading={loading} error={error} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Ticket;
