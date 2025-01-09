import React, { useContext , useState } from 'react';
import { Grid, Container, Typography } from '@mui/material';
import ReportIncoming from '../components/ReportIncoming';
import TopSellingProducts from '../components/TopSellingProducts';
import TopSellingHours from '../components/TopSellingHours';
import LatestTransaction from '../components/LatestTransaction';
import { AppContext } from '../context/AppContext';
import TransactionTable from '../components/TransactionTable';
import ProductHourSelling from '../components/ProductHourSelling';


const Home = () => {const {
  } = useContext(AppContext);
 
  const [reloadTransaction, setReloadTransaction] = useState(false);

const refreshLatestTransaction = () => {
    setReloadTransaction(prev => !prev); // Cambia stato per triggerare il ricaricamento
  };

  return (
    <Container maxWidth="100%" sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h4" gutterBottom align="center">
              Dashboard
            </Typography>
      <Grid container spacing={1}>
        <Grid item xs={12} md={4}>
          <ReportIncoming reload={reloadTransaction}/>
          <LatestTransaction reload={reloadTransaction}/>
          <TransactionTable/>
        </Grid>
        <Grid item xs={12} md={4}>
          <TopSellingProducts reload={reloadTransaction}/>
          
        </Grid>
        <Grid item xs={12} md={4}>
          <TopSellingHours reload={reloadTransaction}/>
          <ProductHourSelling/>
        </Grid>
      </Grid>
    </Container>
    
  );
};

export default Home;
