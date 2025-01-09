import React, { useState, useContext, useEffect } from 'react';
import { AppBar, Toolbar, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Typography, Box, Avatar } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Importa AuthContext
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase'; // Importa Firestore

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { role, user, handleLogout } = useContext(AuthContext);
  const [username, setUsername] = useState(''); // Stato per il nome utente

  useEffect(() => {
    const fetchUsername = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUsername(userDoc.data().username || 'Utente');
          }
        } catch (error) {
          console.error('Errore durante il recupero del nome utente:', error);
        }
      }
    };

    fetchUsername();
  }, [user]);

  const toggleDrawer = (open) => () => {
    setIsOpen(open);
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, link: '/', roles: ['admin', 'user'] },
    { text: 'Cassa Bar', icon: <PointOfSaleIcon />, link: '/CassaBar', roles: ['admin'] },
    { text: 'Impostazioni', icon: <SettingsIcon />, link: '/Settings', roles: ['admin', 'user'] },
    { 
      text: user ? 'Logout' : 'Login', 
      icon: user ? <LogoutIcon /> : <LoginIcon />, 
      link: user ? '/' : '/Login', 
      roles: ['admin', 'user'], 
      action: user ? handleLogout : null 
    },
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
            Gestione Eventi
          </Typography>
          {user && (
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar sx={{ bgcolor: '#1976d2' }}>
                {username.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="body1" sx={{ color: '#fff' }}>
                {username}
              </Typography>
            </Box>
          )}
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
              onClick={item.action || toggleDrawer(false)}
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
