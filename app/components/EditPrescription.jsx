import React, { useEffect, useState } from "react";
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
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useFormik } from "formik";
import * as Yup from "yup";
import useAppointments from "../../hooks/useAppointments"; // Adjust the path as necessary
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

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

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const validationSchema = Yup.object({
  // appointmentID: Yup.string().required("Appointment ID is required"),
  service: Yup.string(),
  suggestions: Yup.string(),
  symptoms: Yup.string(),
  followUp: Yup.string(),
  diagnoses: Yup.array(),
});

const Editprescription = ({
  clientId,
  appointmentId,
  prescriptionId,
  open,
  handleClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [savedData, setsavedData] = useState("");
  const { appointments, meetloading, error } = useAppointments(clientId);
  console.log(clientId, appointmentId, prescriptionId);
  const formik = useFormik({
    initialValues: {
      appointmentID: "",
      service: "",
      suggestions: "",
      symptoms: "",
      followUp: "",
      diagnoses: [],
      file: null, 
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);

        const formData = new FormData();
        formData.append("appointmentID", values.appointmentID);
        formData.append("service", values.service);
        formData.append("suggestions", values.suggestions);
        formData.append("symptoms", values.symptoms);
        formData.append("followUp", values.followUp);
        values.diagnoses.forEach((diagnosis, index) => {
          formData.append(`diagnoses[${index}]`, diagnosis);
        });
        if (values.file) {
          formData.append("file", values.file);
        }

        let apiUrl = `http://localhost:5500/api/clients/${clientId}/appointments/${appointmentId}/prescriptions/${prescriptionId}`;
        const requestOptions = {
          method: "PATCH",
          body: formData,
        };
        const response = await fetch(apiUrl, requestOptions);
        const data = await response.json();

        if (!response.ok) {
          setOpenError(true);
          setAlertMessage(
            data.error || `An error occurred: ${response.status}`
          );
          throw new Error(
            data.error || `An error occurred: ${response.status}`
          );
        }

        setSuccessMessage("Prescription Updated successfully!");
        setOpenSuccess(true);
        window.location.reload(); // Reload the page after successful form submission
        setTimeout(() => {
          console.log("Form Data:", values);
          handleClose(); // Close the modal after successful submission
        }, 2000);
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleFileChange = (event) => {
    formik.setFieldValue("file", event.currentTarget.files[0]);
  };

  const handleChangeDiagnoses = (event, newValue) => {
    const result = newValue.reduce(
      (res, el) => res.concat(Array(el.title).fill(el.title)),
      []
    );
    formik.setFieldValue("diagnoses", result);
  };

  return (
    <React.Fragment>
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
            <form onSubmit={formik.handleSubmit}>
              <Grid
                container
                rowSpacing={3}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid item xs={12} sm={12} md={12}>
                  <FormControl
                    fullWidth
                    error={
                      formik.touched.service && Boolean(formik.errors.service)
                    }
                  >
                    <InputLabel id="service">Service</InputLabel>
                    <Select
                      labelId="service"
                      id="service-control"
                      {...formik.getFieldProps("service")}
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
                    {formik.touched.service && formik.errors.service ? (
                      <Typography variant="caption" sx={{ color: "red" }}>
                        {formik.errors.service}
                      </Typography>
                    ) : null}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <FormControl fullWidth>
                    <Autocomplete
                      multiple
                      id="checkboxes-tags-demo"
                      options={diagnoses}
                      disableCloseOnSelect
                      // value={formik.values.diagnoses} // Set value prop to maintain selected diagnoses
                      onChange={handleChangeDiagnoses}
                      getOptionLabel={(option) => option.title}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          {option.title}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Choose diagnoses"
                          placeholder="Favorites"
                          error={
                            formik.touched.diagnoses &&
                            Boolean(formik.errors.diagnoses)
                          }
                        />
                      )}
                    />
                    {formik.touched.diagnoses && formik.errors.diagnoses ? (
                      <Typography variant="caption" sx={{ color: "red" }}>
                        {formik.errors.diagnoses}
                      </Typography>
                    ) : null}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <TextField
                    id="outlined-multiline-static-suggestions"
                    label="Suggestions"
                    multiline
                    fullWidth
                    rows={2}
                    {...formik.getFieldProps("suggestions")}
                    error={
                      formik.touched.suggestions &&
                      Boolean(formik.errors.suggestions)
                    }
                  />
                  {formik.touched.suggestions && formik.errors.suggestions ? (
                    <Typography variant="caption" sx={{ color: "red" }}>
                      {formik.errors.suggestions}
                    </Typography>
                  ) : null}
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <TextField
                    id="outlined-multiline-static-symptoms"
                    label="Symptoms"
                    multiline
                    fullWidth
                    rows={2}
                    {...formik.getFieldProps("symptoms")}
                    error={
                      formik.touched.symptoms && Boolean(formik.errors.symptoms)
                    }
                  />
                  {formik.touched.symptoms && formik.errors.symptoms ? (
                    <Typography variant="caption" sx={{ color: "red" }}>
                      {formik.errors.symptoms}
                    </Typography>
                  ) : null}
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <TextField
                    id="outlined-multiline-static-follow-up"
                    label="Follow-up"
                    multiline
                    fullWidth
                    rows={2}
                    {...formik.getFieldProps("followUp")}
                    error={
                      formik.touched.followUp && Boolean(formik.errors.followUp)
                    }
                  />
                  {formik.touched.followUp && formik.errors.followUp ? (
                    <Typography variant="caption" sx={{ color: "red" }}>
                      {formik.errors.followUp}
                    </Typography>
                  ) : null}
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Button
                    fullWidth
                    component="label"
                    variant="outline"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload file
                    <VisuallyHiddenInput
                      type="file"
                      onChange={handleFileChange}
                    />
                  </Button>
                </Grid>
              </Grid>
              <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={loading}
              >
                <CircularProgress color="inherit" />
              </Backdrop>
            </form>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          <Button autoFocus type="submit" onClick={formik.handleSubmit}>
            Save
          </Button>
        </DialogActions>
      </BootstrapDialog>

      {/* Snackbar for Success */}
      <Snackbar
        open={openSuccess}
        autoHideDuration={6000}
        onClose={() => setOpenSuccess(false)}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setOpenSuccess(false)}
          severity="success"
        >
          {successMessage}
        </MuiAlert>
      </Snackbar>

      {/* Snackbar for Error */}
      <Snackbar
        open={openError}
        autoHideDuration={6000}
        onClose={() => setOpenError(false)}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setOpenError(false)}
          severity="error"
        >
          {alertMessage}
        </MuiAlert>
      </Snackbar>
    </React.Fragment>
  );
};

// List of diagnoses
const diagnoses = [
  { title: "BPD F60.3" },
  { title: "APD F60.2" },
  { title: "NPD F60.81" },
  { title: "PPD 60.0" },
  { title: "SAD F40.10" },
  { title: "AJOAPHOBIA F40.0" },
  { title: "PTSD F43.10" },
  { title: "B2D F31.81" },
  { title: "OCD" },
  { title: "MDD PERSISTENT 34.1" },
  { title: "MDD(SINGLE EPISODE)" },
  { title: "MDD RECURRENT EPISODE" },
  { title: "DISSOCIATIVE IDENTITY DISORDER F44.81" },
  { title: "ADHD F90.1" },
  { title: "ALCOHOL USE DISORDER F10.20" },
  { title: "OTHER" },
];

export default Editprescription;
