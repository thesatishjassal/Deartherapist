"use client";

import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function ReportTable() {
  const initialRows = [
    {
        id: 1,
        SrNo: 1,
        clientId: "C001",
        date: "2024-06-01",
        name: "John Doe",
        online_offline: "Online",
        Service: "Consultation",
        Facilated_By: "Jane Smith",
        Amount: 150,
      },
      {
        id: 2,
        SrNo: 2,
        clientId: "C002",
        date: "2024-06-02",
        name: "Alice Johnson",
        online_offline: "Offline",
        Service: "Therapy Session",
        Facilated_By: "Michael Brown",
        Amount: 200,
      },
      {
        id: 3,
        SrNo: 3,
        clientId: "C003",
        date: "2024-06-03",
        name: "Robert Brown",
        online_offline: "Online",
        Service: "Medical Checkup",
        Facilated_By: "Emily White",
        Amount: 250,
      },
      {
        id: 4,
        SrNo: 4,
        clientId: "C004",
        date: "2024-06-04",
        name: "Emma Wilson",
        online_offline: "Offline",
        Service: "Consultation",
        Facilated_By: "David Miller",
        Amount: 150,
      },
      {
        id: 5,
        SrNo: 5,
        clientId: "C005",
        date: "2024-06-05",
        name: "Liam Martinez",
        online_offline: "Online",
        Service: "Therapy Session",
        Facilated_By: "Sophia Garcia",
        Amount: 200,
      }
  ];

  const columns = [
    { field: "SrNo", headerName: "Sr. NO", width: 50 },
    { field: "clientId", headerName: "Client ID", width: 100 },
    { field: "date", headerName: "Date", width: 140 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "online_offline", headerName: "Service Type", width: 130 },
    { field: "Service", headerName: "Service", width: 130 },
    { field: "Facilated_By", headerName: "Facilated_By", width: 130 },
    { field: "Amount", headerName: "Amount", width: 100 },
  ];
  const [rows, setRows] = React.useState(initialRows);

  const theme = createTheme({
    components: {
      MuiDataGrid: {
        styleOverrides: {
          cell: {
            fontSize: '0.75rem', // Decrease font size here
          },
          columnHeaders: {
            fontSize: '0.8rem', // Decrease font size for header cells
          },
        },
      },
    },
  });
  const handleAddClient = () => {
  };

  return (
    <ThemeProvider theme={theme}>
    <div style={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5]}
        components={{ Toolbar: GridToolbar }}
      />
    </div>
    </ThemeProvider>
  );
}
