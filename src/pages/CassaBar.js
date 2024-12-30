import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Paper, Box, Container, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import Products from '../components/Products';
import MoneyNotes from '../components/MoneyNotes';
import ReceivedMoney from '../components/ReceivedMoney';
import CashRegister from '../components/CashRegister';
import Report from '../components/Report';

const CassaBar = ({
  products,
  setProducts,
  moneyNotes,
  setMoneyNotes,
  total,
  setTotal,
  change,
  setChange,
  soldProducts,
  setSoldProducts,
  operationCount,
  setOperationCount,
  accessCode,
  setAccessCode,
  saveDataToDatabase,
  resetOperation,
}) => {
  const [openPopup, setOpenPopup] = useState(true);
  const [inputCode, setInputCode] = useState('');
  const navigate = useNavigate();

  // Controlla il codice di accesso al caricamento
  const handleAccess = () => {
    if (inputCode === '0000') {
      setAccessCode(inputCode);
      setOpenPopup(false);
    } else {
      alert('Codice di accesso non valido!');
      setInputCode('');
    }
  };

  // Reindirizza alla home se l'utente chiude il popup senza inserire il codice
  const handleClosePopup = () => {
    navigate('/');
  };

  useEffect(() => {
    if (moneyNotes && setChange) {
      const receivedTotal = moneyNotes.reduce((sum, note) => sum + note.value, 0);
      setChange((receivedTotal - total).toFixed(2));
    }
  }, [moneyNotes, total, setChange]);

  return (
    <Container maxWidth="80%">
      {/* Popup per il codice di accesso */}
      <Dialog open={openPopup} onClose={handleClosePopup}>
        <DialogTitle>Inserisci il Codice di Accesso</DialogTitle>
        <DialogContent>
          <TextField
            label="Codice di Accesso"
            type="password"
            fullWidth
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} color="secondary">
            Annulla
          </Button>
          <Button onClick={handleAccess} color="primary">
            Conferma
          </Button>
        </DialogActions>
      </Dialog>

      {/* Contenuto principale della pagina */}
      <Box my={4}>
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
      </Box>
    </Container>
  );
};

export default CassaBar;
