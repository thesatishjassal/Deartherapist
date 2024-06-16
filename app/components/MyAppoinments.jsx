import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import AddAppointment from "./MakeAppointment";
import useTodayAppointments from "../../hooks/useTodayAppointments"; // Assuming the file path is correct
import useGetClients from "../../hooks/useGetClients"; // Path to your custom hook

const ActionsMenu = ({ rowId }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

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
    { field: "appointmentID", headerName: "Appointment ID", width: 90 },
    { field: "date", headerName: "Date", width: 130 },
    { field: "time", headerName: "Time", width: 120 },
    { field: "channel", headerName: "Channel", width: 180 },
    { field: "service", headerName: "Service", width: 180 },
    { field: "facilitatedBy", headerName: "Facilitated By", width: 180 },
    { field: "amount", headerName: "Amount", width: 110 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => <ActionsMenu rowId={params.row.id} />,
    },
  ];
  const [searchText, setSearchText] = React.useState("");
  const { clients, isLoading: isTLoading, error } = useGetClients(); // Rename isLoading to avoid conflict
  const todayAppointments = useTodayAppointments(clients);
  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    setRows(todayAppointments);
  }, [todayAppointments]);

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };
  const filteredRows = rows.filter((row) => {
    const rowName = row.name || ""; // Handle case where row.name is undefined or null
    return rowName.toLowerCase().includes(searchText.toLowerCase());
  });
  

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
          sx={{ marginright: 2 }}
        />
        <AddAppointment />
      </Toolbar>
      <DataGrid
        rows={filteredRows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        getRowId={(row) => row._id}
        components={{ Toolbar: GridToolbar }}
      />
    </div>
  );
}
