import React, { useState, useEffect } from 'react'; 
import { List, ListItem, ListItemText, Typography, Box, Divider } from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react'; // Importa il QR Code
import { getAllEvents } from '../services/apiService';

const UserTickets = ({ tickets, loading, error }) => {
  const [events, setEvents] = useState({});
  const [eventsLoading, setEventsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const allEvents = await getAllEvents();
        const eventsMap = allEvents.reduce((acc, event) => {
          acc[event.key] = event.object;
          return acc;
        }, {});
        setEvents(eventsMap);
      } catch (err) {
        console.error('Errore durante il recupero degli eventi:', err);
      } finally {
        setEventsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading || eventsLoading) return <Typography>Caricamento dei dati...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        I Miei Biglietti
      </Typography>
      {tickets.length === 0 ? (
        <Typography>Non hai ancora prenotato alcun biglietto.</Typography>
      ) : (
        <List>
          {tickets.map((ticket, index) => {
            const ticketData = ticket.object || {};
            const ticketId = ticketData.ticketId || 'ID biglietto non disponibile';
            const eventId = ticketData.eventId || 'Evento sconosciuto';
            const timestamp = ticketData.timestamp
              ? new Date(ticketData.timestamp).toLocaleString()
              : 'Data non disponibile';

            const event = events[eventId];
            const eventName = event ? event.name : 'Nome evento non disponibile';
            const eventDate = event ? new Date(event.date).toLocaleString() : 'Data evento non disponibile';
            const location = event ? event.location : 'Luogo non disponibile';

            return (
              <ListItem key={index} sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: 400,
                    border: '2px dashed #ddd',
                    borderRadius: '16px',
                    backgroundColor: '#f9f9f9',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  {/* Intestazione del biglietto */}
                  <Box
                    sx={{
                      backgroundColor: '#4caf50',
                      color: '#fff',
                      p: 2,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="h6">{eventName}</Typography>
                  </Box>

                  {/* Corpo del biglietto */}
                  <Box sx={{ p: 2 }}>
                    <Typography variant="body1" gutterBottom>
                      <strong>Data Evento:</strong> {eventDate}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Luogo:</strong> {location}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Prenotato il: {timestamp}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    {/* QR Code */}
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                      <QRCodeCanvas value={ticketId} size={128} />
                    </Box>
                  </Box>
                </Box>
              </ListItem>
            );
          })}
        </List>
      )}
    </Box>
  );
};

export default UserTickets;
