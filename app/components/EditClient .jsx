import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

const EditClient = ({ open, onClose, client, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    age: "",
    mobile: "",
    maritalStatus: "",
    country: "",
    occupation: "",
    address: "",
    informant: "",
    emergencyContact: "",
    medicalHistory: "",
    personalHistory: "",
    findUs: "",
    remarks: "",
  });

  useEffect(() => {
    if (client) {
      setFormData({ ...client });
    }
  }, [client]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Client</DialogTitle>
      <DialogContent>
        <TextField
          name="name"
          label="Name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Gender</InputLabel>
          <Select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
        <TextField
          name="age"
          label="Age"
          value={formData.age}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          name="mobile"
          label="Mobile No"
          value={formData.mobile}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          name="maritalStatus"
          label="Marital Status"
          value={formData.maritalStatus}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          name="country"
          label="Country"
          value={formData.country}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          name="occupation"
          label="Occupation"
          value={formData.occupation}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          name="address"
          label="Address"
          value={formData.address}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          name="informant"
          label="Informant"
          value={formData.informant}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          name="emergencyContact"
          label="Emergency Contact"
          value={formData.emergencyContact}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          name="medicalHistory"
          label="Medical History"
          value={formData.medicalHistory}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          name="personalHistory"
          label="Personal History"
          value={formData.personalHistory}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          name="findUs"
          label="How did you find us?"
          value={formData.findUs}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          name="remarks"
          label="Remarks"
          value={formData.remarks}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditClient;
