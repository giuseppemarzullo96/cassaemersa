import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const PopupAccess = ({ accessCode, setAccessCode, setIsPopupVisible }) => {
  const handleAccess = () => {
    if (accessCode === '0000') {
      setIsPopupVisible(false);
    } else {
      alert('Codice non valido');
    }
  };

  return (
    <Dialog open={true}>
      <DialogTitle>Accesso</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Codice di Accesso"
            variant="outlined"
            type="password"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
          />
          <Button variant="contained" onClick={handleAccess}>
            Accedi
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PopupAccess;
