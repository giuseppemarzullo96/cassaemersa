import React, { useState, useEffect, useContext } from 'react';
import Slider from 'react-slick';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  IconButton,
  Collapse,
  useMediaQuery,
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { getAllEvents, bookTicket } from '../services/apiService';
import { AuthContext } from '../context/AuthContext';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const { user, role, loading } = useContext(AuthContext);
  const [expanded, setExpanded] = useState({});

  // Hook per determinare se la visualizzazione è su mobile
  const isMobile = useMediaQuery('(max-width:600px)');

  console.log('Current user context:', user);
  console.log('Current user role:', role);
  console.log('Auth loading state:', loading);

  useEffect(() => {
    const fetchEvents = async () => {
      console.log('Fetching events...');
      try {
        const data = await getAllEvents();
        console.log('Fetched events data:', data);

        if (Array.isArray(data)) {
          setEvents(data);
          console.log('Events successfully set in state:', data);
        } else {
          console.error('Unexpected API response format:', data);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleBookTicket = async (eventId) => {
    console.log('Booking ticket for event ID:', eventId);

    if (loading) {
      alert('Caricamento in corso, riprova più tardi.');
      console.warn('Booking aborted: still loading user context.');
      return;
    }

    if (!user?.uid) {
      alert('Devi essere loggato per prenotare un biglietto.');
      console.warn('User is not logged in. Ticket booking aborted.');
      return;
    }

    try {
      const ticketRequest = { eventId, userId: user.uid };
      console.log('Sending ticket booking request:', ticketRequest);

      await bookTicket(ticketRequest);
      alert('Biglietto prenotato con successo!');
      console.log('Ticket successfully booked.');

      const updatedEvents = await getAllEvents();
      setEvents(updatedEvents);
    } catch (error) {
      console.error('Errore durante la prenotazione:', error);
      alert('Errore durante la prenotazione.');
    }
  };

  const toggleExpand = (eventId) => {
    setExpanded((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  // Configurazione del carosello (react-slick)
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true, // Centra le card
    centerPadding: "0px", // Rimuove il padding laterale
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  if (loading) {
    return (
      <Typography variant="h4" align="center" sx={{ mt: 4 }}>
        Caricamento...
      </Typography>
    );
  }

  return (
    <div style={{ padding: '0' }}>
      {events.length > 0 ? (
        isMobile ? (
          // Carosello per dispositivi mobili
          <Slider {...settings}>
            {events.map((event) => {
              const { key, object } = event || {};
              const { photoUrl, name, date, location, price, availableTickets, totalTickets, description } = object || {};

              return (
                <div key={key || object?.id} style={{ padding: '10px' }}>
                  <Card
                    sx={{
                      borderRadius: '16px',
                      
                      overflow: 'hidden',
                      position: 'relative',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'scale(1.03)',
                      },
                      margin:'10px',
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{ height: 'fit' }}
                      image={photoUrl || 'https://dummyimage.com/1080x1920/cccccc/ffffff'}
                      alt={name || 'Evento'}
                    />
                    <CardContent sx={{ padding: 2 }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#222' }}>
                        {name || 'Evento senza nome'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Data: {date ? new Date(date).toLocaleDateString() : 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Luogo: {location || 'Non specificato'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Prezzo: €{price ?? 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Biglietti disponibili: {availableTickets ?? 0}/{totalTickets ?? 0}
                      </Typography>
                    </CardContent>
                    <CardContent sx={{ padding: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleBookTicket(key)}
                        disabled={!availableTickets}
                        fullWidth
                        sx={{
                          borderRadius: '12px',
                          fontWeight: 'bold',
                        }}
                      >
                        Prenota Biglietto
                      </Button>
                      <IconButton
                        color="primary"
                        onClick={() => window.open(photoUrl, '_blank')}
                        aria-label="Condividi su Instagram"
                        sx={{ marginTop: 1 }}
                      >
                        <ShareIcon />
                      </IconButton>
                    </CardContent>
                    <CardContent>
                      <Button
                        variant="text"
                        color="primary"
                        endIcon={expanded[key] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        onClick={() => toggleExpand(key)}
                        fullWidth
                      >
                        {expanded[key] ? 'Mostra Meno' : 'Mostra Descrizione'}
                      </Button>
                      <Collapse in={expanded[key]} timeout="auto" unmountOnExit>
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                          {description || 'Nessuna descrizione disponibile.'}
                        </Typography>
                      </Collapse>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </Slider>
        ) : (
          // Lista per dispositivi desktop e tablet
          <Grid container spacing={3} sx={{ marginTop: '10px' }}>
            {events.map((event) => {
              const { key, object } = event || {};
              const { photoUrl, name, date, location, price, availableTickets, totalTickets, description } = object || {};

              return (
                <Grid item xs={12} sm={6} md={4} key={key || object?.id}>
                  <Card
                    sx={{
                      borderRadius: '16px',
                      boxShadow: 4,
                      overflow: 'hidden',
                      position: 'relative',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'scale(1.03)',
                      },
                      margin: '10px',
                    }}
                  >
                    
                    <CardContent sx={{ padding: 2 }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#222' }}>
                        {name || 'Evento senza nome'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Data: {date ? new Date(date).toLocaleDateString() : 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Luogo: {location || 'Non specificato'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Prezzo: €{price ?? 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Biglietti disponibili: {availableTickets ?? 0}/{totalTickets ?? 0}
                      </Typography>
                    </CardContent>
                    <CardContent sx={{ padding: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleBookTicket(key)}
                        disabled={!availableTickets}
                        fullWidth
                        sx={{
                          borderRadius: '12px',
                          fontWeight: 'bold',
                        }}
                      >
                        Prenota Biglietto
                      </Button>
                
                    </CardContent>
                    <CardContent>
                      <Button
                        variant="text"
                        color="primary"
                        endIcon={expanded[key] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        onClick={() => toggleExpand(key)}
                        fullWidth
                      >
                        {expanded[key] ? 'Mostra Meno' : 'Mostra Descrizione'}
                      </Button>
                      <Collapse in={expanded[key]} timeout="auto" unmountOnExit>
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                          {description || 'Nessuna descrizione disponibile.'}
                        </Typography>
                      </Collapse>
                    </CardContent><CardMedia
                      component="img"
                      sx={{ height: 'fit' }}
                      image={photoUrl || 'https://dummyimage.com/1080x1920/cccccc/ffffff'}
                      alt={name || 'Evento'}
                    />
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )
      ) : (
        <Typography variant="body1" align="center" sx={{ mt: 4 }}>
          Nessun evento disponibile.
        </Typography>
      )}
    </div>
  );
};

export default EventList;
