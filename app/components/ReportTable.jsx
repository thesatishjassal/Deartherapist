import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useGetClients from "../../hooks/useGetClients";
import useTodayAppointments from "../../hooks/useTodayAppointments";
import { format } from "date-fns";
import { calculateTotalAmount } from '../../utils';

export default function ReportTable() {

  const columns = [
    { field: "appointmentID", headerName: "Sr. NO", width: 50 },
    { field: "date", headerName: "Date", width: 140 },
    { field: "time", headerName: "Time", width: 140 },
    { field: "channel", headerName: "Mode", width: 130 },
    { field: "service", headerName: "Service", width: 130 },
    { field: "facilitatedBy", headerName: "Facilated By", width: 130 },
    { field: "amount", headerName: "Amount", width: 100 },
  ];

  const { clients, isLoading: isTLoading, error } = useGetClients();
  const todayAppointments = useTodayAppointments(clients);
  const [rows, setRows] = React.useState([]);
  const [totalAmount, setTotalAmount] = React.useState(0);

  React.useEffect(() => {
    const formattedRows = todayAppointments.map((appointment) => ({
      ...appointment,
      id: appointment._id, // Ensure each row has a unique identifier
      date: format(new Date(appointment.date), "dd-MM-yyyy"),
      time: format(new Date(appointment.time), "HH:mm a"),
    }));
    setRows(formattedRows);

    const totalAmountCalculated = calculateTotalAmount(formattedRows);
    setTotalAmount(totalAmountCalculated);
  }, [todayAppointments]);

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
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          getRowId={(row) => row.id} // Use a unique identifier for each row
          rowsPerPageOptions={[5]}
          components={{ Toolbar: GridToolbar }}
        />
      </div>
    </ThemeProvider>
  );
}
