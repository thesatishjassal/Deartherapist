"use client";

import React, { useState, useEffect } from "react";
import { Container, Grid } from "@mui/material";
import ChangePasswordForm from "../components/UserProfile"; // Adjust the path if necessary
import CounselorChangePasswordForm from "../components/CounselorChangePasswordForm";
import ReceptionistChangePasswordForm from "../components/ReceptionistChangePasswordForm";

const ProfilePage = () => {

  return (
    <Container sx={{ marginTop: "2rem" }}>
      {user && user.role == "admin" ? (
        <ChangePasswordForm />
      ) : user.role == "counselor" ? (
        <CounselorChangePasswordForm />
      ) : (
        (user.role = "recptionist" ? <ReceptionistChangePasswordForm /> : "")
      )}
    </Container>
  );
};

export default withAuth(ProfilePage);
