// src/components/UserProfile.js
"use client";

import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Avatar, Grid, TextField, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';

const UserProfile = ({ user, onUpdatePassword }) => {
  const [open, setOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdatePassword = () => {
    onUpdatePassword(user.email, newPassword);
    setOpen(false);
  };

  return (
    <Card sx={{margin: '1rem' }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar alt={user.name} src={user.avatar} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" component="div">
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.role}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button variant="outlined" onClick={handleClickOpen}>
              Edit Password
            </Button>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Edit Password</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Enter a new password for {user.name}.
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  id="password"
                  label="New Password"
                  type="password"
                  fullWidth
                  variant="standard"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleUpdatePassword}>Update</Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
