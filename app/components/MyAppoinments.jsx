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
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleView}>
          <VisibilityIcon /> &nbsp; View
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <EditIcon /> &nbsp; Edit
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <DeleteIcon /> &nbsp; Delete
        </MenuItem>
      </Menu>
    </>
  );
};

export default function MyAppointments() {
  const initialRows = [
    {
      id: 1,
      SrNo: 1,
      clientId: "C001",
      date: "2024-01-01",
      time: "10:00 AM",
      name: "John Doe",
      service: "Service A",
      facilitatedBy: "Alice",
    },
    {
      id: 2,
      SrNo: 2,
      clientId: "C002",
      date: "2024-01-02",
      time: "11:30 AM",
      name: "Jane Smith",
      service: "Service B",
      facilitatedBy: "Bob",
    },
    {
      id: 3,
      SrNo: 3,
      clientId: "C003",
      date: "2024-01-03",
      time: "01:00 PM",
      name: "Sam Johnson",
      service: "Service C",
      facilitatedBy: "Charlie",
    },
    {
      id: 4,
      SrNo: 4,
      clientId: "C004",
      date: "2024-01-04",
      time: "02:30 PM",
      name: "Alice Brown",
      service: "Service D",
      facilitatedBy: "David",
    },
    {
      id: 5,
      SrNo: 5,
      clientId: "C005",
      date: "2024-01-05",
      time: "04:00 PM",
      name: "Bob Davis",
      service: "Service E",
      facilitatedBy: "Emma",
    },
  ];
  const columns = [
    { field: "SrNo", headerName: "Sr. NO", width: 90 },
    { field: "clientId", headerName: "Client ID", width: 110 },
    { field: "date", headerName: "Date", width: 130 },
    { field: "time", headerName: "Time", width: 120 },
    { field: "name", headerName: "Name", width: 180 },
    { field: "service", headerName: "Service", width: 180 },
    { field: "facilitatedBy", headerName: "Facilated By", width: 180 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => <ActionsMenu rowId={params.row.id} />,
    },
  ];
  const [rows, setRows] = React.useState(initialRows);
  const [searchText, setSearchText] = React.useState("");

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const handleAddClient = () => {
    // const newClient = {
    //   id: rows.length + 1,
    //   SrNo: rows.length + 1,
    //   clientId: `C00${rows.length + 1}`,
    //   date: new Date().toISOString().split('T')[0],
    //   name: `New Client ${rows.length + 1}`,
    //   gender: 'Unknown',
    //   age: 0,
    //   mobileNo: '000-000-0000',
    //   country: 'Unknown',
    // };
    // setRows([...rows, newClient]);
  };

  const filteredRows = rows.filter((row) =>
    row.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ height: 500, width: "100%" }}>
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
        components={{ Toolbar: GridToolbar }}
      />
    </div>
  );
}
