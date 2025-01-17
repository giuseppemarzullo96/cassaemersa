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
  Container, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  CircularProgress, 
  Card, 
  CardMedia 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PeopleIcon from '@mui/icons-material/People';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../services/firebase';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { getAllEvents, createEvent, updateEvent, deleteEvent, getAllTickets, cancelTicket } from '../services/apiService';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [newEvent, setNewEvent] = useState({
    id: '',
    name: '',
    date: '',
    location: '',
    price: '',
    totalTickets: '',
    availableTickets: '',
    photoUrl: '',
    description: '',
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();
        setEvents(data);
      } catch (error) {
        console.error('Errore durante il caricamento degli eventi:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleEditEvent = (index, event) => {
    setNewEvent(event);
    setEditingIndex(index);
    setPreviewImage(event.photoUrl || null); // Mostra l'anteprima immagine corrente
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questo evento?')) {
      try {
        await deleteEvent(id);
        const updatedEvents = await getAllEvents();
        setEvents(updatedEvents);
      } catch (error) {
        console.error('Errore durante l\'eliminazione dell\'evento:', error);
      }
    }
  };

  const handleViewTickets = async (eventId) => {
  setSelectedEvent(eventId);
  setLoadingTickets(true);
  setOpenDialog(true);

  try {
    const allTickets = await getAllTickets();
    console.log('DEBUG: Biglietti recuperati:', allTickets);

    // Filtra i biglietti per l'evento selezionato
    const eventTickets = allTickets.filter((ticket) => 
      ticket?.eventId === eventId // Controlla direttamente su eventId
    );
    console.log('DEBUG: Biglietti per l\'evento:', eventTickets);

    setTickets(eventTickets);
  } catch (error) {
    console.error('Errore durante il caricamento dei biglietti:', error);
  } finally {
    setLoadingTickets(false);
  }
};

  const handleCancelTicket = async (ticketId) => {
    if (window.confirm('Sei sicuro di voler cancellare questo biglietto?')) {
      try {
        await cancelTicket(ticketId);
        setTickets((prev) => prev.filter((ticket) => ticket.key !== ticketId));
      } catch (error) {
        console.error('Errore durante la cancellazione del biglietto:', error);
      }
    }
  };

  const handleImageUpload = (file) => {
    if (!file) return;
    setPreviewImage(URL.createObjectURL(file)); // Mostra l'anteprima dell'immagine caricata

    const storageRef = ref(storage, `event-images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        console.log(`Caricamento immagine: ${progress}%`);
      },
      (error) => {
        console.error('Errore durante il caricamento dell\'immagine:', error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setNewEvent((prev) => ({ ...prev, photoUrl: downloadURL }));
        console.log('URL immagine caricata:', downloadURL);
      }
    );
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTickets([]);
    setSelectedEvent(null);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Elenco Biglietti', 10, 10);

    tickets.forEach((ticket, index) => {
      doc.text(
        `#${index + 1} Utente: ${ticket.username}, Biglietto ID: ${ticket.ticketId}, Data: ${new Date(ticket.timestamp).toLocaleString()}`,
        10,
        20 + index * 10
      );
    });

    doc.save(`biglietti.pdf`);
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      tickets.map((ticket) => ({
        Utente: ticket.username,
        'Biglietto ID': ticket.ticketId,
        Data: new Date(ticket.timestamp).toLocaleString(),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Biglietti');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `biglietti.xlsx`);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
  <Box 
    sx={{ 
      backgroundColor: '#f5f5f5', 
      borderRadius: '30px', 
      p: 4, 
      boxShadow: 1,
      display: 'flex', 
      flexDirection: 'column', 
      gap: 2 
    }}
  >
    <Typography variant="h6" gutterBottom textAlign="center">
      Gestione Eventi
    </Typography>

    <List sx={{ gap: 1, display: 'flex', flexDirection: 'column' }}>
      {events.map((event, index) => (
        <ListItem 
          key={index} 
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            {event.object.photoUrl && (
              <img
                src={event.object.photoUrl}
                alt={event.object.name}
                style={{ width: 50, height: 50, borderRadius: '8px' }}
              />
            )}
            <ListItemText
              primary={`${event.object.name} - ${new Date(event.object.date).toLocaleDateString()}`}
              secondary={`Biglietti disponibili: ${event.object.availableTickets}/${event.object.totalTickets}`}
              sx={{ flex: 1 }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={() => handleEditEvent(index, event.object)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDeleteEvent(event.object.id)}>
              <DeleteIcon />
            </IconButton>
            <IconButton onClick={() => handleViewTickets(event.object.id)}>
              <PeopleIcon />
            </IconButton>
          </Box>
        </ListItem>
      ))}
    </List>

    {previewImage && (
      <Card sx={{ mt: 2, mb: 2 }}>
        <CardMedia component="img" height="140" image={previewImage} alt="Anteprima Immagine" />
      </Card>
    )}

    {/* Modifica del form */}
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Nome Evento"
        fullWidth
        value={newEvent.name}
        onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
      />
      <TextField
        label="Data Evento"
        type="datetime-local"
        fullWidth
        value={newEvent.date}
        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Luogo"
        fullWidth
        value={newEvent.location}
        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
      />
      <TextField
        label="Prezzo (€)"
        type="number"
        fullWidth
        value={newEvent.price}
        onChange={(e) => setNewEvent({ ...newEvent, price: e.target.value })}
      />
      <TextField
        label="Biglietti Totali"
        type="number"
        fullWidth
        value={newEvent.totalTickets}
        onChange={(e) =>
          setNewEvent({ ...newEvent, totalTickets: e.target.value, availableTickets: e.target.value })
        }
      />
      <TextField
        label="Descrizione"
        fullWidth
        value={newEvent.description}
        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
      />
      <TextField
        label="URL Foto Evento"
        fullWidth
        value={newEvent.photoUrl}
        onChange={(e) => setNewEvent({ ...newEvent, photoUrl: e.target.value })}
        InputProps={{
          endAdornment: (
            <IconButton component="label">
              <AddPhotoAlternateIcon />
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0])}
              />
            </IconButton>
          ),
        }}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={() => {
          if (editingIndex !== null) {
            updateEvent(newEvent.id, newEvent);
          } else {
            createEvent(newEvent);
          }
        }}
      >
        {editingIndex !== null ? 'Aggiorna Evento' : 'Crea Evento'}
      </Button>
    </Box>
  </Box>

  {/* Dialog per biglietti */}
  <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
    <DialogTitle>Biglietti per l'evento</DialogTitle>
    <DialogContent>
      {loadingTickets ? (
        <CircularProgress />
      ) : (
        <List>
          {tickets.map((ticket) => (
            <ListItem key={ticket.ticketId}>
              <ListItemText
                primary={`Utente: ${ticket.username || 'Utente sconosciuto'}`}
                secondary={`Biglietto ID: ${ticket.ticketId} - Data: ${new Date(ticket.timestamp).toLocaleString()}`}
              />
              <IconButton onClick={() => handleCancelTicket(ticket.ticketId)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={handleDownloadPDF} color="primary" variant="contained">
        Scarica PDF
      </Button>
      <Button onClick={handleDownloadExcel} color="secondary" variant="contained">
        Scarica Excel
      </Button>
    </DialogActions>
  </Dialog>
</Container>

  );
};

export default EventManagement;
