"use client";

import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useGetClients from "../../hooks/useGetClients";
import useTodayAppointments from "../../hooks/useTodayAppointments"; // Assuming the file path is correct
import { useRouter } from "next/navigation"; // Corrected import
import { format } from "date-fns"; // Import date-fns format function
import { calculateTotalAmount } from "../../utils"; // Import the utility function
import TotalAmount from "./TotalAmount";

export default function ReportTable() {
  const calculateTotalAmount = (appointments) => {
    return appointments
      .map((appointment) => appointment.amount)
      .reduce((sum, current) => sum + current, 0);
  };

  const columns = [
    { field: "appointmentID", headerName: "Sr. NO", width: 50 },
    { field: "date", headerName: "Date", width: 140 },
    { field: "time", headerName: "Time", width: 140 },
    { field: "channel", headerName: "Mode", width: 130 },
    { field: "service", headerName: "Service", width: 130 },
    { field: "facilitatedBy", headerName: "Facilated By", width: 130 },
    { field: "amount", headerName: "Amount", width: 100 },
  ];

  const { clients, isLoading: isTLoading, error } = useGetClients(); // Rename isLoading to avoid conflict
  const todayAppointments = useTodayAppointments(clients);
  const [rows, setRows] = React.useState(clients);
  const [totalAmount, setTotalAmount] = React.useState(0);

  React.useEffect(() => {
    const formattedRows = todayAppointments.map((appointment) => ({
      ...appointment,
      date: format(new Date(appointment.date), "dd-MM-yyyy"), // Format date correctly
      time: format(new Date(appointment.time), "HH:mm a"), // Format time correctly
    }));
    setRows(formattedRows);

    const totalAmountCalculated = calculateTotalAmount(formattedRows);
    setTotalAmount(totalAmountCalculated);
    console.log(totalAmount);
  }, [todayAppointments]); // Update when todayAppointments changes

  const theme = createTheme({
    components: {
      MuiDataGrid: {
        styleOverrides: {
          cell: {
            fontSize: "0.75rem", // Decrease font size here
          },
          columnHeaders: {
            fontSize: "0.8rem", // Decrease font size for header cells
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div style={{ height: 500, width: "100%" }}>
        {isTLoading ? <TotalAmount price={totalAmount} /> : ""}
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          getRowId={(row) => row._id}
          rowsPerPageOptions={[5]}
          components={{ Toolbar: GridToolbar }}
        />
      </div>
    </ThemeProvider>
  );
}
