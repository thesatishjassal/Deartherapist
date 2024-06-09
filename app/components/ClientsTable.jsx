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
import AddClietns from "./AddClients";

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

export default function ClientsTable() {
  const initialRows = [
    {
      id: 1,
      SrNo: 1,
      clientId: "C001",
      date: "2024-01-01",
      name: "John Doe",
      gender: "Male",
      age: 30,
      mobileNo: "123-456-7890",
      country: "USA",
    },
    {
      id: 2,
      SrNo: 2,
      clientId: "C002",
      date: "2024-01-02",
      name: "Jane Smith",
      gender: "Female",
      age: 25,
      mobileNo: "234-567-8901",
      country: "Canada",
    },
    {
      id: 3,
      SrNo: 3,
      clientId: "C003",
      date: "2024-01-03",
      name: "Sam Johnson",
      gender: "Male",
      age: 35,
      mobileNo: "345-678-9012",
      country: "UK",
    },
    {
      id: 4,
      SrNo: 4,
      clientId: "C004",
      date: "2024-01-04",
      name: "Alice Brown",
      gender: "Female",
      age: 28,
      mobileNo: "456-789-0123",
      country: "Australia",
    },
    {
      id: 5,
      SrNo: 5,
      clientId: "C005",
      date: "2024-01-05",
      name: "Bob Davis",
      gender: "Male",
      age: 40,
      mobileNo: "567-890-1234",
      country: "India",
    },
  ];

  const columns = [
    { field: "SrNo", headerName: "Sr. NO", width: 90 },
    { field: "clientId", headerName: "Client ID", width: 110 },
    { field: "date", headerName: "Date", width: 120 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "gender", headerName: "Gender", width: 100 },
    { field: "age", headerName: "Age", width: 90 },
    { field: "mobileNo", headerName: "Mobile No", width: 130 },
    { field: "country", headerName: "Country", width: 120 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
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
          My Clients
        </Typography>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search Name"
          value={searchText}
          onChange={handleSearch}
          sx={{ marginRight: 2 }}
        />
        <AddClietns />
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
