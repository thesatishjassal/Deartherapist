import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { parse, format, isSameMonth } from "date-fns";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import useGetClients from "../../hooks/useGetClients";
import useTodayAppointments from "../../hooks/useTodayAppointments";

const getMonthNamesFromDates = (dateStrings) => {
  return dateStrings.map((dateString) => {
    try {
      const parsedDate = parse(dateString, 'MM/dd/yyyy', new Date());
      if (isNaN(parsedDate)) throw new Error("Invalid Date");
      return format(parsedDate, 'MMMM');
    } catch (error) {
      console.error("Error parsing date:", dateString, error);
      return "Invalid Date";
    }
  });
};

export default function ReportTable() {
  const columns = [
    { field: "Srno", headerName: "Sr. NO", width: 100 },
    { field: "date", headerName: "Date", width: 140 },
    { field: "monthName", headerName: "Month", width: 140 }, // Add month name column
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

    const dateStrings = todayAppointments.map(appointment => format(new Date(appointment.date), "MM/dd/yyyy"));
    const monthNames = getMonthNamesFromDates(dateStrings);

    const formattedRows = todayAppointments.map((appointment, index) => ({
      ...appointment,
      id: appointment._id,
      date: format(new Date(appointment.date), "MM/dd/yyyy"), // Format date as MM/dd/yyyy
      time: format(new Date(appointment.time), "HH:mm a"),
      monthName: monthNames[index], // Add month name
    }));
    console.log("Formatted Rows:", formattedRows);
    setRows(formattedRows);
    setFilteredAppointments(formattedRows); // Initialize filtered appointments with all data
  }, [todayAppointments]);

  const handleMonthChange = (event) => {
    const month = event.target.value;
    setSelectedMonth(month);
    filterAppointments(month);
  };

  const filterAppointments = (month) => {
    if (!month) {
      setFilteredAppointments(rows); // If no month selected, show all appointments
    } else {
      const filtered = rows.filter(row => row.monthName === month);
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
        <FormControl sx={{ minWidth: 120, mb: 2 }}>
          <Select
            value={selectedMonth}
            onChange={handleMonthChange}
            displayEmpty
            inputProps={{ "aria-label": "Select Month" }}
          >
            <MenuItem value="">All Months</MenuItem>
            <MenuItem value="January">January</MenuItem>
            <MenuItem value="February">February</MenuItem>
            <MenuItem value="March">March</MenuItem>
            <MenuItem value="April">April</MenuItem>
            <MenuItem value="May">May</MenuItem>
            <MenuItem value="June">June</MenuItem>
            <MenuItem value="July">July</MenuItem>
            <MenuItem value="August">August</MenuItem>
            <MenuItem value="September">September</MenuItem>
            <MenuItem value="October">October</MenuItem>
            <MenuItem value="November">November</MenuItem>
            <MenuItem value="December">December</MenuItem>
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
