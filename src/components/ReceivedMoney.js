import React from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Container } from '@mui/material';
import Box from '@mui/material/Box';

const ReceivedMoney = ({ moneyNotes }) => {
  const receivedTotal = moneyNotes.reduce((sum, note) => sum + note.value, 0);

  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        Banconote Ricevute
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" flexWrap="wrap" gap={2}>
            {moneyNotes.map((note, index) => (
              <Paper
                key={index}
                elevation={3}
                sx={{
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '80px',
                  borderRadius: '8px',
                  backgroundColor: '#f5f5f5',
                }}
              >
                <Typography variant="body1">€{note.value.toFixed(2)}</Typography>
              </Paper>
            ))}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Totale Ricevuto: €{receivedTotal.toFixed(2)}
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ReceivedMoney;
