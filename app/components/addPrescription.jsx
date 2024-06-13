import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Diagnouse from "../components/Diagnouse"

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function AddPrescription() {
  const [open, setOpen] = React.useState(false);
  const [service, setService] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open dialog
      </Button>
      <BootstrapDialog
        sx={{ width: "100%" }}
        className="responsive-dialog"
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Add Prescription 
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers className="modalapp-body">
          <Box sx={{ width: "100%", padding: 3 }}>
            <Grid
              container
              rowSpacing={3}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={12} sm={12} md={12}>
                <FormControl fullWidth>
                  <InputLabel id="service">Service</InputLabel>
                  <Select
                    labelId="service"
                    id="service-control"
                    value={service}
                    label="Service"
                    placeholder="Select a service"
                    onChange={(e) => setService(e.target.value)}
                  >
                    <MenuItem value="Counselling Session">
                      Counselling Session
                    </MenuItem>
                    <MenuItem value="Couple Session">Couple Session</MenuItem>
                    <MenuItem value="Therapy">Therapy</MenuItem>
                    <MenuItem value="Astrology Session">
                      Astrology Session
                    </MenuItem>
                    <MenuItem value="Tarot Card Reading">
                      Tarot Card Reading
                    </MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                {" "}
                <Diagnouse
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                {" "}
                <TextField
                  id="outlined-multiline-static"
                  label="Suggestions"
                  multiline
                  fullWidth
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                {" "}
                <TextField
                  id="outlined-multiline-static"
                  label="Symptoms"
                  multiline
                  fullWidth
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                {" "}
                <TextField
                  id="outlined-multiline-static"
                  label="Follow-up"
                  multiline
                  fullWidth
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                {" "}
                <Button
                  fullWidth
                  component="label"
                  role={undefined}
                  variant="outline"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                >
                  Upload file
                  <VisuallyHiddenInput type="file" />
                </Button>
              </Grid>
            </Grid>{" "}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Save 
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
