import React, { useState } from 'react';
import { Container, Grid, Paper, TextField, Button, Typography} from '@mui/material';

const Settings = ({ accessCode, setAccessCode, moneyNotes, setMoneyNotes, products, setProducts }) => {
  const [newAccessCode, setNewAccessCode] = useState('');
  const [newMoneyValue, setNewMoneyValue] = useState('');
  const [newCocktailName, setNewCocktailName] = useState('');
  const [newCocktailPrice, setNewCocktailPrice] = useState('');

  const handleAccessCodeChange = () => {
    setAccessCode(newAccessCode);
    alert('Codice di accesso aggiornato!');
    setNewAccessCode('');
  };

  const handleAddMoneyValue = () => {
    const value = parseFloat(newMoneyValue);
    if (!isNaN(value) && value > 0) {
      setMoneyNotes([...moneyNotes, { value }]);
      alert(`Valore di soldi aggiunto: €${value}`);
      setNewMoneyValue('');
    } else {
      alert('Inserisci un valore valido!');
    }
  };

  const handleAddCocktail = () => {
    const price = parseFloat(newCocktailPrice);
    if (newCocktailName && !isNaN(price) && price > 0) {
      setProducts([...products, { name: newCocktailName, price, quantity: 0 }]);
      alert(`Cocktail aggiunto: ${newCocktailName} - €${price}`);
      setNewCocktailName('');
      setNewCocktailPrice('');
    } else {
      alert('Inserisci un nome e un prezzo validi!');
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom align="center">
        Impostazioni
      </Typography>
      <Grid container spacing={3}>
        {/* Cambiare codice di accesso */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Cambia Codice di Accesso
            </Typography>
            <TextField
              label="Nuovo Codice di Accesso"
              type="password"
              fullWidth
              value={newAccessCode}
              onChange={(e) => setNewAccessCode(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleAccessCodeChange} fullWidth>
              Cambia Codice
            </Button>
          </Paper>
        </Grid>

        {/* Aggiungere valori di soldi */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Aggiungi Valore di Soldi
            </Typography>
            <TextField
              label="Nuovo Valore (es. 0.5, 2, 50)"
              type="number"
              fullWidth
              value={newMoneyValue}
              onChange={(e) => setNewMoneyValue(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" color="secondary" onClick={handleAddMoneyValue} fullWidth>
              Aggiungi Valore
            </Button>
          </Paper>
        </Grid>

        {/* Aggiungere cocktail */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Aggiungi Cocktail
            </Typography>
            <TextField
              label="Nome del Cocktail"
              fullWidth
              value={newCocktailName}
              onChange={(e) => setNewCocktailName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Prezzo del Cocktail (€)"
              type="number"
              fullWidth
              value={newCocktailPrice}
              onChange={(e) => setNewCocktailPrice(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" color="success" onClick={handleAddCocktail} fullWidth>
              Aggiungi Cocktail
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Settings;
