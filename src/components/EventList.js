import React, { useState, useEffect, useContext } from 'react';
import Slider from 'react-slick';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Collapse,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import { getAllEvents, bookTicket, cancelTicket } from '../services/apiService';
import { AuthContext } from '../context/AuthContext';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const EventList = ({ reloadTickets }) => {
  const [events, setEvents] = useState([]);
  const [userTickets, setUserTickets] = useState([]);
  const { user, loading } = useContext(AuthContext);
  const [expanded, setExpanded] = useState({});
  const [buttonLoading, setButtonLoading] = useState({});
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    if (user) reloadEventsAndTickets();
  }, [user]);
  
  const reloadEventsAndTickets = async () => {
    try {
      console.log("Fetching events and tickets...");
      const fetchedEvents = await getAllEvents();
      const fetchedTickets = await reloadTickets(); // reloadTickets deve restituire i biglietti
  
      console.log("Fetched Events:", fetchedEvents);
      console.log("Fetched User Tickets:", fetchedTickets);
  
      setEvents(fetchedEvents);
      setUserTickets(fetchedTickets || []);
    } catch (error) {
      console.error("Errore durante il ricaricamento degli eventi e biglietti:", error);
    }
  };

  const handleBookTicket = async (eventId) => {
    setButtonLoading((prev) => ({ ...prev, [eventId]: true }));

    try {
      console.log('Booking ticket for event:', eventId);
      await bookTicket({ eventId, userId: user.uid });
      alert('Biglietto prenotato con successo!');
      await reloadEventsAndTickets();
    } catch (error) {
      console.error('Errore durante la prenotazione:', error);
      alert('Errore durante la prenotazione.');
    } finally {
      setButtonLoading((prev) => ({ ...prev, [eventId]: false }));
    }
  };

  const handleCancelTicket = async (ticketId) => {
    setButtonLoading((prev) => ({ ...prev, [ticketId]: true }));

    try {
      console.log('Cancelling ticket:', ticketId);
      await cancelTicket(ticketId);
      alert('Prenotazione annullata con successo!');
      await reloadEventsAndTickets();
    } catch (error) {
      console.error('Errore durante l\'annullamento della prenotazione:', error);
      alert('Errore durante l\'annullamento.');
    } finally {
      setButtonLoading((prev) => ({ ...prev, [ticketId]: false }));
    }
  };

  const toggleExpand = (eventId) => {
    setExpanded((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  const isBooked = (eventId) => {
    const booked = userTickets.some(ticket => ticket?.object?.eventId === eventId && ticket?.object?.userId === user?.uid);
    console.log(`Event ID ${eventId} is booked:`, booked);
    return booked;
  };

  const getTicketId = (eventId) => {
    const ticket = userTickets.find(ticket => ticket?.object?.eventId === eventId && ticket?.object?.userId === user?.uid);
    console.log(`Ticket ID for event ${eventId}:`, ticket?.object?.ticketId);
    return ticket ? ticket.object.ticketId : null;
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0px",
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 1 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  if (loading) {
    return <Typography variant="h4" align="center" sx={{ mt: 4 }}>Caricamento...</Typography>;
  }

  return (
    <div style={{ padding: '0' }}>
      {events.length > 0 ? (
        isMobile ? (
          <Slider {...settings}>
            {events.map((event) => (
              <EventCard
                key={event.key}
                event={event}
                isBooked={isBooked(event.key)}
                ticketId={getTicketId(event.key)}
                handleBookTicket={handleBookTicket}
                handleCancelTicket={handleCancelTicket}
                expanded={expanded[event.key]}
                toggleExpand={toggleExpand}
                buttonLoading={buttonLoading}
              />
            ))}
          </Slider>
        ) : (
          <Grid container spacing={3} sx={{ marginTop: '10px' }}>
            {events.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.key}>
                <EventCard
                  event={event}
                  isBooked={isBooked(event.key)}
                  ticketId={getTicketId(event.key)}
                  handleBookTicket={handleBookTicket}
                  handleCancelTicket={handleCancelTicket}
                  expanded={expanded[event.key]}
                  toggleExpand={toggleExpand}
                  buttonLoading={buttonLoading}
                />
              </Grid>
            ))}
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

const EventCard = ({ event, isBooked, ticketId, handleBookTicket, handleCancelTicket, expanded, toggleExpand, buttonLoading }) => {
  const { key, object } = event || {};
  const { photoUrl, name, date, location, price, availableTickets, totalTickets, description } = object || {};

  return (
    <Card
      sx={{
        borderRadius: '16px',
        boxShadow: 4,
        overflow: 'hidden',
        position: 'relative',
        transition: 'transform 0.3s',
        '&:hover': { transform: 'scale(1.03)' },
        margin: '10px',
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
        {isBooked ? (
          <Button
            variant="contained"
            color="error"
            onClick={() => handleCancelTicket(ticketId)}
            disabled={buttonLoading[ticketId]}
            fullWidth
            sx={{ borderRadius: '12px', fontWeight: 'bold', position: 'relative' }}
          >
            {buttonLoading[ticketId] ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Annulla Prenotazione'}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleBookTicket(key)}
            disabled={!availableTickets || buttonLoading[key]}
            fullWidth
            sx={{ borderRadius: '12px', fontWeight: 'bold', position: 'relative' }}
          >
            {buttonLoading[key] ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Prenota Biglietto'}
          </Button>
        )}
      </CardContent>
      <CardContent>
        <Button
          variant="text"
          color="primary"
          endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          onClick={() => toggleExpand(key)}
          fullWidth
        >
          {expanded ? 'Mostra Meno' : 'Mostra Descrizione'}
        </Button>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            {description || 'Nessuna descrizione disponibile.'}
          </Typography>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default EventList;
