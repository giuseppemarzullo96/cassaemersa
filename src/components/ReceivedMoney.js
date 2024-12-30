import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const ReceivedMoney = ({ moneyNotes, total, change }) => {
  const receivedTotal = moneyNotes.reduce((sum, note) => sum + note.value, 0);

  return (
<Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Denaro Ricevuto
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="body1">Totale: €{total}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">Ricevuto: €{receivedTotal}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">Resto: €{change}</Typography>
        </Grid>
      </Grid>
    </Paper>
    )
};

export default ReceivedMoney;
