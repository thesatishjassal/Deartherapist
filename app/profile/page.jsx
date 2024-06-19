"use client";

import React, { useState } from "react";
import { Container, Grid } from "@mui/material";
import UserProfile from "../components/UserProfile";
import useUsers from "../../hooks/useUsers";
import axios from 'axios';
import useProtectedRoute from '../../hooks/useProtectedRoute';

const ProfilePage = () => {
  const { users, loading, error, setUsers } = useUsers("http://localhost:5500/api/auth/users/");
  const user = useProtectedRoute();

  if (!user) {
    return null; // Optionally render a loading state or a redirect message
  }
  
  const handleUpdatePassword = async (userId, newPassword) => {
    try {
      const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
      console.log(token)
      await axios.put(
        `http://localhost:5500/api/auth/admin/change-password/${userId}`,
        { newPassword },
        {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        }
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, password: newPassword } : user
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <Container sx={{ marginTop: "2rem" }}>
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
