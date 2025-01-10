import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { getHourlySalesSummary } from '../services/apiService'; // Assicurati che l'API sia corretta

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const TopSellingHours = () => {
  const [hourlySales, setHourlySales] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHourlySalesSummary();
        setHourlySales(data);
      } catch (error) {
        console.error('Errore durante il recupero delle vendite orarie:', error);
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: hourlySales.map((item) => `${item.hour}:00`),
    datasets: [
      {
        label: 'Prodotti Venduti',
        data: hourlySales.map((item) => item.totalSales),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category',
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center', height: 600 }}>
        <Typography variant="h5" gutterBottom>
          Orari con Maggiori Vendite
        </Typography>
        <Bar data={data} options={options} />
      </Paper>
    </Container>
  );
};

export default TopSellingHours;
