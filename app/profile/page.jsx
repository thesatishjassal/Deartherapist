"use client";

import React, { useState } from "react";
import { Container, Grid } from "@mui/material";
// import useProtectedRoute from "../../hooks/useProtectedRoute";
import ChangePasswordForm from "../components/UserProfile"; // Adjust the path if necessary
import CounselorChangePasswordForm from "../components/CounselorChangePasswordForm";
import ReceptionistChangePasswordForm from "../components/ReceptionistChangePasswordForm";
import useAuth from "../../hooks/useAuth"; // Adjust the import path as needed

const ProfilePage = () => {
  // const user = useProtectedRoute();
  const { user, handleLogout } = useAuth();

  if (!user) {
    return null; // Optionally render a loading state or a redirect message
  }
  return (
    <Container sx={{ marginTop: "2rem" }}>
      {user && user.role == "admin" ? (
        <ChangePasswordForm />
      ) : user.role == "counselor" ? (
        <CounselorChangePasswordForm />
      ) : (
        (user.role = "recptionist" ? (
          <ReceptionistChangePasswordForm />
        ) : (
          ""
        ))
      )}
    </Container>
  );
};

export default ProfilePage;
