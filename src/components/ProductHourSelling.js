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
import { getHourlyProductSales } from '../services/apiService';

// Registrazione dei componenti ChartJS
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const ProductHourSelling = () => {
  const [hourlyProductSales, setHourlyProductSales] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const salesData = await getHourlyProductSales();
        setHourlyProductSales(Object.entries(salesData));
      } catch (error) {
        console.error('Errore durante il recupero delle vendite orarie:', error);
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: hourlyProductSales.map(([key]) => key),
    datasets: [
      {
        label: 'Quantità Venduta',
        data: hourlyProductSales.map(([, value]) => value),
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
        title: {
          display: true,
          text: 'Orario - Prodotto',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Quantità Venduta',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center', height: 600 }}>
        <Typography variant="h5" gutterBottom>
          Top 10 Prodotti Venduti per Orario
        </Typography>
        <Bar data={data} options={options} />
      </Paper>
    </Container>
  );
};

export default ProductHourSelling;
