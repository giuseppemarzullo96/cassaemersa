import React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        py: 3,
        px: 2,
        mt: 4,
      }}
    >
      <Grid container spacing={2} alignItems="center" justifyContent="space-between">
        <Grid item xs={12} sm={12}>
          <Typography variant="body2" align="center">
            Copyright © 2023 Emersa. Tutti i diritti riservati.
          </Typography>
          <Typography variant="body2" align="center">
            Prodotto da Giuseppe Marzullo
          </Typography>
        </Grid>
        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
      </Grid>
    </Box>
  );
};

export default Footer;
