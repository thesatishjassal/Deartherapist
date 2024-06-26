"use client";

import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ClientsTable from "../components/ClientsTable";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Box } from "@mui/material";
import MyAppointments from "../components/MyAppointments";
import CounselorAppointments from "../components/CounselorAppointments";
import { useRouter } from 'next/navigation'; // Corrected import to 'next/router'
import withAuth from '../components/hoc/withAuth'; // Adjust the import path according to your project structure
import useAuth from '../../hooks/useAuth'; // Adjust the import path according to your project structure

const Dashboard = () => {
  const [value, setValue] = useState("1");
  const router = useRouter();
  const { user } = useAuth(); 

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (!user) {
    return null; // or handle unauthorized access
  }

  return (
    <Card className="main__dashboard">
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" className="mb-4">
          {user.role === "admin" && "Welcome 👋 Dr. Shaveta"}
          {user.role === "counselor" && "Welcome 👋 Counselor"}
          {user.role === "receptionist" && "Welcome 👋 Receptionist"}
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
            {user.role === "counselor" ? (
              <CounselorAppointments />
            ) : (
              <MyAppointments />
            )}
          </TabPanel>
        </TabContext>
      </Box>
    </Card>
  );
};

export default withAuth(Dashboard);
