import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Box,
  CircularProgress,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import AddAppointment from "./MakeAppointment";
import useTodayAppointments from "../../hooks/useTodayAppointments";
import useGetClients from "../../hooks/useGetClients";
import useAuth from "../../hooks/useAuth"; // Adjust the import path as needed
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import Button from "@mui/material/Button";

const ActionsMenu = ({ rowId }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const router = useRouter();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleView = () => {
    console.log("View", rowId);
    router.push(`/patient-detail/${rowId}`);
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

const CounselorAppointments = () => {
  const columns = [
    { field: "appointmentID", headerName: "Appointment ID", width: 150 },
    { field: "date", headerName: "Date", width: 130 },
    { field: "time", headerName: "Time", width: 120 },
    { field: "channel", headerName: "Channel", width: 180 },
    { field: "service", headerName: "Service", width: 180 },
    { field: "facilitatedBy", headerName: "Facilitated By", width: 180 },
    { field: "amount", headerName: "Amount", width: 110 },
  ];

  const [searchText, setSearchText] = React.useState("");
  const { clients, isLoading: isTLoading, error } = useGetClients();
  const todayAppointments = useTodayAppointments(clients);
  const [rows, setRows] = React.useState([]);
  const { user } = useAuth(); // Assuming useAuth provides user details including email

  React.useEffect(() => {
    if (!user) return;

    const filteredAppointments = todayAppointments.filter(
      (appointment) => appointment.facilitatedBy === "counselor"
    );

    const formattedRows = filteredAppointments.map((appointment) => ({
      ...appointment,
      date: format(new Date(appointment.date), "dd-MM-yyyy"),
      time: format(new Date(appointment.time), "HH:mm a"),
    }));

    setRows(formattedRows);
  }, [todayAppointments, user]);

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const filteredRows = rows.filter((row) =>
    row.name.toLowerCase().includes(searchText.toLowerCase())
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
          sx={{ marginRight: 2 }}
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
};

export default CounselorAppointments;
