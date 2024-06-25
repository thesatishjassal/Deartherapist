// ReceptionistChangePasswordForm.js
import React, { useState } from 'react';
import axios from 'axios';
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Snackbar,
} from '@mui/material';

const ReceptionistChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleChangePassword = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `/api/auth/receptionist/change-password`,
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message);
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage('Failed to change password.');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Grid container justifyContent="center" alignItems="center" spacing={2}>
      <Grid item xs={10} md={6} lg={4}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h5" gutterBottom>
            Change Password
          </Typography>
          <TextField
            type="password"
            label="Current Password"
            fullWidth
            margin="normal"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <TextField
            type="password"
            label="New Password"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleChangePassword}
          >
            Change Password
          </Button>
        </Paper>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={message}
      />
    </Grid>
  );
};

export default ReceptionistChangePasswordForm;
