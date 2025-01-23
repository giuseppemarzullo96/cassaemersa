import React, { useState } from 'react';
import { Container, Box, Paper, Typography, Grid } from '@mui/material';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import BarChartIcon from '@mui/icons-material/BarChart';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import ReportIncoming from '../components/ReportIncoming';
import TopSellingProducts from '../components/TopSellingProducts';
import TopSellingHours from '../components/TopSellingHours';
import LatestTransaction from '../components/LatestTransaction';
import TransactionTable from '../components/TransactionTable';
import ProductHourSelling from '../components/ProductHourSelling';
import MaxProduction from '../components/MaxProduction';
import RawMaterialDashboard from '../components/RawMaterialsDashboard';
import QrReader from '../components/QrReader'; 
import AccessLog from '../components/AccessLog'; 
import AccessLogChart from '../components/AccessLogChart';

const PillTab = ({ icon, selected, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      width: 60,
      height: 60,
      borderRadius: '100%',
      backgroundColor: selected ? 'primary.main' : 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: selected ? 'white' : 'primary.main',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: selected ? '0px 4px 10px rgba(0, 0, 0, 0.2)' : 'none',
    }}
  >
    {icon}
  </Box>
);

const Home = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, mb: 6 }}>
      {/* Navigatore a Tab con stile a pillola */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 3,
          mb: 4,
          padding: '10px',
          backgroundColor: '#f5f5f5',
          borderRadius: '60px',
          width: 'fit-content',
        }}
      >
        <PillTab
          icon={<PointOfSaleIcon fontSize="large" />}
          selected={activeTab === 0}
          onClick={() => handleTabChange(0)}
        />
        <PillTab
          icon={<LocalBarIcon fontSize="large" />}
          selected={activeTab === 1}
          onClick={() => handleTabChange(1)}
        />
        <PillTab
          icon={<BarChartIcon fontSize="large" />}
          selected={activeTab === 2}
          onClick={() => handleTabChange(2)}
        />
        <PillTab
          icon={<QrCodeScannerIcon fontSize="large" />}
          selected={activeTab === 3}
          onClick={() => handleTabChange(3)}
        />
      </Box>

      {/* Contenuti delle tab */}
      {activeTab === 0 && (
        <Paper sx={{ width: '100%' }} elevation={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ReportIncoming />
              <LatestTransaction />
            </Grid>
            <Grid item xs={12} md={6}>
              <TransactionTable />
            </Grid>
          </Grid>
        </Paper>
      )}

      {activeTab === 1 && (
        <Paper sx={{ width: 1 }} elevation={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TopSellingProducts />
            </Grid>
            <Grid item xs={12} md={6}>
              <MaxProduction />
            </Grid>
            <Grid item xs={12} md={12}>
              <RawMaterialDashboard />
            </Grid>
          </Grid>
        </Paper>
      )}

      {activeTab === 2 && (
        <Paper sx={{ width: 1 }} elevation={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TopSellingHours />
            </Grid>
            <Grid item xs={12} md={6}>
              <ProductHourSelling />
            </Grid>
            <Grid item xs={12} md={12}>
              <AccessLogChart />
            </Grid>
          </Grid>
        </Paper>
      )}

      {activeTab === 3 && (
         <Paper sx={{ width: 1 }} elevation={0}>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center', p: 3 }}>
      <QrReader />
      <AccessLog />
    </Box>
  </Paper>
      )}
    </Container>
  );
};

export default Home;
