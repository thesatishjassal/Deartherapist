"use client";

import React, { useState, useEffect  } from "react";
import { Container, Grid } from "@mui/material";
import ChangePasswordForm from "../components/UserProfile"; // Adjust the path if necessary
import CounselorChangePasswordForm from "../components/CounselorChangePasswordForm";
import ReceptionistChangePasswordForm from "../components/ReceptionistChangePasswordForm";
import useAuth from "../../hooks/useAuth"; // Adjust the import path as needed
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const { user, handleLogout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  if (!user) {
    return <p>Loading...</p>; // Or a spinner/loader component
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
