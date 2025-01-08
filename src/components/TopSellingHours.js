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
import { getAllTransactions } from '../services/apiService';

// Registrazione dei componenti necessari
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const TopSellingHours = () => {
  const [hourlySales, setHourlySales] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactions = await getAllTransactions();
        const salesByHour = Array(24).fill(0);

        transactions.forEach(transaction => {
          const hour = new Date(transaction.timestamp).getHours();
          const totalProducts = transaction.products.reduce((sum, product) => sum + product.quantitysold, 0);
          salesByHour[hour] += totalProducts;
        });

        setHourlySales(salesByHour);
      } catch (error) {
        console.error('Errore durante il recupero delle transazioni:', error);
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: 'Prodotti Venduti',
        data: hourlySales,
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
    <Container maxWidth="tm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ pb: 8, pr: 4, pl: 4, pt:4, textAlign: 'center', height: 600 }}>
        <Typography variant="h5" gutterBottom>
          Orari con Maggiori Vendite
        </Typography>
        <Bar data={data} options={options} />
      </Paper>
    </Container>
  );
};

export default TopSellingHours;
