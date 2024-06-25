"use client";

import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ClientsTable from "../components/ClientsTable";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Box, Button } from "@mui/material";
import MyAppointments from "../components/MyAppoinments";
import useAuth from "../../hooks/useAuth"; // Adjust the import path as needed
import useProtectedRoute from "../../hooks/useProtectedRoute";
import CounselorAppointments from "../components/CounselorAppointments";
import useProtectedRoute from  "../../hooks/useProtectedRoute";

export default function Dashboard() {
  const [value, setValue] = React.useState("1");
  const { myuser, handleLogout } = useAuth();
  const user = useProtectedRoute();

  if (!user) {
    return null; // Optionally render a loading state or a redirect message
  }
  
  if (!myuser) {
   <p>Loading...</p>
  }
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Card className="main__dashboard">
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" className="mb-4">
          {myuser && myuser.role == "admin" ? "Welcome 👋 Dr. Shaveta" : ""}
          {myuser && myuser.role == "counselor" ? "Welcome 👋 Counselor" : ""}
          {myuser && myuser.role == "receptionist"
            ? " Welcome 👋 Receptionist"
            : ""}
        </Typography>
      </CardContent>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Clients" value="1" />
              <Tab label="Appointments" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <ClientsTable />
          </TabPanel>
          <TabPanel value="2">
            {myuser && myuser.role == "counselor" ? (
              <CounselorAppointments />
            ) : (
              <MyAppointments />
            )}
          </TabPanel>
        </TabContext>
      </Box>
    </Card>
  );
}
