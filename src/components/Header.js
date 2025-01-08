import React, { useState, useContext } from 'react';
import { AppBar, Toolbar, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Importa AuthContext

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { role } = useContext(AuthContext); // Ottieni il ruolo dal contesto

  const toggleDrawer = (open) => () => {
    setIsOpen(open);
  };

  // Voci del menu per ogni ruolo
  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, link: '/', roles: ['admin', 'user'] },
    { text: 'Cassa Bar', icon: <PointOfSaleIcon />, link: '/CassaBar', roles: ['admin'] },
    { text: 'Impostazioni', icon: <SettingsIcon />, link: '/Settings', roles: ['admin'] },
    { text: 'Login', icon: <SettingsIcon />, link: '/Login', roles: ['admin', 'user'] },
  ];

  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(role));

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#1565c0' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Gestione Bar
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={isOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: '250px',
            backgroundColor: '#f5f5f5',
            borderRadius: '0 20px 20px 0',
          },
        }}
      >
        <List>
          {filteredMenuItems.map((item, index) => (
            <ListItem
              button
              key={index}
              component={Link}
              to={item.link}
              onClick={toggleDrawer(false)}
              sx={{
                color: '#1565c0',
                width: '230px',
                borderRadius: '20px',
                margin: '10px',
                backgroundColor: '#ffffff',
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Header;
