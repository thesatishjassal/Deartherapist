import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box, Alert, MenuItem, Select, FormControl, InputLabel ,  Grid,
  Paper} from '@mui/material';

const ChangePasswordForm = () => {
  const [emails] = useState(['support@dt.in', 'counselor@dt.in', 'admin@dt.in']);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  const handlePasswordChange = async () => {
    try {
      const response = await axios.post(
        `${process.env.API_URL}/api/auth/change-password`,
        { email: selectedEmail, newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setMessage(response.data.message);
      setAlertSeverity('success');
      window.location.reload();
    } catch (error) {
      console.error('Failed to change password:', error);
      setMessage('Failed to change password.');
      setAlertSeverity('error');
    }
  };

  return (
  
      <Grid container justifyContent="center" alignItems="center" spacing={2}>
      <Grid item xs={10} md={6} lg={4}>
        <Paper elevation={3} sx={{ padding: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Change Password
      </Typography>

      {message && <Alert severity={alertSeverity}>{message}</Alert>}

      <Box mb={2}>
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel>Email</InputLabel>
          <Select
            value={selectedEmail}
            onChange={(e) => setSelectedEmail(e.target.value)}
            label="Email"
          >
            {emails.map((email) => (
              <MenuItem key={email} value={email}>{email}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box mb={2}>
        <TextField
          fullWidth
          type="password"
          label="New Password"
          variant="outlined"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          margin="normal"
        />
      </Box>

      <Button className="btn" onClick={handlePasswordChange}>
        Change Password
      </Button>
      </Paper>
      </Grid></Grid>
  );
};

export default ChangePasswordForm;
