import * as React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import MenuItem from "@mui/material/MenuItem";
import Autocomplete from "@mui/material/Autocomplete";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import useClientContacts from "../../hooks/useClientContacts"; // Adjust the path as needed
import useGetClients from "../../hooks/useGetClients"; // Path to your custom hook
import Alert from "@mui/material/Alert";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Radio from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";
import Person from "@mui/icons-material/Person";
import People from "@mui/icons-material/People";
import Apartment from "@mui/icons-material/Apartment";

const steps = ["Search Client", "Personal Details"];

const validationSchema = Yup.object({
  mobileNumber: Yup.string(),
  date: Yup.date().required("Date is required"),
  time: Yup.date().required("Time is required"),
  channel: Yup.string().required("Session type is required"),
  facilitatedBy: Yup.string().required("Facilitated by is required"),
  service: Yup.string().required("Service is required"),
  amount: Yup.number()
    .required("Amount is required")
    .positive("Amount must be positive"),
});

export default function HorizontalLinearStepper() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [isFinished, setIsFinished] = React.useState(false);
  const [loading, setLoading] = React.useState(false); // Loading state
  const [clientEmail, setclientEmail] = React.useState(); // Loading state
  const [clientMobile, setclientMobile] = React.useState(); // Loading state
  const [filteredClients, setfilteredClients] = React.useState(); // Loading state
  const [appointmentID, setAppointmentID] = React.useState(); // Loading state
  const [alertMessage, setAlertMessage] = React.useState("");
  const [showAlert, setShowAlert] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState("");
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [selectedClientId, setSelectedClientId] = React.useState(null);
  const [isNextDisabled, setIsNextDisabled] = React.useState(true); // New state for disabling the Next button

  const apiUrl = `/api/clients`;

  const { contacts, wait, error } = useClientContacts(apiUrl);
  const { clients, isLoading: loadingClients, clienterror } = useGetClients(); // Rename isLoading to avoid conflict

  const formik = useFormik({
    initialValues: {
      mobileNumber: "",
      name: "",
      date: null,
      time: null,
      channel: "",
      facilitatedBy: "",
      service: "",
      amount: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true); // Start loading
      const apiUrl = `/api/clients/${appointmentID}/appointments`;
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      };
      try {
        const response = await fetch(apiUrl, requestOptions);
        const data = await response.json();

        if (!response.ok) {
          setShowAlert(true);
          throw new Error(
            data.error || `An error occurred: ${response.status}`
          );
        }
        // Handle success response
        // console.log("Form submission successful:", data);
        setSuccessMessage("Form submitted successfully!");
        setShowSuccess(true);
        setTimeout(() => {
          // console.log("Form Data:", values);
          setIsFinished(true);
          setLoading(false); // Stop loading
        }, 2000);
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
      }
    },
  });

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    if (activeStep === steps.length - 1) {
      formik.handleSubmit();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setSkipped(new Set());
    setIsFinished(false);
    formik.resetForm();
  };

  const handleMobileNumber = (event, value) => {
    formik.setFieldValue("mobileNumber", value);
    setclientMobile(value);
    console.log(value);
    const sortedClients = clients.filter((client) => client.mobile === value);
    setfilteredClients(sortedClients);
    const matchedClientId =
      sortedClients.length > 0 ? sortedClients[0]._id : null;
    setAppointmentID(matchedClientId);
    setSelectedClientId("");
    formik.setFieldValue(
      "name",
      sortedClients.length > 0 ? sortedClients[0].name : ""
    );
    validatePersonalDetailStep(value, selectedClientId); // Validate on change
  };

  const handleclientIds = (event, value) => {
    setSelectedClientId(value);
    const sortedClients = clients.filter((client) => client.ClientID === value);
    console.log(value);
    setfilteredClients(sortedClients);
    const matchedClientId =
      sortedClients.length > 0 ? sortedClients[0]._id : null;
    setAppointmentID(matchedClientId);
    formik.setFieldValue("mobileNumber", "");
    formik.setFieldValue(
      "name",
      sortedClients.length > 0 ? sortedClients[0].name : ""
    );
    validatePersonalDetailStep(formik.values.mobileNumber, value); // Validate on change
  };

  const validatePersonalDetailStep = (mobileNumber, clientId) => {
    setIsNextDisabled(!(mobileNumber || clientId));
  };

  const PersonalDetailStep = () => (
    <Box sx={{ width: "100%", px: 1, py: 3 }}>
      <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12} sm={12} md={12}>
          <Autocomplete
            fullWidth
            id="client-mobileno"
            options={contacts && contacts.mobileNumbers}
            value={formik.values.mobileNumber}
            onChange={handleMobileNumber}
            onBlur={() => formik.setFieldTouched("mobileNumber", true)}
            renderInput={(params) => (
              <TextField
                fullWidth
                {...params}
                label="Select Client Mobile No"
                error={
                  formik.touched.mobileNumber &&
                  Boolean(formik.errors.mobileNumber)
                }
                helperText={
                  formik.touched.mobileNumber && formik.errors.mobileNumber
                }
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Autocomplete
            fullWidth
            id="client-Id"
            options={contacts && contacts.clientIds}
            onChange={handleclientIds}
            renderInput={(params) => (
              <TextField
                fullWidth
                {...params}
                label="Select Client ID"
                error={
                  formik.touched.selectedClientId &&
                  Boolean(formik.errors.selectedClientId)
                }
                helperText={
                  formik.touched.selectedClientId &&
                  formik.errors.selectedClientId
                }
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
        </Grid>
      </Grid>
    </Box>
  );

  const ServiceDetailStep = () => (
    <Box sx={{ width: "100%", px: 1, py: 3 }}>
      <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12} sm={12} md={12}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                label="Select Date"
                fullWidth
                id="date"
                name="date"
                value={formik.values.date}
                onChange={(value) => formik.setFieldValue("date", value)}
                error={formik.touched.date && Boolean(formik.errors.date)}
                helperText={formik.touched.date && formik.errors.date}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["TimePicker"]}>
              <TimePicker
                label="Select Time"
                fullWidth
                id="time"
                name="time"
                value={formik.values.time}
                onChange={(value) => formik.setFieldValue("time", value)}
                error={formik.touched.time && Boolean(formik.errors.time)}
                helperText={formik.touched.time && formik.errors.time}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Select Session Type
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="channel"
              name="channel"
              label="Select Session Type"
              value={formik.values.channel}
              onChange={formik.handleChange}
              error={formik.touched.channel && Boolean(formik.errors.channel)}
            >
              <MenuItem value={"inperson"}>Inperson</MenuItem>
              <MenuItem value={"online"}>Online</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Select Facilitated By
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="facilitatedBy"
              name="facilitatedBy"
              label="Select Facilitated By"
              value={formik.values.facilitatedBy}
              onChange={formik.handleChange}
              error={
                formik.touched.facilitatedBy &&
                Boolean(formik.errors.facilitatedBy)
              }
            >
              <MenuItem value={"Mr.x"}>Mr.X</MenuItem>
              <MenuItem value={"Mr.y"}>Mr.Y</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Select Service
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="service"
              name="service"
              label="Select Service"
              value={formik.values.service}
              onChange={formik.handleChange}
              error={formik.touched.service && Boolean(formik.errors.service)}
            >
              <MenuItem value={"Physical health"}>Physical health</MenuItem>
              <MenuItem value={"Mental health"}>Mental health</MenuItem>
              <MenuItem value={"Dental health"}>Dental health</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <TextField
            fullWidth
            id="amount"
            name="amount"
            label="Amount"
            type="number"
            value={formik.values.amount}
            onChange={formik.handleChange}
            error={formik.touched.amount && Boolean(formik.errors.amount)}
            helperText={formik.touched.amount && formik.errors.amount}
          />
        </Grid>
      </Grid>
    </Box>
  );

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const containerStyles = isMobile ? { mt: 2, px: 2 } : { mt: 5, px: 10 };

  return (
    <Box sx={{ width: "100%", ...containerStyles }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          {isFinished ? (
            <>
              {showAlert && (
                <Alert severity="error" onClose={() => setShowAlert(false)}>
                  {alertMessage}
                </Alert>
              )}
              {showSuccess && (
                <Alert severity="success" onClose={() => setShowSuccess(false)}>
                  {successMessage}
                </Alert>
              )}
            </>
          ) : (
            <Typography sx={{ mt: 2, mb: 1 }}>
              Submitting form, please wait...
            </Typography>
          )}
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          {activeStep === 0 && <PersonalDetailStep />}
          {activeStep === 1 && <ServiceDetailStep />}
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleNext} disabled={isNextDisabled}>
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        </React.Fragment>
      )}
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}
