import * as React from "react";
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

const steps = ["Search Client", "Personal Details"];

const mobileNumbers = [
  "123-456-7890",
  "234-567-8901",
  "345-678-9012",
  "456-789-0123",
  "567-890-1234",
];

const emailAddresses = [
  "example1@example.com",
  "example2@example.com",
  "example3@example.com",
  "example4@example.com",
  "example5@example.com",
];

export default function HorizontalLinearStepper() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [value, setValue] = React.useState(null);
  const [time, setTime] = React.useState(null);
  const [channel, setChannel] = React.useState("");
  const [facilatedby, setFacilatedby] = React.useState("");
  const [service, setService] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [isFinished, setIsFinished] = React.useState(false);

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
      handleSubmit();
      setIsFinished(true);
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
  };

  const handleSubmit = () => {
    const formData = {
      mobileNumber: value,
      email: emailAddresses,
      date: value,
      time: time,
      channel: channel,
      facilitatedBy: facilatedby,
      service: service,
      amount: amount,
    };
    console.log('Form Data:', formData);
    // Here you can add the logic to send the form data to a server or perform other actions with it
  };

  const PersonalDetailStep = () => (
    <React.Fragment>
      <Box sx={{ width: "100%" }}>
        <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} sm={12} md={6}>
            <Autocomplete
              fullWidth
              id="client-mobileno"
              options={mobileNumbers}
              renderInput={(params) => (
                <TextField {...params} label="Select Client Mobile No" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <Autocomplete
              fullWidth
              id="client-email"
              options={emailAddresses}
              renderInput={(params) => (
                <TextField {...params} label="Select Client Email" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <Card className="selectedUser">
              <List sx={{ width: "100%" }}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar
                      alt="Remy Sharp"
                      src="https://mui.com/static/images/avatar/3.jpg"
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary="Remy Sharp"
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="body2"
                        >
                          remysharp@gmail.com | Female
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </React.Fragment>
  );

  const MedicalDetailStep = () => (
    <React.Fragment>
      <Box sx={{ width: "100%" }}>
        <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} sm={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Pick a Date"
                  value={value}
                  onChange={(newValue) => setValue(newValue)}
                  fullWidth
                  size="small"
                />
              </DemoContainer>
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker
                  label="Pick a Time"
                  value={time}
                  onChange={(newTime) => setTime(newTime)}
                  fullWidth
                />
              </DemoContainer>
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="facilated-by">Facilitated By</InputLabel>
              <Select
                labelId="facilated-by"
                id="facilated-by-control"
                value={facilatedby}
                label="Facilitated By"
                onChange={(e) => setFacilatedby(e.target.value)}
              >
                <MenuItem value="SHAVETA BHARDWAJ">
                  Dr. SHAVETA BHARDWAJ
                </MenuItem>
                <MenuItem value="Counselor">Counselor</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="Online-offline">Session Type:</InputLabel>
              <Select
                labelId="Online-offline"
                id="Online-offline-control"
                value={channel}
                label="Session Type"
                placeholder="Choose your session type"
                onChange={(e) => setChannel(e.target.value)}
              >
                <MenuItem value="online">Online</MenuItem>
                <MenuItem value="offline">Offline</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
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
                <MenuItem value="Astrology Session">Astrology Session</MenuItem>
                <MenuItem value="Tarot Card Reading">
                  Tarot Card Reading
                </MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <TextField
              id="amount-control"
              label="Amount"
              fullWidth
              variant="outlined"
              onChange={(e) => setAmount(e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>
    </React.Fragment>
  );

  return (
    <Box sx={{ width: "100%" }}>
      {isFinished ? (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            All steps completed
          </Typography>
          <Button onClick={handleReset}>Reset</Button>
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
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>
          </React.Fragment>
        </>
      )}
    </Box>
  );
}
