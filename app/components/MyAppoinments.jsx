import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import AddAppointment from "./MakeAppointment";
import useTodayAppointments from "../../hooks/useTodayAppointments"; // Assuming the file path is correct
import useGetClients from "../../hooks/useGetClients"; // Path to your custom hook
import { useRouter } from "next/router"; // Corrected import
import { format } from "date-fns"; // Import date-fns format function

const ActionsMenu = ({ rowId }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const router = useRouter(); // Initialize useRouter

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    console.log("Edit", rowId);
    handleClose();
  };

  const handleDelete = () => {
    console.log("Delete", rowId);
    handleClose();
  };

  const handleView = () => {
    console.log("View", rowId);
    router.push(`/patient-detail/${rowId}`); // Navigate to the detailed view
    handleClose();
  };

  return (
    <>
      <Button variant="outlined" onClick={handleView}>
        View
      </Button>
    </>
  );
};

export default function MyAppointments() {
  const columns = [
    { field: "Srno", headerName: "Sr No", width: 150 },
    { field: "appointmentID", headerName: "Appointment ID", width: 150 },
    { field: "date", headerName: "Date", width: 130 },
    { field: "time", headerName: "Time", width: 120 },
    { field: "channel", headerName: "Channel", width: 180 },
    { field: "service", headerName: "Service", width: 180 },
    { field: "facilitatedBy", headerName: "Facilitated By", width: 180 },
    { field: "amount", headerName: "Amount", width: 110 },
  ];

  const [searchText, setSearchText] = React.useState("");
  const { clients, isLoading: isTLoading, error } = useGetClients(); // Rename isLoading to avoid conflict
  const todayAppointments = useTodayAppointments(clients);
  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    const formattedRows = todayAppointments.map((appointment) => ({
      ...appointment,
      date: format(new Date(appointment.date), "dd-MM-yyyy"), // Format date correctly
      time: format(new Date(appointment.time), "HH:mm a"), // Format time correctly
    }));
    setRows(formattedRows);
  }, [todayAppointments]); // Update when todayAppointments changes

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const filteredRows = rows.filter(
    (row) =>
      row.name.toLowerCase().includes(searchText.toLowerCase()) ||
      row.appointmentID.toLowerCase().includes(searchText.toLowerCase()) ||
      row.facilitatedBy.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ width: "100%" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          My Appointments
        </Typography>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search by name"
          value={searchText}
          onChange={handleSearch}
          sx={{ marginRight: 2 }} // Corrected marginRight spelling
        />
        <AddAppointment />
      </Toolbar>
      {isTLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress />
        </Box>
      ) : (
        <DataGrid
          rows={filteredRows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          getRowId={(row) => row._id}
          components={{ Toolbar: GridToolbar }}
          initialState={{
            sorting: {
              sortModel: [{ field: "date", sort: "desc" }],
            },
          }}
        />
      )}
    </div>
  );
}
