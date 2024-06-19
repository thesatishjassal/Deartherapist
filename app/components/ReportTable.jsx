import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { format } from "date-fns";
import { DatePicker, DateRangePicker } from "@mui/lab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useGetClients from "../../hooks/useGetClients";
import useTodayAppointments from "../../hooks/useTodayAppointments";

export default function ReportTable() {
  const columns = [
    { field: "appointmentID", headerName: "Sr. NO", width: 100 },
    { field: "date", headerName: "Date", width: 140 },
    { field: "time", headerName: "Time", width: 140 },
    { field: "channel", headerName: "Mode", width: 130 },
    { field: "service", headerName: "Service", width: 130 },
    { field: "facilitatedBy", headerName: "Facilated By", width: 130 },
    { field: "amount", headerName: "Amount", width: 100 },
  ];

  const { clients, isLoading: isCLoading, error } = useGetClients();
  const todayAppointments = useTodayAppointments(clients);

  const [rows, setRows] = React.useState([]);
  const [filteredAppointments, setFilteredAppointments] = React.useState([]);
  const [selectedStartDate, setSelectedStartDate] = React.useState(null);
  const [selectedEndDate, setSelectedEndDate] = React.useState(null);

  React.useEffect(() => {
    const formattedRows = todayAppointments.map((appointment) => ({
      ...appointment,
      id: appointment._id,
      date: format(new Date(appointment.date), "dd-MM-yyyy"),
      time: format(new Date(appointment.time), "HH:mm a"),
    }));
    setRows(formattedRows);
  }, [todayAppointments]);

  const handleDateChange = (date) => {
    setSelectedStartDate(date);
    setSelectedEndDate(date); // For single date selection
    filterAppointments(date, date);
  };

  const handleDateRangeChange = (dateRange) => {
    const [start, end] = dateRange;
    setSelectedStartDate(start);
    setSelectedEndDate(end);
    filterAppointments(start, end);
  };

  const filterAppointments = (startDate, endDate) => {
    const filtered = rows.filter((row) => {
      const appointmentDate = new Date(row.date);
      return (
        appointmentDate >= new Date(startDate) &&
        appointmentDate <= new Date(endDate)
      );
    });
    setFilteredAppointments(filtered);
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

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Appointments Report
        </Typography>
        <Box sx={{ display: "flex", gap: 10, alignItems: "center" }}>
          <DatePicker
            label="Select Date"
            value={selectedStartDate}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
          <DateRangePicker
            startText="Start Date"
            endText="End Date"
            value={[selectedStartDate, selectedEndDate]}
            onChange={handleDateRangeChange}
            renderInput={(startProps, endProps) => (
              <>
                <TextField {...startProps} />
                <Box sx={{ mx: 2 }}> to </Box>
                <TextField {...endProps} />
              </>
            )}
          />
        </Box>
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
