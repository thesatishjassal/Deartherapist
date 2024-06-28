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
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

const steps = ["Search Client", "Personal Details"];

const validationSchema = Yup.object({
  mobileNumber: Yup.string(),
  date: Yup.date().required("Date is required"),
  month: Yup.date().required("Month is required"),
  time: Yup.date().required("Time is required"),
  channel: Yup.string().required("Session type is required"),
  facilitatedBy: Yup.string().required("Facilitated by is required"),
  service: Yup.string().required("Service is required"),
  amount: Yup.string(),
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
  const [currentMonth, setCurrentMonth] = React.useState("");

  const apiUrl = `/api/clients`;

  const { contacts, wait, error } = useClientContacts(apiUrl);
  const { clients, isLoading: loadingClients, clienterror } = useGetClients(); // Rename isLoading to avoid conflict

  // Function to get the current month name
  const getCurrentMonthName = () => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const currentMonthIndex = new Date().getMonth();
    return monthNames[currentMonthIndex];
  };

  const formik = useFormik({
    initialValues: {
      mobileNumber: "",
      name: "",
      date: null,
      month: "",
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
          setAlertMessage(data.error || `An error occurred: ${response.status}`);
          throw new Error(data.error || `An error occurred: ${response.status}`);
        }

        // Handle success response
        setCurrentMonth(getCurrentMonthName());
        formik.setFieldValue("month", currentMonth);
        setSuccessMessage("Form submitted successfully!");
        setShowSuccess(true);
        setTimeout(() => {
          setIsFinished(true);
          setLoading(false); // Stop loading
        }, 2000);
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        setLoading(false); // Ensure loading state is stopped in case of error
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

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);

    // Disable Next button if form is invalid
    if (!formik.isValid) {
      setIsNextDisabled(true);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleSearchInputChange = (event) => {
    const searchValue = event.target.value;
    const filtered = contacts.filter((contact) =>
      contact.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setfilteredClients(filtered);
  };

  const handleClientSelect = (clientId) => {
    setSelectedClientId(clientId);
    const selectedClient = clients.find((client) => client.id === clientId);
    setclientEmail(selectedClient.email);
    setclientMobile(selectedClient.phone);
    setAppointmentID(selectedClient.id);
    formik.setFieldValue("mobileNumber", selectedClient.phone);

    // Enable Next button if form is valid
    if (formik.isValid) {
      setIsNextDisabled(false);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
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
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          {activeStep === 0 && (
            <Box sx={{ mt: 2, mb: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Search Client"
                    onChange={handleSearchInputChange}
                  />
                </Grid>
              </Grid>
              {filteredClients && (
                <List>
                  {filteredClients.map((contact) => (
                    <ListItem
                      key={contact.id}
                      button
                      onClick={() => handleClientSelect(contact.id)}
                    >
                      <ListItemAvatar>
                        <Avatar />
                      </ListItemAvatar>
                      <ListItemText primary={contact.name} />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          )}
          {activeStep === 1 && (
            <Box sx={{ mt: 2, mb: 1 }}>
              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="mobileNumber"
                      name="mobileNumber"
                      label="Mobile Number"
                      value={formik.values.mobileNumber}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.mobileNumber &&
                        Boolean(formik.errors.mobileNumber)
                      }
                      helperText={
                        formik.touched.mobileNumber && formik.errors.mobileNumber
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
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
                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                          label="Date"
                          value={formik.values.date}
                          onChange={(date) =>
                            formik.setFieldValue("date", date)
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              error={
                                formik.touched.date &&
                                Boolean(formik.errors.date)
                              }
                              helperText={
                                formik.touched.date && formik.errors.date
                              }
                            />
                          )}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["TimePicker"]}>
                        <TimePicker
                          label="Time"
                          value={formik.values.time}
                          onChange={(time) =>
                            formik.setFieldValue("time", time)
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              error={
                                formik.touched.time &&
                                Boolean(formik.errors.time)
                              }
                              helperText={
                                formik.touched.time && formik.errors.time
                              }
                            />
                          )}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="channel-label">Channel</InputLabel>
                      <Select
                        labelId="channel-label"
                        id="channel"
                        name="channel"
                        value={formik.values.channel}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.channel &&
                          Boolean(formik.errors.channel)
                        }
                      >
                        <MenuItem value="Online">Online</MenuItem>
                        <MenuItem value="Offline">Offline</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="facilitatedBy-label">
                        Facilitated By
                      </InputLabel>
                      <Select
                        labelId="facilitatedBy-label"
                        id="facilitatedBy"
                        name="facilitatedBy"
                        value={formik.values.facilitatedBy}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.facilitatedBy &&
                          Boolean(formik.errors.facilitatedBy)
                        }
                      >
                        <MenuItem value="John Doe">John Doe</MenuItem>
                        <MenuItem value="Jane Smith">Jane Smith</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="service-label">Service</InputLabel>
                      <Select
                        labelId="service-label"
                        id="service"
                        name="service"
                        value={formik.values.service}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.service &&
                          Boolean(formik.errors.service)
                        }
                      >
                        <MenuItem value="Consultation">Consultation</MenuItem>
                        <MenuItem value="Therapy">Therapy</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="amount"
                      name="amount"
                      label="Amount"
                      value={formik.values.amount}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.amount && Boolean(formik.errors.amount)
                      }
                      helperText={formik.touched.amount && formik.errors.amount}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₦</InputAdornment>,
                      }}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </Button>
                  {isStepOptional(activeStep) && (
                    <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                      Skip
                    </Button>
                  )}

                  <Box sx={{ flex: "1 1 auto" }} />
                  <Button
                    onClick={handleNext}
                    disabled={isNextDisabled} // Disable Next button if form is invalid
                  >
                    {activeStep === steps.length - 1 ? "Finish" : "Next"}
                  </Button>
                </Box>
              </form>
            </Box>
          )}
        </React.Fragment>
      )}
      {loading && (
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </Box>
  );
};

