import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Grid, CircularProgress, Button, TextField } from '@mui/material';
import { getAccessLogs, getAllEvents } from '../services/apiService';

const AccessLog = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLogsAndEvents = async () => {
    setLoading(true);
    try {
      const [logsResponse, eventsResponse] = await Promise.all([getAccessLogs(), getAllEvents()]);

      console.log('DEBUG: Risposta API AccessLogs:', logsResponse);
      console.log('DEBUG: Risposta API GetAllEvents:', eventsResponse);

      if (logsResponse.success && Array.isArray(logsResponse.data)) {
        const logsWithEventNames = logsResponse.data.map((log) => {
          const event = eventsResponse.find((e) => e.key === log.ticketId.split('_')[1]);
          return {
            ...log,
            eventName: event?.object?.name || 'Evento sconosciuto',
          };
        });
        setLogs(logsWithEventNames);
        setFilteredLogs(logsWithEventNames); // Inizialmente tutti i log sono mostrati
      } else {
        setError('Errore durante il recupero dei log degli accessi.');
      }

      if (!eventsResponse || eventsResponse.length === 0) {
        setError('Errore durante il recupero degli eventi.');
      } else {
        setEvents(eventsResponse);
      }
    } catch (err) {
      console.error('Errore:', err);
      setError('Errore durante il caricamento dei log o degli eventi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogsAndEvents();
  }, []);

  const handleRefresh = () => {
    fetchLogsAndEvents();
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === '') {
      setFilteredLogs(logs); // Se il termine di ricerca è vuoto, mostra tutti i log
    } else {
      const filtered = logs.filter(
        (log) =>
          log.ticketId.toLowerCase().includes(term) ||
          log.username.toLowerCase().includes(term) ||
          log.eventName.toLowerCase().includes(term) ||
          new Date(log.timestamp).toLocaleString().toLowerCase().includes(term)
      );
      setFilteredLogs(filtered);
    }
  };

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        mt: 4,
        p: 2,
        bgcolor: '#f9f9f9',
        borderRadius: '12px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 2,
          fontWeight: 'bold',
          textAlign: 'center',
          color: 'primary.main',
        }}
      >
        Log degli Accessi
      </Typography>
      <TextField
        label="Cerca..."
        variant="outlined"
        value={searchTerm}
        onChange={handleSearch}
        sx={{ mb: 2, width: '100%' }}
        placeholder="Cerca per Ticket ID, Nome Utente, Evento o Data"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleRefresh}
        sx={{ mb: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Aggiorna'}
      </Button>
      {error && <Typography color="error">{error}</Typography>}
      {loading ? (
        <CircularProgress />
      ) : Array.isArray(filteredLogs) && filteredLogs.length > 0 ? (
        <Grid container spacing={2}>
          {filteredLogs.map((log) => (
            <Grid item xs={12} sm={6} md={4} key={log.key}>
              <Card
                sx={{
                  borderRadius: '12px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  bgcolor: '#fff',
                }}
              >
                <CardContent>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    Ticket ID: {log.ticketId || 'ID non disponibile'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Username:</strong> {log.username || 'Utente sconosciuto'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Data:</strong> {new Date(log.timestamp).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Evento:</strong> {log.eventName || 'Evento sconosciuto'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" sx={{ mt: 2 }}>
          Nessun log trovato.
        </Typography>
      )}
    </Container>
  );
};

export default AccessLog;
