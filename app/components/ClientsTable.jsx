import React, { useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Toolbar,
  Typography,
  CircularProgress,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddClients from "./AddClients";
import EditClient from "./EditClient"; // Import the EditClient modal
import { useRouter } from "next/navigation";
import useGetClients from "../../hooks/useGetClients"; // Path to your custom hook
import { format } from "date-fns"; // Import date-fns format function

const ActionsMenu = ({ rowId, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const router = useRouter(); // Initialize useRouter

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(rowId);
    handleClose();
  };

  const handleDelete = () => {
    onDelete(rowId);
    handleClose();
  };

  const handleView = () => {
    router.push(`/patient-detail/${rowId}`); // Navigate to the detailed view
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
  const [rows, setRows] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchText, setSearchText] = React.useState("");
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [isEditModalOpen, setEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const { clients, isTLoading, error } = useGetClients();

  if (isTLoading) {
    return <p>Loading...</p>; // You can add a loading spinner or message here
  }

  if (error) {
    return <p>Error: {error.message}</p>; // Display error message
  }

  // Simulate loading initial data
  useEffect(() => {
    setTimeout(() => {
      const formattedRows = clients.map((client) => ({
        ...client,
        date: format(new Date(), "yyyy-MM-dd"), // Add formatted date
      }));
      setRows(formattedRows);
      setIsLoading(false);
    }, 2000); // Simulating a 2 second delay
  }, [clients]);

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const handleEdit = (id) => {
    setSelectedRow(rows.find((row) => row._id === id));
    setEditModalOpen(true);
  };

  const handleDelete = (id) => {
    setSelectedRow(rows.find((row) => row._id === id));
    setDeleteModalOpen(true);
  };

  const handleEditSave = (updatedClient) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row._id === updatedClient.id ? updatedClient : row))
    );
    setEditModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    setRows(rows.filter((row) => row._id !== selected.row._id));
    setDeleteModalOpen(false);
  };

  const filteredRows = rows.filter((row) =>
    row.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { field: "Srno", headerName: "Sr. NO", width: 90 },
    { field: "ClientID", headerName: "Client ID", width: 110 },
    { field: "date", headerName: "Date", width: 120 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "gender", headerName: "Gender", width: 100 },
    { field: "age", headerName: "Age", width: 90 },
    { field: "mobile", headerName: "Mobile No", width: 130 },
    { field: "country", headerName: "Country", width: 120 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <ActionsMenu
          rowId={params.row._id}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ),
    },
  ];

  return (
    <div style={{ width: "100%" }}>
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
        <AddClients />
      </Toolbar>
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
          <Typography variant="h6" sx={{ marginLeft: 2 }}>
            Please wait...
          </Typography>
        </Box>
      ) : (
        <DataGrid
          rows={filteredRows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          pagination
          getRowId={(row) => row._id} // Use _id as the row id
          components={{ Toolbar: GridToolbar }}
        />
      )}
      <EditClient
        open={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        client={selectedRow}
        onSave={handleEditSave}
      />
    </div>
  );
}
