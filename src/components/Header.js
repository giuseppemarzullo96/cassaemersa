import React, { useState, useContext, useEffect } from 'react';
import { AppBar, Toolbar, Drawer, IconButton, Typography, Box, Avatar } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { role, user, handleLogout } = useContext(AuthContext);
  const [username, setUsername] = useState('');

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

  const handleLogoutClick = () => {
    setIsOpen(false); // Chiude il drawer
    handleLogout(); // Esegue il logout
  };

  const menuItems = [
    { icon: <HomeIcon />, link: '/', roles: ['admin', 'user'] },
    { icon: <PointOfSaleIcon />, link: '/CassaBar', roles: ['admin'] },
    { icon: <SettingsIcon />, link: '/Settings', roles: ['admin', 'user'] },
    {
      icon: user ? <LogoutIcon /> : <LoginIcon />,
      link: user ? '/' : '/Login',
      roles: ['admin', 'user'],
      action: user ? handleLogoutClick : null,
    },
  ];

  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(role));

  return (
    <AppBar position="static" sx={{ boxShadow: 'none', backgroundColor: '#1565c0' }}>
      <Toolbar>
        {user && (
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Gestione Eventi
        </Typography>
        {user && (
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar sx={{ bgcolor: '#1976d2' }}>
              {username.charAt(0).toUpperCase()}
            </Avatar>
            <Typography
              variant="body1"
              sx={{
                color: '#fff',
                display: { xs: 'none', sm: 'block' }, // Nasconde il nome su schermi piccoli
              }}
            >
              {username}
            </Typography>
          </Box>
        )}
      </Toolbar>

      <Drawer
        anchor="left"
        open={isOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: '80px',
            backgroundColor: '#f5f5f5',
            borderRadius: '0 20px 20px 0',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            mt: 4,
          }}
        >
          {filteredMenuItems.map((item, index) => (
            <IconButton
              key={index}
              component={Link}
              to={item.link}
              onClick={() => {
                if (item.action) item.action();
                toggleDrawer(false)();
              }}
              sx={{
                backgroundColor: '#fff',
                borderRadius: '50%',
                width: 60,
                height: 60,
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                color: '#1565c0',
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                },
              }}
            >
              {item.icon}
            </IconButton>
          ))}
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;
