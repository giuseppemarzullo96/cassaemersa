import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { getAccessLogs } from '../services/apiService';
import { Container, Typography, CircularProgress, useMediaQuery } from '@mui/material';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AccessLogChart = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isMobile = useMediaQuery('(max-width:600px)'); // Controlla se è un dispositivo mobile

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const response = await getAccessLogs();
        console.log('DEBUG: Risposta API AccessLogs:', response);

        if (response.success && Array.isArray(response.data)) {
          const logs = response.data;

          // Raggruppa i log per ora
          const logsByHour = logs.reduce((acc, log) => {
            const hour = new Date(log.timestamp).getHours();
            acc[hour] = (acc[hour] || 0) + 1;
            return acc;
          }, {});

          // Prepara i dati per il grafico
          const labels = Array.from({ length: 24 }, (_, i) => `${i}:00 - ${i + 1}:00`);
          const counts = labels.map((_, i) => logsByHour[i] || 0);

          setData({
            labels,
            datasets: [
              {
                label: 'Numero di validazioni',
                data: counts,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          });
        } else {
          setError('Errore durante il recupero dei log.');
        }
      } catch (err) {
        console.error('Errore:', err);
        setError('Errore durante il caricamento dei dati.');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!data) {
    return null;
  }

  return (
    <Container
      sx={{
        mt: 4,
        p: 2,
        bgcolor: '#f9f9f9',
        borderRadius: '12px',
        boxShadow: 1,
        maxWidth: '100%', // Limita la larghezza
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 2,
          fontWeight: 'bold',
          textAlign: 'center',
          fontSize: isMobile ? '1.5rem' : '2rem', // Dimensione testo per mobile/desktop
        }}
      >
        Affluenza per Ora
      </Typography>
      <div
        style={{
          maxWidth: isMobile ? '100%' : '80%', // Limita larghezza
          maxHeight: '500px', // Limita altezza
          margin: '0 auto', // Centra il grafico
        }}
      >
        <Bar
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: true, // Mantiene le proporzioni
            plugins: {
              legend: { display: false },
              tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.raw} validazioni` } },
            },
            scales: {
              x: {
                title: { display: true, text: 'Orario', font: { size: isMobile ? 12 : 16 } },
                ticks: { font: { size: isMobile ? 10 : 14 } },
              },
              y: {
                title: { display: true, text: 'Numero di Validazioni', font: { size: isMobile ? 12 : 16 } },
                ticks: { font: { size: isMobile ? 10 : 14 } },
                beginAtZero: true,
              },
            },
            layout: {
              padding: 2, // Margine interno per leggibilità
            },
          }}
        />
      </div>
    </Container>
  );
};

export default AccessLogChart;
