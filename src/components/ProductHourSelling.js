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

// Registrazione dei componenti ChartJS
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const ProductHourSelling = () => {
  const [hourlyProductSales, setHourlyProductSales] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactions = await getAllTransactions();
        const salesData = {};

        transactions.forEach(transaction => {
          const hour = new Date(transaction.timestamp).getHours();
          transaction.products.forEach(product => {
            const key = `${hour}:00 - ${product.name}`;
            salesData[key] = (salesData[key] || 0) + product.quantitysold;
          });
        });

        const sortedSalesData = Object.entries(salesData)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10); // Prendi solo i top 10

        setHourlyProductSales(sortedSalesData);
      } catch (error) {
        console.error('Errore durante il recupero delle transazioni:', error);
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
