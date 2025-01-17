import React, { useState, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { validateAccess, getAllEvents, getUserTickets } from '../services/apiService';
import { Container, Box, Typography, Button, Alert, CircularProgress, TextField } from '@mui/material';

const QrReader = () => {
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const html5QrCodeRef = useRef(null);

  const startScanner = async () => {
    if (isScanning) return;

    const html5QrCode = new Html5Qrcode('reader', {
      formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
    });

    html5QrCodeRef.current = html5QrCode;

    try {
      const cameras = await Html5Qrcode.getCameras();
      if (cameras.length === 0) {
        setCameraError('Nessuna fotocamera disponibile o permesso negato.');
        return;
      }

      const cameraId = cameras[0].id; // Usa la prima fotocamera disponibile
      setCameraError(null);

      await html5QrCode.start(
        cameraId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        handleValidation
      );
    } catch (err) {
      setCameraError('Errore nell\'accesso alla fotocamera. Controlla i permessi.');
      console.error(err);
    }
  };

  const stopScanner = async () => {
    if (!isScanning || !html5QrCodeRef.current) return;

    try {
      await html5QrCodeRef.current.stop();
      setIsScanning(false);
      console.log('Scanner fermato con successo');
    } catch (err) {
      console.warn('Errore nello stop dello scanner:', err);
    }
  };

  const handleValidation = async (decodedText) => {
    setLoading(true);
    setError(null);
    console.log('DEBUG: Decoded text:', decodedText);

    try {
      const [userId, eventId] = decodedText.split('_');
      console.log('DEBUG: User ID:', userId, 'Event ID:', eventId);

      // Recupera i ticket dell'utente
      const userTickets = await getUserTickets(userId);
      console.log('DEBUG: Tickets for user:', userTickets);

      // Trova il ticket corrispondente
      const ticket = userTickets.find((t) => t.key === decodedText);
      if (!ticket || !ticket.object?.username) {
        throw new Error('Impossibile trovare il biglietto o l\'username.');
      }
      const username = ticket.object.username;
      console.log('DEBUG: Username trovato:', username);

      // Prepara i dati per la validazione
      const validationPayload = {
        ticketId: decodedText,
        username,
      };
      console.log('DEBUG: Validation payload:', validationPayload);

      // Valida il biglietto
      const validationResponse = await validateAccess(validationPayload);
      console.log('DEBUG: Validation response:', validationResponse);

      if (validationResponse.success) {
        // Recupera tutti gli eventi
        const events = await getAllEvents();
        console.log('DEBUG: Retrieved events:', events);

        // Trova l'evento corrispondente
        const event = events.find((e) => e.object.id === eventId);
        console.log('DEBUG: Found event:', event);

        const eventName = event?.object?.name || 'Evento sconosciuto';
        setResult(`Accesso registrato per l'evento: ${eventName}`);
      } else {
        setError('Biglietto non valido.');
      }
    } catch (err) {
      console.error('DEBUG: Errore durante la validazione:', err);
      setError('Errore durante la validazione del biglietto.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualValidation = () => {
    if (!manualInput) {
      console.error('DEBUG: Inserimento manuale vuoto');
      setError('Inserisci un valore valido.');
      return;
    }
    console.log('DEBUG: Manual input:', manualInput);
    handleValidation(manualInput.trim());
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
        Scansione QR Code
      </Typography>

      <Box
        id="reader"
        sx={{
          width: '100%',
          maxWidth: 300,
          height: 300,
          mb: 2,
          border: '2px dashed #ddd',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {cameraError && (
          <Alert severity="error" sx={{ width: '100%' }}>
            {cameraError}
          </Alert>
        )}
      </Box>

      {loading && <CircularProgress sx={{ mb: 2 }} />}

      {isScanning && (
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          Scansione in corso...
        </Typography>
      )}

      {result && (
        <Alert severity="success" sx={{ mb: 2, width: '100%' }}>
          {result}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={startScanner}
          disabled={isScanning}
          sx={{ mt: 2 }}
        >
          Avvia Scansione
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={stopScanner}
          disabled={!isScanning}
          sx={{ mt: 2 }}
        >
          Ferma Scansione
        </Button>
      </Box>

      <Typography variant="h6" sx={{ mt: 4 }}>
        Inserimento Manuale
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
        <TextField
          label="Ticket ID"
          variant="outlined"
          value={manualInput}
          onChange={(e) => setManualInput(e.target.value)}
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={handleManualValidation}>
          Valida
        </Button>
      </Box>
    </Container>
  );
};

export default QrReader;
