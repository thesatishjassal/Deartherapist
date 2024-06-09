"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import MyAppointments from "../components/AppointmentStepForm";

export default function AddAppointment() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div>
      <Button
        variant="contained"
        className="btn clients__btn"
        onClick={handleOpen}
      >
        Add Appointment
      </Button>

      <Dialog 
        className="responsive-dialog"
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent className="modalapp-body">
          <MyAppointments />
        </DialogContent>
      </Dialog>
    </div>
  );
}
