import React, { useEffect, useState } from "react";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Snackbar,
  SnackbarContent,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddClients from "./AddClients";
import EditClient from "./EditClient";
import { useRouter } from "next/navigation";
import useGetClients from "../../hooks/useGetClients";
import axios from "axios";
import { format } from "date-fns";
import useAuth from "../../hooks/useAuth"; // Adjust the import path as needed
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

const ActionsMenu = ({ rowId, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const router = useRouter();
  const { user } = useAuth();

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
    router.push(`/patient-detail/${rowId}`);
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
        {user && user.role === "admin" ? (
          <MenuItem onClick={handleDelete}>
            <DeleteIcon /> &nbsp; Delete
          </MenuItem>
        ) : null}
      </Menu>
    </>
  );
};

const ClientsTable = () => {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { clients, isLoading: isTLoading, error } = useGetClients();
  const { user } = useAuth();

  useEffect(() => {
    if (!isTLoading) {
      const formattedRows = clients.map((client, index) => ({
        ...client,
        Srno: index + 1,
        date: format(new Date(client.date), "yyyy-MM-dd"),
      }));
      setRows(formattedRows.slice().reverse());
      setIsLoading(false);
    }
  }, [clients, isTLoading]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/clients`);
        const clientData = response.data;
        const formattedRows = clientData.map((client, index) => ({
          ...client,
          Srno: index + 1,
          date: format(new Date(client.date), "yyyy-MM-dd"),
        }));
        setRows(formattedRows);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    const interval = setInterval(fetchData, 2000); // Fetch data every 3 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const handleEdit = (id) => {
    setSelectedRow(rows.find((row) => row._id === id));
    setEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/clients/${deleteId}`);
      setRows((prevRows) => prevRows.filter((row) => row._id !== deleteId));
      setDeleteDialogOpen(false);
      setDeleteId(null);
      setSnackbarMessage("Client deleted successfully");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting client:", error);
      setDeleteDialogOpen(false);
      setDeleteId(null);
      setSnackbarMessage("Error deleting client");
      setSnackbarOpen(true);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setDeleteId(null);
  };

  const handleEditSave = async (updatedClient) => {
    try {
      const response = await axios.patch(
        `/api/clients/${updatedClient._id}`,
        updatedClient
      );
      setRows((prevRows) =>
        prevRows.map((row) =>
          row._id === updatedClient._id ? response.data : row
        )
      );
      setEditModalOpen(false);
      setSnackbarMessage("Client updated successfully");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating client:", error);
      setSnackbarMessage("Error updating client");
      setSnackbarOpen(true);
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get(`/api/clients`);
      const clientData = response.data;

      // Construct CSV content
      let csvContent =
        "Sr. NO,Client ID,Date,Name,Gender,Age,Mobile No,Country,Occupation,Address,Informant,Emergency Contact,Medical History,Personal History,Find Us,Remarks\n";
      clientData.forEach((row, index) => {
        csvContent += `${index + 1},${row.ClientID},${row.date},${row.name},${
          row.gender
        },${row.age},${row.mobile},${row.country},${row.occupation || ""},${
          row.address || ""
        },${row.informant || ""},${row.emergencyContact || ""},${
          row.medicalHistory || ""
        },${row.personalHistory || ""},${row.findUs || ""},${
          row.remarks || ""
        }\n`;
      });

      // Trigger download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "clients.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error exporting clients:", error);
      setSnackbarMessage("Error exporting clients");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const filteredRows = rows.filter(
    (row) =>
      row.name.toLowerCase().includes(searchText.toLowerCase()) ||
      row.mobile.toLowerCase().includes(searchText.toLowerCase()) ||
      row.ClientID.toLowerCase().includes(searchText.toLowerCase())
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
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}  className="hidemobile">
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
        {user && user.role === "admin" ? (
          <>
            <Button
              onClick={handleExport}
              className="hidemobile"
              variant="outlined"
              sx={{ marginRight: 2 }}
            >
              Export Data
            </Button>
            <Button
              onClick={handleExport}
              className="hidedesktop"
              variant="outlined"
              sx={{ marginRight: 2 }}
              endIcon={<FileDownloadOutlinedIcon />}
            ></Button>
          </>
        ) : null}

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
          getRowId={(row) => row._id}
          components={{ Toolbar: GridToolbar }}
        />
      )}
      {selectedRow && (
        <EditClient
          open={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          client={selectedRow}
          onSave={handleEditSave}
        />
      )}
      <Dialog open={isDeleteDialogOpen} onClose={cancelDelete}>
        <DialogTitle>Delete Client</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this client?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <SnackbarContent
          sx={{ backgroundColor: "#4caf50" }}
          message={snackbarMessage}
        />
      </Snackbar>
    </div>
  );
};

export default ClientsTable;
