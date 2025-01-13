import React, { useState, useEffect } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  IconButton, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Container 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { getAllEvents, createEvent, updateEvent, deleteEvent } from '../services/apiService';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    id: '',
    name: '',
    date: '',
    location: '',
    price: '',
    totalTickets: '',
    availableTickets: '',
    photoUrl: '',
    description:'',
  });
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log('Fetching all events...'); // Log iniziale
        const data = await getAllEvents();
        console.log('Events retrieved:', data); // Log dei dati recuperati
        setEvents(data);
      } catch (error) {
        console.error('Errore durante il caricamento degli eventi:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleEditEvent = (index, event) => {
    console.log('Editing event:', event); // Log dettagliato
    setNewEvent(event);
    setEditingIndex(index);
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questo evento?')) {
      try {
        console.log(`Deleting event with ID: ${id}`); // Log dell'ID eliminato
        await deleteEvent(id);
        const updatedEvents = await getAllEvents();
        setEvents(updatedEvents);
      } catch (error) {
        console.error('Errore durante l\'eliminazione dell\'evento:', error);
      }
    }
  };
  

  const handleSaveEvent = async () => {
    if (!newEvent.name || !newEvent.date || !newEvent.location || !newEvent.price || !newEvent.totalTickets || !newEvent.description) {
      alert('Completa tutti i campi obbligatori.');
      return;
    }
  
    try {
      if (editingIndex !== null) {
        console.log('Attempting to update event:', newEvent); // Log dettagliato
        await updateEvent(newEvent.id, newEvent);
      } else {
        console.log('Creating new event:', newEvent); // Log dettagliato
        await createEvent(newEvent);
      }
  
      setNewEvent({
        id: '',
        name: '',
        date: '',
        location: '',
        price: '',
        totalTickets: '',
        availableTickets: '',
        photoUrl: '',
        description:'',
      });
      setEditingIndex(null);
  
      const updatedEvents = await getAllEvents();
      console.log('Updated events list after save:', updatedEvents); // Log lista aggiornata
      setEvents(updatedEvents);
    } catch (error) {
      console.error('Errore durante il salvataggio dell\'evento:', error);
    }
  };
  

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ backgroundColor: '#f5f5f5', borderRadius: '30px', p: 4, boxShadow: 1 }}>
        <Typography variant="h6" gutterBottom>
          Gestione Eventi
        </Typography>
        <List>
  {events.map((event, index) => (
    <ListItem key={index}>
      <ListItemText
        primary={`${event.object.name} - ${new Date(event.object.date).toLocaleDateString()} - €${event.object.price}`}
        secondary={`Biglietti disponibili: ${event.object.availableTickets}/${event.object.totalTickets}`}
      />
      <IconButton onClick={() => handleEditEvent(index, event.object)}>
        <EditIcon />
      </IconButton>
      <IconButton onClick={() => handleDeleteEvent(event.object.id)}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  ))}
</List>

        <TextField
          label="Nome Evento"
          fullWidth
          value={newEvent.name}
          onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
          sx={{ mt: 2 }}
        />
        <TextField
          label="Data Evento"
          type="datetime-local"
          fullWidth
          value={newEvent.date}
          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          sx={{ mt: 2 }}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Luogo"
          fullWidth
          value={newEvent.location}
          onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
          sx={{ mt: 2 }}
        />
        <TextField
          label="Prezzo (€)"
          type="number"
          fullWidth
          value={newEvent.price}
          onChange={(e) => setNewEvent({ ...newEvent, price: e.target.value })}
          sx={{ mt: 2 }}
        />
        <TextField
          label="Biglietti Totali"
          type="number"
          fullWidth
          value={newEvent.totalTickets}
          onChange={(e) => setNewEvent({ ...newEvent, totalTickets: e.target.value, availableTickets: e.target.value })}
          sx={{ mt: 2 }}
        />
        <TextField
          label="Description"
          fullWidth
          value={newEvent.description}
          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
          sx={{ mt: 2 }}
        />
        <TextField
          label="URL Foto Evento"
          fullWidth
          value={newEvent.photoUrl}
          onChange={(e) => setNewEvent({ ...newEvent, photoUrl: e.target.value })}
          sx={{ mt: 2 }}
          InputProps={{
            endAdornment: (
              <IconButton>
                <AddPhotoAlternateIcon />
              </IconButton>
            ),
          }}
        />
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleSaveEvent}>
          {editingIndex !== null ? 'Aggiorna Evento' : 'Crea Evento'}
        </Button>
      </Box>
    </Container>
  );
};

export default EventManagement;
