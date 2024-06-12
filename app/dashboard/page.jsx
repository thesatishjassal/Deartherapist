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

export default function Dashboard() {
  const [value, setValue] = React.useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Card className="main__dashboard">
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" className="mb-4">
          Good Morning Rekha 👋
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
          <TabPanel value="2"><MyAppointments /></TabPanel>
        </TabContext>
      </Box>
    </Card>
  );
}