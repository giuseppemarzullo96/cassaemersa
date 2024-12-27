import React, { useState, useEffect } from 'react';
import './App.css';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue } from 'firebase/database';
import Header from './components/Header';
import Footer from './components/Footer';
import PopupAccess from './components/PopupAccess';
import Products from './components/Products';
import MoneyNotes from './components/MoneyNotes';
import ReceivedMoney from './components/ReceivedMoney';
import CashRegister from './components/CashRegister';
import Report from './components/Report';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Button from '@mui/material/Button';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

const firebaseConfig = {
  apiKey: "AIzaSyCRApnfbvd1OtVaXLjrrABUcYvVGvta9GI",
  authDomain: "cassa-emersa2.firebaseapp.com",
  databaseURL: "https://cassa-emersa2-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cassa-emersa2",
  storageBucket: "cassa-emersa2.appspot.com",
  messagingSenderId: "655203026786",
  appId: "1:655203026786:web:c1005f1fb97947c4cd4e3b"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App = () => {
  const [products, setProducts] = useState([]);
  const [moneyNotes, setMoneyNotes] = useState([]);
  const [total, setTotal] = useState(0);
  const [change, setChange] = useState(0);
  const [soldProducts, setSoldProducts] = useState([]);
  const [operationCount, setOperationCount] = useState(1);
  const [isPopupVisible, setIsPopupVisible] = useState(true);
  const [accessCode, setAccessCode] = useState('');

  const calculateReceivedTotal = () => {
    return moneyNotes.reduce((sum, note) => sum + note.value, 0);
  };

  useEffect(() => {
    setTotal(products.reduce((sum, product) => sum + product.price * product.quantity, 0));
    const receivedTotal = calculateReceivedTotal();
    setChange((receivedTotal - total).toFixed(2));
  }, [products, moneyNotes]);

  const resetOperation = () => {
    setProducts([]);
    setMoneyNotes([]);
    setTotal(0);
    setChange(0);
  };

  const saveDataToDatabase = () => {
    if (accessCode !== '0000') {
      alert('Codice di accesso non valido!');
      return;
    }
    const operationsRef = ref(database, 'operations');
    push(operationsRef, { operationNumber: operationCount, products, total });
    setOperationCount(operationCount + 1);
    resetOperation();
  };

  useEffect(() => {
    const productsRef = ref(database, 'products');
    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setSoldProducts(Object.values(data).flat());
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box my={4}>
          {isPopupVisible && (
            <PopupAccess
              accessCode={accessCode}
              setAccessCode={setAccessCode}
              setIsPopupVisible={setIsPopupVisible}
            />
          )}
          <Header />
          <Typography variant="h4" component="h1" gutterBottom>
            Gestione Cassa
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Products products={products} setProducts={setProducts} />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <MoneyNotes moneyNotes={moneyNotes} setMoneyNotes={setMoneyNotes} />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <ReceivedMoney moneyNotes={moneyNotes} total={total} change={change} />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <CashRegister
                  products={products}
                  total={total}
                  change={change}
                  saveDataToDatabase={saveDataToDatabase}
                  resetOperation={resetOperation}
                />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Report soldProducts={soldProducts} />
              </Paper>
            </Grid>
          </Grid>
          <Footer />
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
