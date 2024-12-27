import React from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

const ReceivedMoney = ({ moneyNotes, total, change }) => {
  const receivedTotal = moneyNotes.reduce((sum, note) => sum + note.value, 0);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Denaro Ricevuto
      </Typography>
      <Box>
        <Typography variant="body1">Totale: €{total}</Typography>
        <Typography variant="body1">Ricevuto: €{receivedTotal}</Typography>
        <Typography variant="body1">Resto: €{change}</Typography>
      </Box>
    </Paper>
  );
};

export default ReceivedMoney;
