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

  const handleAmountChange = (event) => {
    formik.setFieldValue("amount", event.target.value);
  };

  const handleAmountBlur = (event) => {
    formik.setFieldTouched("amount", true);
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
            value={selectedClientId}
            renderInput={(params) => (
              <TextField fullWidth {...params} label="Select Client Id" />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
          <Card>
            <List sx={{ width: "100%" }} className="themeBg">
              {loadingClients ? (
                <p>Wait...</p>
              ) : (
                filteredClients &&
                filteredClients.map((client) => (
                  <ListItem
                    key={client.id}
                    className="selectedUser"
                    alignItems="flex-start"
                  >
                    <ListItemAvatar>
                      <Avatar
                        alt="Remy Sharp"
                        src={
                          client.gender === "male"
                            ? "/images/avatar-man.jpg"
                            : "/images/girl_avatar.webp"
                        }
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={client.name}
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                          >
                            {client.email} | {client.gender}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                ))
              )}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const MedicalDetailStep = () => (
    <Box sx={{ width: "100%", px: 1, py: 3 }}>
      <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12} sm={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Pick a Date"
              value={formik.values.date}
              onChange={(newValue) => {
                formik.setFieldValue("date", newValue);
                formik.setFieldTouched("date", true, true);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  value={format(day, "dd/MM/yyyy")} // Format example: day/month/year
                  fullWidth
                  error={formik.touched.date && Boolean(formik.errors.date)}
                  helperText={formik.touched.date && formik.errors.date}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="Pick a Time"
              value={formik.values.time}
              onChange={(newTime) => {
                formik.setFieldValue("time", newTime);
                formik.setFieldTouched("time", true, true);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={formik.touched.time && Boolean(formik.errors.time)}
                  helperText={formik.touched.time && formik.errors.time}
                />
              )}
              ampm={false} // 24-hour format
              format="HH:mm" // Format example: hour:minute:second
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} sm={12} md={6}>
          <FormControl
            fullWidth
            error={
              formik.touched.facilitatedBy &&
              Boolean(formik.errors.facilitatedBy)
            }
          >
            <InputLabel id="facilitated-by">Facilitated By</InputLabel>
            <Select
              labelId="facilitated-by"
              id="facilitated-by-control"
              value={formik.values.facilitatedBy}
              label="Facilitated By"
              onChange={(e) =>
                formik.setFieldValue("facilitatedBy", e.target.value)
              }
            >
              <MenuItem value="SHAVETA BHARDWAJ">Dr. SHAVETA BHARDWAJ</MenuItem>
              <MenuItem value="Counselor">Counselor</MenuItem>
            </Select>
            {formik.touched.facilitatedBy && formik.errors.facilitatedBy && (
              <Typography color="error">
                {formik.errors.facilitatedBy}
              </Typography>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <FormControl
            fullWidth
            error={formik.touched.channel && Boolean(formik.errors.channel)}
          >
            <InputLabel id="session-type">Mode</InputLabel>
            <Select
              labelId="session-type"
              id="session-type-control"
              value={formik.values.channel}
              label="Session Type"
              onChange={(e) => formik.setFieldValue("channel", e.target.value)}
            >
              <MenuItem value="online">Online</MenuItem>
              <MenuItem value="offline">Offline</MenuItem>
            </Select>
            {formik.touched.channel && formik.errors.channel && (
              <Typography color="error">{formik.errors.channel}</Typography>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <FormControl
            fullWidth
            error={formik.touched.service && Boolean(formik.errors.service)}
          >
            <InputLabel id="service">Service</InputLabel>
            <Select
              labelId="service"
              id="service-control"
              value={formik.values.service}
              label="Service"
              onChange={(e) => formik.setFieldValue("service", e.target.value)}
            >
              <MenuItem value="Counselling Session">
                Counselling Session
              </MenuItem>
              <MenuItem value="Couple Session">Couple Session</MenuItem>
              <MenuItem value="Therapy">Therapy</MenuItem>
              <MenuItem value="Astrology Session">Astrology Session</MenuItem>
              <MenuItem value="Tarot Card Reading">Tarot Card Reading</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
            {formik.touched.service && formik.errors.service && (
              <Typography color="error">{formik.errors.service}</Typography>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <TextField
            id="amount-control"
            label="Amount"
            fullWidth
            variant="outlined"
            onChange={(e) => {
              formik.handleChange(e);
              console.log("Formik Values:", formik.values); // Check if amount updates here
            }}
            onBlur={(e) => {
              formik.handleBlur(e);
              console.log("Formik Touched:", formik.touched); // Check if amount touched state updates
            }}
            value={formik.values.amount}
            error={formik.touched.amount && Boolean(formik.errors.amount)}
            helperText={formik.touched.amount && formik.errors.amount}
          />
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ width: "100%" }}>
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
      {isFinished ? (
        <Box sx={{ textAlign: "center", mt: 2 }}>
          {/* <Typography variant="h6" gutterBottom>
            All steps completed
          </Typography>
          <Button onClick={handleReset}>Reset</Button> */}
        </Box>
      ) : (
        <>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
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
          <React.Fragment>
            {activeStep === 0 && <PersonalDetailStep />}
            {activeStep === 1 && <MedicalDetailStep />}
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
        </>
      )}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}
