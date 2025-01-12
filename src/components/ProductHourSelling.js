import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper } from '@mui/material';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { getHourlyProductSales } from '../services/apiService';

// Registrazione dei componenti ChartJS
ChartJS.register(CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const ProductHourSelling = () => {
  const [scatterData, setScatterData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const salesData = await getHourlyProductSales();
        console.log('Dati originali:', salesData);
        const transformedData = transformToScatterData(salesData);
        console.log('Dati trasformati per Scatter Chart:', transformedData);
        setScatterData(transformedData);
      } catch (error) {
        console.error('Errore durante il recupero delle vendite orarie:', error);
      }
    };

    fetchData();
  }, []);

  // Trasforma i dati per il grafico Scatter
  const transformToScatterData = (salesData) => {
    const data = [];
    
    // Genera tutte le fasce orarie da 00:00 a 23:30
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of [0, 30]) {
        const time = `${hour.toString().padStart(2, '0')}:${minute === 0 ? '00' : '30'}`;
        
        // Filtra i dati per questa fascia oraria
        Object.entries(salesData).forEach(([key, value]) => {
          const [dataTime, product] = key.split(' - ');
          if (dataTime === time) {
            data.push({
              x: hour + minute / 60, // Converti in formato decimale
              y: product,
              r: value, // Quantità venduta
            });
          }
        });
      }
    }
  
    return data;
  };

  const chartData = {
    datasets: [
      {
        label: 'Vendite per prodotto e orario',
        data: scatterData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'Orario (formato decimale)',
        },
        ticks: {
          callback: (value) => `${Math.floor(value)}:${(value % 1) * 60 === 0 ? '00' : '30'}`,
        },
      },
      y: {
        type: 'category',
        title: {
          display: true,
          text: 'Prodotti',
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `Venduto: ${context.raw.r} pezzi`,
        },
      },
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper
        sx={{
          backgroundColor: '#f5f5f5',
          borderRadius: '30px',
          p: 4,
          boxShadow: 1,
          height: '600px',
          overflow: 'hidden',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Vendite Orarie per Prodotto
        </Typography>
        <div style={{ height: '600px' }}>
          <Scatter data={chartData} options={options} />
        </div>
      </Paper>
    </Container>
  );
};

export default ProductHourSelling;
