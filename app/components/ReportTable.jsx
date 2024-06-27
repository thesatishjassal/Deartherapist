import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { format, isSameMonth, parse } from "date-fns"; // Import parse function from date-fns

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import useGetClients from "../../hooks/useGetClients";
import useTodayAppointments from "../../hooks/useTodayAppointments";

export default function ReportTable() {
  const columns = [
    { field: "Srno", headerName: "Sr. NO", width: 100 },
    { field: "date", headerName: "Date", width: 140 },
    { field: "name", headerName: "Name", width: 140 },
    { field: "channel", headerName: "Mode", width: 130 },
    { field: "service", headerName: "Service", width: 130 },
    { field: "facilitatedBy", headerName: "Facilitated By", width: 130 },
    { field: "amount", headerName: "Amount", width: 100 },
  ];

  const { clients, isLoading: isCLoading, error: clientsError } = useGetClients();
  const todayAppointments = useTodayAppointments(clients);

  const [rows, setRows] = React.useState([]);
  const [filteredAppointments, setFilteredAppointments] = React.useState([]);
  const [selectedMonth, setSelectedMonth] = React.useState("");

  React.useEffect(() => {
    console.log("Today Appointments:", todayAppointments);
    const formattedRows = todayAppointments.map((appointment) => ({
      ...appointment,
      id: appointment._id,
      date: format(new Date(appointment.date), "MM/yyyy"), // Format date as MM/yyyy
      time: format(new Date(appointment.time), "HH:mm a"),
    }));
    console.log("Formatted Rows:", formattedRows);
    setRows(formattedRows);
    setFilteredAppointments(formattedRows); // Initialize filtered appointments with all data
  }, [todayAppointments]);

  const handleMonthChange = (event) => {
    const monthYear = event.target.value;
    console.log("Selected Month:", monthYear);
    setSelectedMonth(monthYear);
    filterAppointments(monthYear);
  };

  const filterAppointments = (monthYear) => {
    if (!monthYear) {
      console.log("No Month Selected, showing all appointments");
      setFilteredAppointments(rows); // If no month selected, show all appointments
    } else {
      const filtered = rows.filter((row) =>
        isSameMonth(parse(row.date, "MM/yyyy", new Date()), new Date(monthYear))
      );
      console.log("Filtered Appointments:", filtered);
      setFilteredAppointments(filtered);
    }
  };

  const theme = createTheme({
    components: {
      MuiDataGrid: {
        styleOverrides: {
          cell: {
            fontSize: "0.75rem",
          },
          columnHeaders: {
            fontSize: "0.8rem",
          },
        },
      },
    },
  });

  if (clientsError) {
    return <Typography variant="h6">Error loading clients data.</Typography>;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 2 }}>
        <FormControl fullWidth sx={{ minWidth: 120, mb: 2 }}>
          <InputLabel id="demo-simple-select-label">Select Month</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedMonth}
            label="Select Month"
            onChange={handleMonthChange}
          >
            <MenuItem value="">All Months</MenuItem>
            <MenuItem value="01/2023">January</MenuItem>
            <MenuItem value="02/2023">February</MenuItem>
            <MenuItem value="03/2023">March</MenuItem>
            <MenuItem value="04/2023">April</MenuItem>
            <MenuItem value="05/2023">May</MenuItem>
            <MenuItem value="06/2023">June</MenuItem>
            <MenuItem value="07/2023">July</MenuItem>
            <MenuItem value="08/2023">August</MenuItem>
            <MenuItem value="09/2023">September</MenuItem>
            <MenuItem value="10/2023">October</MenuItem>
            <MenuItem value="11/2023">November</MenuItem>
            <MenuItem value="12/2023">December</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={filteredAppointments}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          components={{ Toolbar: GridToolbar }}
        />
      </div>
    </ThemeProvider>
  );
}
