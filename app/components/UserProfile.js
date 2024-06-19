import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, TextField } from '@mui/material';

const UserProfile = ({ user, onUpdatePassword }) => {
  const [newPassword, setNewPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handlePasswordChange = () => {
    onUpdatePassword(user._id, newPassword);
    setNewPassword('');
    setIsEditing(false);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{user.name}</Typography>
        <Typography variant="body2">{user.email}</Typography>
        {isEditing ? (
          <>
            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
            />
            <Button onClick={handlePasswordChange} variant="contained" color="primary">
              Update Password
            </Button>
            <Button onClick={() => setIsEditing(false)} variant="contained" color="secondary">
              Cancel
            </Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)} variant="contained" color="primary">
            Change Password
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default UserProfile;
