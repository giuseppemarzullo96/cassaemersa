import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';

const Header = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: 'primary.main' }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Gestione Cassa
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="./logo.svg"
            alt="Logo"
            style={{ width: '40px', height: '40px', marginLeft: '10px' }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
