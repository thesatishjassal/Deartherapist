// src/pages/profile.js
"use client";

import React, { useState } from 'react';
import { Container, Grid } from '@mui/material';
import UserProfile from '../../components/UserProfile';

const initialUsers = [
  {
    name: 'Admin User',
    role: 'Admin',
    email: 'admin@example.com',
    password: 'adminpass',
    avatar: 'https://via.placeholder.com/150',
  },
  {
    name: 'Receptionist User',
    role: 'Receptionist',
    email: 'receptionist@example.com',
    password: 'receptionistpass',
    avatar: 'https://via.placeholder.com/150',
  },
  {
    name: 'Counselor User',
    role: 'Counselor',
    email: 'counselor@example.com',
    password: 'counselorpass',
    avatar: 'https://via.placeholder.com/150',
  },
];

const ProfilePage = () => {
  const [users, setUsers] = useState(initialUsers);

  const handleUpdatePassword = (email, newPassword) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.email === email ? { ...user, password: newPassword } : user
      )
    );
  };

  return (
    <Container sx={{ marginTop: '2rem' }}>
      <Grid container spacing={2}>
        {users.map((user, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <UserProfile user={user} onUpdatePassword={handleUpdatePassword} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProfilePage;
