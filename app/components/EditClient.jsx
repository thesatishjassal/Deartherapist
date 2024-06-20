import * as React from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function EditClient({ open, onClose, client, onSave }) {
  const [formData, setFormData] = React.useState(client);

  React.useEffect(() => {
    setFormData(client);
  }, [client]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <BootstrapDialog
      sx={{ width: "100%" }}
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Edit Client
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ width: "100%", padding: 3 }}>
          <TextField
            margin="dense"
            label="Name"
            name="name"
            fullWidth
            value={formData?.name || ""}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Age"
            name="age"
            fullWidth
            value={formData?.age || ""}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Gender"
            name="gender"
            fullWidth
            value={formData?.gender || ""}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Mobile No"
            name="mobile"
            fullWidth
            value={formData?.mobile || ""}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Country"
            name="country"
            fullWidth
            value={formData?.country || ""}
            onChange={handleChange}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
