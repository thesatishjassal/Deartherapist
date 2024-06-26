"use client";

import React, { useState, useEffect  } from "react";
import { Container, Grid } from "@mui/material";
import ChangePasswordForm from "../components/UserProfile"; // Adjust the path if necessary
import CounselorChangePasswordForm from "../components/CounselorChangePasswordForm";
import ReceptionistChangePasswordForm from "../components/ReceptionistChangePasswordForm";
import useAuth from "../../hooks/useAuth"; // Adjust the import path as needed

const ProfilePage = () => {
  const { user, handleLogout } = useAuth();

  if (!user) {
    return <div>Loading...</div>; // or some other loading state
  }

  return (
    <Container sx={{ marginTop: "2rem" }}>
      {user.role === "admin" ? (
        <ChangePasswordForm />
      ) : user.role === "counselor" ? (
        <CounselorChangePasswordForm />
      ) : user.role === "receptionist" ? (
        <ReceptionistChangePasswordForm />
      ) : (
        <div>Invalid role</div>
      )}
    </Container>
  );
};

export default ProfilePage;
